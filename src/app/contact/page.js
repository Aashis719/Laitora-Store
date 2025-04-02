'use client'
import { useState } from "react";
import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHome } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .send(
        "service_z0n69mt", // Replace with your EmailJS Service ID
        "template_tmjjxz4", // Replace with your EmailJS Template ID
        {
          name: form.name,          // Updated key to 'name' for template matching
          email: form.email,        // Updated key to 'email' for template matching
          message: form.message,    // Key 'message' is unchanged
        },
        "Zpyv556tuOPUfuzDe" // Replace with your EmailJS Public Key
      )
      .then(() => {
        toast.success("🎉 Message sent successfully!", { position: "top-center" });
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("⚠️ Failed to send message. Try again!", { position: "top-center" });
      })
      .finally(() => setIsSending(false));
  };

  return (
    <div className="bg-amber-100 p-6 pt-2 text-gray-700 min-h-screen">
      <ToastContainer />
      <div className="w-full mb-5 text-3xl font-semibold md:pl-20 md:pt-5">
        <Link href={"/"} className="text-left flex gap-2 items-center">
          <FaHome /> <span>Home</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center md:pt-20">
        <div className="md:w-1/2 text-gray-700 py-8 px-4 pt-0">
          <h2 className="text-3xl font-bold text-teal-700">Get in Touch</h2>
          <p className="mt-3 text-gray-700">
            Have a question or want to work together? Feel free to reach out!
          </p>
          <div className="mt-6 space-y-4">
            <p className="flex items-center text-lg">
              <FaPhoneAlt className="text-teal-600 mr-3" /> +123 456 7890
            </p>
            <p className="flex items-center text-lg">
              <FaEnvelope className="text-teal-600 mr-3" /> contact@laitorastore.com
            </p>
            <p className="flex items-center text-lg">
              <FaMapMarkerAlt className="text-teal-600 mr-3" /> 123 Business St, Tech City
            </p>
          </div>
        </div>

        <div className="md:w-1/2 bg-white/80 p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-teal-600">Send a Message</h2>
          <form className="mt-4 space-y-4" onSubmit={sendEmail}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none h-32"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded-lg text-lg font-bold hover:bg-teal-800 flex justify-center items-center gap-2"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
