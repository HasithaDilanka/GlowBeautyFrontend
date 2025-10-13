export default function Paginator({ currentPage, totalPages, setCurrentPage, limit, setLimit }) {
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1);
    };

    return (
        <div className="w-full flex flex-row justify-center items-center gap-5 p-2  rounded-xl shadow-lg">
            {/* Page selector */}
            <select
                className="w-[130px] h-[42px] rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value))}
            >
                {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index} value={index + 1}>
                        Page {index + 1}
                    </option>
                ))}
            </select>

            {/* Limit selector */}
            <select
                className="w-[120px] h-[42px] rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                value={limit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            >
                <option value={4}>4 per page</option>
                <option value={12}>12 per page</option>
                <option value={20}>20 per page</option>
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
            </select>

            {/* Page info */}
            <span className="text-gray-700 font-semibold">
                Page <span className="text-blue-600">{currentPage}</span> of <span className="text-blue-600">{totalPages}</span>
            </span>

            {/* Previous/Next buttons */}
            <div className="flex gap-2">
                <button
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 shadow-sm ${
                        currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ◀ Previous
                </button>

                <button
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 shadow-sm ${
                        currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
}
