# Interactive Pricing Calculator (Micro-SaaS Utility)

A blazing-fast, mobile-responsive interactive pricing calculator designed for service-based businesses (such as home cleaning, moving, catering, and personal training). 

This frontend tool eliminates manual quoting by letting customers estimate their own costs and instantly book a service via an automated WhatsApp message.

## ✨ Features
* **Zero Backend Required:** Fully functional dynamic price calculation running entirely on client-side JS.
* **Instant Booking Flow:** Generates a pre-formatted, emoji-friendly markdown booking summary sent directly to the business's WhatsApp.
* **Hyper-Fast Load Times:** Built using vanilla HTML and Tailwind CSS to ensure instant loads even on low-speed mobile networks.
* **Easily Customizable:** Configured via a simple JSON-like configuration block to quickly change pricing, services, and add-ons.

## 🚀 Live Demo
Check out the live interactive demo here: https://interactive-pricing-calculator-three.vercel.app

## 🛠️ How to Customize for Your Business
To change the pricing structure, brand name, or target WhatsApp phone number, simply edit the `CLIENT_CONFIG` and `PRICING_RULES` constants in the `<script>` tag of the `index.html` file.
