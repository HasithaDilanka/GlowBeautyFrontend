
export function getCart() {
    let cartInString = localStorage.getItem("cart");

    if (cartInString == null) {
        cartInString = "[]"
        localStorage.setItem("cart", cartInString);
    }

    const cart = JSON.parse(cartInString);
    return cart;
}

export function addToCart(product, qty) {
    const cart = getCart()

    const existingProductIndex = cart.findIndex((item) => {
        return item.productId === product.productId;
    })

    if (existingProductIndex == -1) {
        // Add safety check for product.price
        cart.push({
            productId: product.productId,
            quantity: qty,
            price: product.price || 0, // Default to 0 if price is undefined
            name: product.name || 'Unknown Product',
            altNames: product.altNames || [],
            image: product.images && product.images[0] ? product.images[0] : ''
        })
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        const newQty = cart[existingProductIndex].quantity + qty;
        if (newQty <= 0) {
            // Remove the item from cart
            cart.splice(existingProductIndex, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            cart[existingProductIndex].quantity = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }
}

export function getTotal() {
    const cart = getCart();
    let total = 0;
    cart.forEach((item) => {
        // Add safety check for undefined price
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        total += quantity * price;
    })
    return total;
}