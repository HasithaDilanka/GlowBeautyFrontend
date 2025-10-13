// salesController.js
import Order from '../models/order.js';
import { isAdmin } from './userController.js';

// Category mapping - you can move this to a separate config file if needed
const PRODUCT_CATEGORIES = {
    // Add your actual product names and their corresponding categories here
    // Example mappings - update these with your actual product names
    'Moisturizing Cream': 'Cream',
    'Night Cream': 'Cream',
    'Day Cream': 'Cream',
    'Anti-Aging Cream': 'Cream',
    
    'Gentle Face Wash': 'Face Wash',
    'Foaming Face Wash': 'Face Wash',
    'Cleansing Face Wash': 'Face Wash',
    
    'Compact Powder': 'Power',
    'Setting Powder': 'Power',
    'Face Powder': 'Power',
    
    'Vitamin C Serum': 'Serum',
    'Hydrating Serum': 'Serum',
    'Anti-Aging Serum': 'Serum',
    'Niacinamide Serum': 'Serum',
    
    'Matte Lipstick': 'Lipstick',
    'Glossy Lipstick': 'Lipstick',
    'Liquid Lipstick': 'Lipstick',
};

// Function to get category from product name
function getProductCategory(productName) {
    // Define the exact 5 categories we want
    const validCategories = ['Cream', 'Face Wash', 'Power', 'Serum', 'Lipstick'];
    
    // First, check if the product name exactly matches a category
    if (validCategories.includes(productName)) {
        return productName;
    }
    
    // If not, look for it in the mapping
    if (PRODUCT_CATEGORIES[productName]) {
        return PRODUCT_CATEGORIES[productName];
    }
    
    // If not found in mapping, try to categorize based on keywords
    const lowerProductName = productName.toLowerCase();
    
    if (lowerProductName.includes('cream')) {
        return 'Cream';
    } else if (lowerProductName.includes('face wash') || lowerProductName.includes('cleanser') || lowerProductName.includes('facewash')) {
        return 'Face Wash';
    } else if (lowerProductName.includes('powder')) {
        return 'Power';
    } else if (lowerProductName.includes('serum')) {
        return 'Serum';
    } else if (lowerProductName.includes('lipstick') || lowerProductName.includes('lip')) {
        return 'Lipstick';
    }
    
    // If no valid category found, return null (don't count this product)
    console.log(`Warning: Could not categorize product: ${productName}`);
    return null;
}

// Get sales data for the past 7 days (category-wise)
export async function getSalesData(req, res) {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Please login to view sales data" });
        }

        // Check if user is admin
        if (!isAdmin(req)) {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        // Calculate date range for past 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        // Format dates for response
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        // Fetch orders from the past 7 days
        const orders = await Order.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Initialize ONLY the 5 categories we want - no other categories allowed
        const categoryCount = {
            'Cream': 0,
            'Face Wash': 0,
            'Power': 0,
            'Serum': 0,
            'Lipstick': 0
        };
        
        // Count products by category from all orders
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = getProductCategory(item.name);
                
                // ONLY count products that match our exact 5 categories
                if (category && categoryCount.hasOwnProperty(category)) {
                    categoryCount[category] += item.quantity;
                    console.log(`Product: ${item.name} -> Category: ${category}, Quantity: ${item.quantity}`);
                } else {
                    console.log(`Skipped uncategorized product: ${item.name}`);
                }
            });
        });

        // Convert to chart format - maintain exact order of categories
        const categoryOrder = ['Cream', 'Face Wash', 'Power', 'Serum', 'Lipstick'];
        const chartData = categoryOrder.map(categoryName => ({
            product: categoryName,
            count: categoryCount[categoryName]
        }));

        // Calculate totals - only from our 5 categories
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalProductsSold = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);

        console.log("Category data being sent:", chartData);
        console.log("Category counts:", categoryCount);
        console.log("Total products sold by category:", totalProductsSold);

        res.status(200).json({
            success: true,
            dateRange: {
                startDate: formattedStartDate,
                endDate: formattedEndDate
            },
            chartData: chartData,
            summary: {
                totalOrders: totalOrders,
                totalRevenue: totalRevenue,
                totalProductsSold: totalProductsSold
            }
        });

    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}

// Get detailed sales analytics by category
export async function getDetailedSalesAnalytics(req, res) {
    try {
        if (!req.user || !isAdmin(req)) {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        const { days = 7 } = req.query;
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Fetch orders
        const orders = await Order.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Process category analytics - ONLY for our 5 categories
        const categoryAnalytics = {
            'Cream': { totalQuantity: 0, totalRevenue: 0, orderCount: 0, products: [] },
            'Face Wash': { totalQuantity: 0, totalRevenue: 0, orderCount: 0, products: [] },
            'Power': { totalQuantity: 0, totalRevenue: 0, orderCount: 0, products: [] },
            'Serum': { totalQuantity: 0, totalRevenue: 0, orderCount: 0, products: [] },
            'Lipstick': { totalQuantity: 0, totalRevenue: 0, orderCount: 0, products: [] }
        };

        orders.forEach(order => {
            order.items.forEach(item => {
                const category = getProductCategory(item.name);
                
                // Only process products with our exact 5 categories
                if (category && categoryAnalytics.hasOwnProperty(category)) {
                    categoryAnalytics[category].totalQuantity += item.quantity;
                    categoryAnalytics[category].totalRevenue += item.price * item.quantity;
                    categoryAnalytics[category].orderCount += 1;
                    
                    // Track individual products within category
                    const existingProduct = categoryAnalytics[category].products.find(p => p.name === item.name);
                    if (existingProduct) {
                        existingProduct.quantity += item.quantity;
                        existingProduct.revenue += item.price * item.quantity;
                    } else {
                        categoryAnalytics[category].products.push({
                            name: item.name,
                            quantity: item.quantity,
                            revenue: item.price * item.quantity,
                            avgPrice: item.price
                        });
                    }
                }
            });
        });

        // Convert to array format - maintain order
        const categoryOrder = ['Cream', 'Face Wash', 'Power', 'Serum', 'Lipstick'];
        const categoryAnalyticsArray = categoryOrder.map(category => ({
            category: category,
            ...categoryAnalytics[category],
            avgPrice: categoryAnalytics[category].totalRevenue / categoryAnalytics[category].totalQuantity || 0
        }));

        // Get daily sales trend
        const dailySales = await Order.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date"
                        }
                    },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            dateRange: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                days: parseInt(days)
            },
            categoryAnalytics: categoryAnalyticsArray,
            dailyTrend: dailySales
        });

    } catch (error) {
        console.error("Error fetching detailed sales analytics:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
}