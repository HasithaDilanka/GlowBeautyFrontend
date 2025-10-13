import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../../components/paginator";
import Loader from "../../components/loader";
import { RiCloseCircleLine } from "react-icons/ri";
import toast from "react-hot-toast"; // Added missing toast import

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);

    //popup menu
    const [popupVisible, setPopupVisible] = useState(false)

    //click karapu order eka balaganna 
    const [clickedOrder, setClickedOrder] = useState(null);

    const [orderStatus, setOrderStatus] = useState("pending");  //pending, complete, cansaled
    const [orderNotes, setOrderNotes] = useState("");

    const fetchOrders = () => {
        setLoading(true);

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${page}/${limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
                setLoading(false);
                setError(null);
                console.log("Orders fetched successfully:", response.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
                setError("Failed to fetch orders. Please try again.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, [page, limit]);    // Removed loading dependency and call fetchOrders directly

    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto p-3">
            <h1 className="text-2xl font-bold mb-4 pt-5 pl-3">Orders List</h1>
            <div className="max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 shadow-lg text-center flex-col ">
                <table className="min-w-full table-auto ">
                    <thead className=" top-0 z-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[16px] font-semibold">
                        <tr>
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Address</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => (
                                <tr 
                                    key={index} 
                                    className="border-b border-gray-100 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:cursor-pointer transition-all duration-200"
                                    onClick={() => {
                                        setOrderStatus(order.status);
                                        setOrderNotes(order.note);
                                        setClickedOrder(order);
                                        setPopupVisible(true);
                                    }}
                                >
                                    <td className="p-2 text-gray-800 text-sm">
                                        <span className="text-blue-600 font-semibold text-xs">#{order.orderId}</span>
                                    </td>
                                    <td className="p-2 text-gray-700 text-xs">{order.email}</td>
                                    <td className="p-2 text-gray-700 text-xs font-medium">{order.name}</td>
                                    <td className="p-2 text-gray-700 max-w-xs truncate text-xs" title={order.address}>
                                        {order.address}
                                    </td>
                                    <td className="p-2 text-gray-700 text-xs">{order.phone}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'completed' 
                                                ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'cancelled' 
                                                ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-2 text-gray-700 text-xs">
                                        {order.date ? new Date(order.date).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                    <td className="p-2 text-green-600 font-semibold text-xs">
                                        Rs.{order.total ? order.total.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }) : '0.00'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {popupVisible && clickedOrder && (
                    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black/50 to-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
                        <div className="w-[1100px] max-h-[95vh] bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl relative overflow-hidden border border-gray-200/50 flex flex-col animate-in fade-in zoom-in duration-300">

                            {/* Header with gradient and glass effect */}
                            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6 relative overflow-hidden">
                                {/* Animated background elements */}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent"></div>
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>

                                <RiCloseCircleLine
                                    className="absolute top-4 right-4 w-[36px] h-[36px] text-white/90 cursor-pointer hover:scale-110 hover:rotate-90 hover:text-white transition-all duration-300 drop-shadow-lg z-10"
                                    onClick={() => setPopupVisible(false)}
                                />

                                <div className="relative z-10">
                                    <h2 className="text-3xl font-bold text-white drop-shadow-lg">Order Details</h2>
                                    <p className="text-white/80 mt-2 text-lg">Order #{clickedOrder.orderId}</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                                        <span className="text-white/70 text-sm">Live Order Tracking</span>
                                    </div>
                                </div>
                            </div>

                            {/* Save Changes Button - Enhanced */}
                            {(orderStatus != clickedOrder.status || orderNotes != clickedOrder.note) && (
                                <button
                                    className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-20 flex items-center gap-2"
                                    onClick={async () => {
                                        try {
                                            await axios.put(
                                                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${clickedOrder.orderId}`,
                                                {
                                                    status: orderStatus,
                                                    note: orderNotes
                                                },
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                    },
                                                }
                                            );

                                            toast.success("Order updated successfully");
                                            setPopupVisible(false);

                                            // Update the order in the local state
                                            setOrders(prevOrders =>
                                                prevOrders.map(order =>
                                                    order.orderId === clickedOrder.orderId
                                                        ? { ...order, status: orderStatus, note: orderNotes }
                                                        : order
                                                )
                                            );

                                            // Update the clicked order
                                            setClickedOrder(prevOrder => ({
                                                ...prevOrder,
                                                status: orderStatus,
                                                note: orderNotes
                                            }));

                                        } catch (error) {
                                            console.error("Error updating order:", error);
                                            toast.error("Failed to update order");
                                        }
                                    }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </button>
                            )}

                            {/* Content - Split Layout with enhanced design */}
                            <div className="flex-1 flex overflow-hidden">

                                {/* Left Column - Order & Customer Info */}
                                <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200/50">

                                    {/* Customer Info - Enhanced Card */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <span className="text-gray-600 w-16">Name:</span>
                                                <span className="font-semibold text-gray-800">{clickedOrder.name}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-600 w-16">Email:</span>
                                                <span className="font-medium text-blue-600 hover:underline cursor-pointer">{clickedOrder.email}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-gray-600 w-16">Phone:</span>
                                                <span className="font-medium text-gray-800">{clickedOrder.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Info - Enhanced Card */}
                                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200/50 mb-6 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Order Information</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <span className="text-gray-600 mr-2">Status:</span>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${clickedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            clickedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {clickedOrder.status}
                                                    </span>
                                                </div>
                                                <select
                                                    className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                                                    value={orderStatus}
                                                    onChange={(e) => setOrderStatus(e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>

                                            <div>
                                                <span className="text-gray-600 block mb-2">Order Notes:</span>
                                                <textarea
                                                    className="w-full h-[80px] p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 text-sm resize-none bg-white"
                                                    value={orderNotes}
                                                    onChange={(e) => setOrderNotes(e.target.value)}
                                                    placeholder="Add your notes here..."
                                                />
                                            </div>

                                            <div className="flex items-center">
                                                <span className="text-gray-600 mr-2">Date:</span>
                                                <span className="font-medium text-gray-800">{new Date(clickedOrder.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                                                <span className="text-gray-600 font-medium">Total Amount:</span>
                                                <span className="font-bold text-2xl text-green-600">Rs. {clickedOrder.total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address - Enhanced Card */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Delivery Address</h3>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed bg-white/50 p-3 rounded-lg">{clickedOrder.address}</p>
                                    </div>
                                </div>

                                {/* Right Column - Items with enhanced design */}
                                <div className="w-1/2 p-6 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800">Order Items</h3>
                                        </div>
                                        <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold border border-purple-200">
                                            {clickedOrder.items?.length || 0} items
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        {clickedOrder.items && clickedOrder.items.length > 0 ? (
                                            clickedOrder.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
                                                    <div className="relative">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100 shadow-md group-hover:border-blue-300 transition-colors duration-300"
                                                        />
                                                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-900 truncate text-lg">{item.name}</p>
                                                        <p className="text-gray-500 flex items-center mt-1">
                                                            <span className="mr-2">Quantity:</span>
                                                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">{item.quantity}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900 text-lg">Rs. {item.price.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-500">per item</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-4.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-500 text-lg">No items found in this order</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}


            </div>

            <Paginator
                currentPage={page}
                totalPages={totalPages}
                setCurrentPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />

        </div>
    );
}