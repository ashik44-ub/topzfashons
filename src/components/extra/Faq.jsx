import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-5">
      <button 
        className="flex justify-between items-center w-full text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-gray-800 group-hover:text-red-400 transition-colors">
          {question}
        </span>
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45 text-red-400' : 'rotate-0 text-gray-400'}`}>
          +
        </span>
      </button>
      <div className={`mt-3 text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "How do I choose the right size?",
      answer: "Every item in our collection includes a detailed Size Chart on its product page. We recommend measuring your bust, waist, and hips to ensure the perfect fit, as our exotic designs are tailored for a modern, flattering silhouette."
    },
    {
      question: "What is your shipping policy?",
      answer: "Orders are typically processed within 24-48 hours. Domestic delivery within Bangladesh usually takes 2-4 business days, while international shipping can take 7-14 business days depending on your location."
    },
    {
      question: "Can I return or exchange a dress?",
      answer: "Yes! We want you to feel amazing. We offer exchanges for size or store credit within 7 days of delivery. Items must be unworn, unwashed, and have the original Topz Fashions tags attached."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, mobile banking (bKash, Nagad), and secure online bank transfers. All transactions are encrypted for your safety."
    },
    {
      question: "How should I care for my Topz Fashions garments?",
      answer: "To maintain the unique fabric quality, we recommend hand washing in cold water or using a 'delicate' machine cycle. Always air dry in the shade to prevent color fading."
    },
    {
      question: "Do you offer custom tailoring?",
      answer: "Currently, our pieces come in standard sizing, but they are designed with seam allowances that allow for minor professional alterations to fit your body perfectly."
    }
  ];

  return (
    <div className="bg-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-red-400 mb-4">Customer Care</h2>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-gray-500">Everything you need to know about our styles and services.</p>
        </div>

        {/* --- Accordion List --- */}
        <div className="bg-gray-50 p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          {faqData.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>

        {/* --- Call to Action --- */}
        <div className="mt-16 text-center p-8 bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Our fashion experts are here to help you.</p>
          <Link 
            to={'/contact-us'} 
            className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-red-400 transition-all shadow-lg active:scale-95"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;