import express from 'express'
import { createProduct, deleteProduct, getProductInfo, getProducts, searchProducts, updateProduct, getProductAnalytics } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/", createProduct)
productRouter.get("/", getProducts)
productRouter.get("/analytics", getProductAnalytics) // NEW ROUTE - Must be before /:productId
productRouter.get("/:productId", getProductInfo)
productRouter.delete("/:productId", deleteProduct)
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:query", searchProducts)

export default productRouter;