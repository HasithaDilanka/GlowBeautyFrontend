import { useState } from "react";

export default function ImageSlider({ images = [] }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full max-w-[400px] flex flex-col gap-4">
                <div className="w-full aspect-square bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center shadow-inner">
                    <span className="text-gray-400 text-lg">No images available</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[400px] flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full aspect-square bg-white rounded-2xl overflow-hidden border-[3px] border-blue-100 shadow-xl relative group transition-all duration-500">
                <img
                    src={images[activeImageIndex]}
                    alt={`Product view ${activeImageIndex + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto py-1 px-1 scrollbar-hide">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 relative group transition-transform duration-300 ${
                            activeImageIndex === index
                                ? "border-blue-500 ring-2 ring-blue-300 scale-110 shadow-lg"
                                : "border-gray-200 hover:border-blue-300 hover:scale-105 shadow-sm"
                        }`}
                    >
                        <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {activeImageIndex !== index && (
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-200 rounded-xl" />
                        )}
                    </button>
                ))}
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="text-center text-sm font-medium text-gray-600 mt-1">
                    Viewing <span className="text-blue-600">{activeImageIndex + 1}</span> of{" "}
                    <span className="text-blue-600">{images.length}</span> images
                </div>
            )}
        </div>
    );
}
