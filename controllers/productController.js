import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {

    //only create product in admin (user controller eken genave)

    if (!isAdmin(req)) {
        return res.status(403).json({ message: "access denied. admin only" });
    }
    const product = new Product(req.body)

    try {
        const response = await product.save()

        res.json({
            message: "Product created successfully",
            product: response
        })

    } catch (error) {
        console.log("Error creating product:", error)
        return res.status(500).json({ message: "Failed to create product" })
    }
}


//product fetch karaganna

export async function getProducts(req, res) {
    try {
        if (isAdmin(req)) {                                  //admin kenek nn illane okkama eva yavanna onin
            const products = await Product.find();
            res.json(products);
        }
        else {                                              //wenath kenek nn illane eyata available eva vitharai yavanne 
            const products = await Product.find({ isAvailable: true });
            res.json(products);
        }

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
}


//product delete karaganna

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "access denied. admin only" });
        return;
    }

    try {

        const productId = req.params.productId;

        await Product.deleteOne({
            productId: productId
        }); // Delete the product by ID

        res.json({
            message: "Product deleted successfully"

        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to delete product" });
    }
}


//update product 

export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "access denied. admin only" });
        return;
    }
    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId; // Set the productId in the data object

    try {
        await Product.updateOne(
            { productId: productId }, // Find the product by ID
            data  // Update the product with the new data
        );
        res.json({
            message: "Product updated successfully",
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
}


//get product infomation 

export async function getProductInfo(req, res) {

    try {
        const productId = req.params.productId;
        const product = await Product.findOne({ productId: productId });

        if (product == null) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Check if the user is an admin
        if (isAdmin(req)) {

            res.json(product); // Return the full product information for admin


        } else {
            if (product.isAvailable) { // If the user is not an admin, check if the product is available
                res.json(product); // Return the product information if available
            } else {
                res.status(404).json({ message: "Product not available" }); // If not available, return 404
                return;
            }
        }
    } catch (error) {
        console.error("Error fetching product info:", error);
        res.status(500).json({ message: "Failed to fetch product info" });

    }
}