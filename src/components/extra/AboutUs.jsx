import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <span className="text-red-400 font-semibold tracking-widest uppercase text-sm">Since 2025</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mt-4 mb-6">
            Topz <span className="text-red-400 font-light italic text-4xl md:text-5xl">Fashions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
            Crafting unique and exotic fashion choices that resonate with your individuality.
          </p>
        </div>
      </section>

      {/* --- Story Section --- */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Side (Placeholder) */}
          <div className="w-full md:w-1/2">
            <div className="h-[500px] w-full bg-gray-200 rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500">
               {/* Replace with your actual brand image */}
               <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
                alt="Modern Fashion" 
                className="w-full h-full object-cover"
               />
            </div>
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold font-serif border-l-4 border-red-400 pl-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              In 2025, <strong>Topz Fashions</strong> emerged with a vision to redefine the shopping experience. 
              We don't just sell clothes; we offer unique and exotic fashion choices for a diverse range of styles.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our process revolves around <strong>you</strong>. We prioritize all-day comfort while ensuring 
              each piece is carefully crafted to accentuate your natural body shape.
            </p>
          </div>
        </div>
      </section>

      {/* --- Values Grid --- */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 border border-gray-700 rounded-xl">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Unique Style</h3>
              <p className="text-gray-400">Exotic designs that embrace the spirit of modern fashion.</p>
            </div>
            <div className="text-center p-6 border border-gray-700 rounded-xl">
              <div className="text-4xl mb-4">☁️</div>
              <h3 className="text-xl font-bold mb-2">Total Comfort</h3>
              <p className="text-gray-400">Clothing designed to make you feel as amazing as you look.</p>
            </div>
            <div className="text-center p-6 border border-gray-700 rounded-xl">
              <div className="text-4xl mb-4">👗</div>
              <h3 className="text-xl font-bold mb-2">Perfect Fit</h3>
              <p className="text-gray-400">Personalized cuts that celebrate your natural body shape.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;