import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

import ContactMap from "../components/ContactMap";

const ContactUsPage = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const subjects = [
    "Product Inquiry",
    "Beauty Consultation",
    "Order Support",
    "Business Partnership",
    "General Inquiry",
    "Other"
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      info: "hello@glowbeauty.com",
      subInfo: "We'll respond within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Beauty Hotline",
      info: "+94 70 383 3096",
      subInfo: "Mon-Sat: 9AM-8PM"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Beauty Studio",
      info: "123 Beauty Boulevard",
      subInfo: "Colombo 03, Sri Lanka"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      info: "Mon-Sat: 9AM-8PM",
      subInfo: "Sunday: 10AM-6PM"
    }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.subject) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 3000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to send message. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-800 to-indigo-900 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Ready to enhance your natural beauty? Get in touch with our beauty experts for personalized recommendations and exclusive offers.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-2">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'contact'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
                }`}
            >Get in Touch</button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'info'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
                }`}
            >Contact Info</button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'contact' ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Send us a Message ✨</h2>

              {submitted && (
                <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded-lg p-4 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                  <div>
                    <span className="text-green-100 font-semibold">Message Sent Successfully! 💕</span>
                    <p className="text-green-200 text-sm mt-1">Our beauty consultants will get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded-lg p-4 mb-6 flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
                  <div>
                    <span className="text-red-100 font-semibold">Error</span>
                    <p className="text-red-200 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Your beautiful name" required />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="your.email@example.com" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="+94 77 123 4567" />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Subject *</label>
                    <select name="subject" value={formData.subject} onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                      <option value="" className="bg-gray-800">Select a topic</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject} className="bg-gray-800">{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Your Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-blue-300 border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    placeholder="Tell us about your beauty goals and how we can help you glow..." required />
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending your message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                <p className="text-blue-200">Multiple ways to reach our beauty experts</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">{info.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{info.title}</h3>
                        <p className="text-blue-100 text-lg font-medium">{info.info}</p>
                        <p className="text-blue-200 text-sm">{info.subInfo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Visit Our Beauty Studio</h3>
                <ContactMap /> {/* Interactive Colombo Map */}
                <div className="grid md:grid-cols-3 gap-4 text-center mt-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Free Parking</h4>
                    <p className="text-blue-200 text-sm">Available for all visitors</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Expert Consultants</h4>
                    <p className="text-blue-200 text-sm">Certified beauty professionals</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Try Before You Buy</h4>
                    <p className="text-blue-200 text-sm">Test all products in-store</p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
