import React from 'react';

const TermsConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gray-900 py-10 px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-bold">
            Last Updated: March 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-10 text-gray-700 leading-relaxed">
          
          <section>
            <p className="text-lg font-medium italic border-l-4 border-red-600 pl-4 bg-gray-50 py-4">
              Welcome to our brand. By accessing and using this website, you agree to comply with and be bound by the following terms and conditions:
            </p>
          </section>

          {/* 1. General Conditions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="text-red-600">01.</span> General Conditions
            </h2>
            <ul className="list-disc ml-6 space-y-2 marker:text-red-600">
              <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
              <li>The content on this site is for your general information and use only. It is subject to change without notice.</li>
            </ul>
          </section>

          {/* 2. Products and Prices */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="text-red-600">02.</span> Products and Prices
            </h2>
            <ul className="list-disc ml-6 space-y-2 marker:text-red-600">
              <li>All products are subject to availability. We reserve the right to discontinue any product at any time.</li>
              <li>Prices for our products are subject to change without notice.</li>
              <li>We make every effort to display colors and images as accurately as possible, but we cannot guarantee your monitor's display will be accurate.</li>
            </ul>
          </section>

          {/* 3. Order and Payment */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="text-red-600">03.</span> Order and Payment
            </h2>
            <ul className="list-disc ml-6 space-y-2 marker:text-red-600">
              <li>By placing an order, you agree to provide current, complete, and accurate purchase information.</li>
              <li>We reserve the right to cancel any order if we suspect fraudulent activity or if the product is out of stock.</li>
            </ul>
          </section>

          {/* 4. Shipping and Delivery */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="text-red-600">04.</span> Shipping and Delivery
            </h2>
            <p>Delivery times may vary depending on your location and the shipping method chosen. We are not responsible for delays caused by the courier service or customs.</p>
          </section>

          {/* 5. Return and Refund */}
          <section className="space-y-4 bg-red-50 p-6 rounded-2xl">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <span className="text-red-600">05.</span> Return and Refund Policy
            </h2>
            <p>Our return policy lasts <strong>7 days</strong>. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
          </section>

          {/* Footer Contact */}
          <div className="pt-10 border-t border-gray-100 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Questions about the Terms of Service?</p>
            <p className="mt-2 text-xl font-black text-gray-900">support@topzfashions.com</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsConditions;