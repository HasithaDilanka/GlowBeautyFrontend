import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // check new messages every 10 sec
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show hot-toast notification for new messages
      if (messages.length && res.data.data.length > messages.length) {
        toast.success("✨ New message received!", { duration: 4000 });
      }

      setMessages(res.data.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Message deleted!");
      setMessages(messages.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <p className="text-xl font-semibold">Loading messages...</p>
      </div>
    );

  return (
    <div className="min-h-screen p-6  text-white">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold mb-6  text-black">Customer Messages</h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-300 mt-10 text-lg">
          No messages available.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[700px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg._id}
              onClick={() => setSelectedMessage(msg)}
              className="bg-gray-200 text-black shadow-lg rounded-xl p-5 border border-gray-300 cursor-pointer hover:text-white transition-colors duration-300 hover:bg-gradient-to-br hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-2xl"
            >
              <p className="font-semibold text-lg truncate">
                {msg.name} ({msg.email})
              </p>
              <p className="truncate mt-1">{msg.message}</p>
              <p className="text-xs mt-2">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

{/* Modal for viewing message */}
{selectedMessage && (
  
  <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
  <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full relative border border-gray-200/50 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
    {/* Decorative gradient header */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    
    {/* Close button */}
    <button
      onClick={() => setSelectedMessage(null)}
      className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 hover:rotate-90 group"
    >
      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div className="p-8 pt-12">
      {/* Subject with enhanced typography */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          {selectedMessage.subject}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </div>

      {/* Sender Info Card */}
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Contact Information</h3>
        <div className="grid gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{selectedMessage.email}</p>
            </div>
          </div>
          
          {selectedMessage.phone && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{selectedMessage.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message content */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Message</h3>
        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-200/50 text-gray-800 leading-relaxed whitespace-pre-wrap">
          {selectedMessage.message}
        </div>
      </div>

      {/* Footer with timestamp and actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200/50">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-500">
            {new Date(selectedMessage.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Delete button */}
        <button
          onClick={() => deleteMessage(selectedMessage._id)}
          className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Message</span>
          </span>
        </button>
      </div>
    </div>
  </div>
</div>
)}
    </div>
  );
}
