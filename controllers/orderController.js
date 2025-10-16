import Order from '../models/order.js';
import Product from '../models/product.js';
import { isAdmin } from './userController.js';


export async function createOrder(req, res) {
    try {
        if (req.user == null) {
            return res.status(401).json({ message: "Please login to create an order" });
        }

        //CBC00202

        const latestOrder = await Order.findOne().sort({ date: -1 }).limit(1);

        let orderId = "CBC00202"

        if (latestOrder && latestOrder.orderId) {

            const latOrderIdString = latestOrder.orderId;   // get the latest order ID as a string
            const latOrderIdWitoutPrefix = latOrderIdString.replace("CBC", "");  // remove the prefix "CBC"
            const latestOrderIdInteger = parseInt(latOrderIdWitoutPrefix);  // convert to integer
            const newOrderIdInteger = latestOrderIdInteger + 1;    // increment the latest order ID by 1
            const newOrderIdWithPrefix = newOrderIdInteger.toString().padStart(5, '0'); // pad with zeros to ensure 5 digits
            orderId = "CBC" + newOrderIdWithPrefix;   // add the prefix "CBC" back

        }

        const items = [];
        let total = 0;

        // Validate items

        if (req.body.items !== null && Array.isArray(req.body.items)) {

            for (let i = 0; i < req.body.items.length; i++) {
                let item = req.body.items[i];

                let product = await Product.findOne({
                    productId: item.productId
                });

                if (product == null) {

                    res.status(400).json({ message: "Invalid product ID: " + item.productId });
                    return
                }

                items[i] = {
                    productId: item.productId,
                    name: product.name,
                    image: product.images[0], // Use the first image of the product
                    price: product.price,
                    quantity: item.quantity
                }

                total += product.price * item.quantity; // Calculate total price
            }
            req.body.items = items; // Update the items in the request body

        } else {
            return res.status(400).json({ message: "Invalid items format" });
        }

        const order = new Order({
            orderId: orderId,
            email: req.user.email,
            name: req.user.firstName + " " + req.user.lastName,
            address: req.body.address,
            phone: req.body.phone,
            items: req.body.items,
            total: total,

        });

        // Add items to the order
        const result = await order.save();
        res.status(201).json({ message: "Order created successfully", orderId: orderId });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// Function to get all orders for a user
export async function getOrders(req, res) {

    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Please login to view orders" });
        }

        let orders;
        let orderCount;
        let totalPages;

        if (req.user.role === "admin") {
            // Admin: fetch all orders with pagination

            orderCount = await Order.countDocuments();          //database eke orders kiyak yhiyanavada balanava 
            totalPages = Math.ceil(orderCount / limit);         //total pages ganen bedala gannava 

            orders = await Order.find()
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ date: -1 });

        } else {
            // Regular user: fetch only their orders with pagination
            orderCount = await Order.countDocuments({ email: req.user.email });
            totalPages = Math.ceil(orderCount / limit);

            orders = await Order.find({ email: req.user.email })        //page pramanaya limit karanava 
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ date: -1 });
        }

        // Return the response with orders and pagination info
        return res.status(200).json({
            orders: orders,
            totalPages: totalPages,
            currentPage: page,
            totalOrders: orderCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export function updateOrder(req, res) {
    if (isAdmin(req)) {
        const orderId = req.params.orderId;
        const status = req.body.status;
        const note = req.body.note;

        Order.findOneAndUpdate(
            { orderId: orderId }, // Changed from orderID to orderId to match schema
            { status: status, note: note },
            { new: true }
        ).then((updatedOrder) => {
            if (updatedOrder) {
                res.json({
                    message: "Order updated successfully",
                    order: updatedOrder,
                });
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        }).catch((error) => {
            console.error("Error updating order:", error);
            res.status(500).json({ message: "Failed to update order" });
        });
    } else {
        res.status(403).json({
            message: "You are not authorized to update orders"
        });
    }
}



