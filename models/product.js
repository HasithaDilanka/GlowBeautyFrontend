import mongoose from "mongoose";

const productSchima = new mongoose.Schema({

    productId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    altNames: {
        type: [String],
        default: []
    },

    labelledPrice: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    images: {
        type: [String],
        default: ["/default-product.png"]
    },

    description: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    category: {
        type: String,
        required: true,
        default: "Cosmetic"
    },

});

const Product = mongoose.model("products",productSchima)
export default Product;