export default function ProductCard({ name, price, image }) {
    return (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 p-4 max-w-xs mx-auto text-center hover:shadow-2xl transition duration-300">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
            <p className="text-lg text-green-600 font-bold mb-4">{price}</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300">
                Add to Cart
            </button>
        </div>
    );
}
