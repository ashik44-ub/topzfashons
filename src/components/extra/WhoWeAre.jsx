import React from 'react';

const WhoWeAre = () => {
  return (
    <div className="bg-white">
      {/* --- Section 1: Hero Story --- */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-red-400 font-bold tracking-[0.2em] text-sm uppercase mb-4">Our Identity</h2>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight text-gray-900 mb-6">
              The Heart Behind <br />
              <span className="text-red-400 italic">Topz Fashions</span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Founded in 2025, we started with a simple belief: fashion should be as unique as the person wearing it. What began as a vision to offer exotic designs has grown into a community of individuals who value comfort without compromising on style.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We don't just follow trends; we study them to understand how they fit into <strong>your</strong> lifestyle.
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-full h-[500px] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
                alt="Our Studio" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlay Decorative Box */}
            <div className="absolute -bottom-10 -left-10 bg-red-r00 text-white p-10 rounded-2xl hidden lg:block">
              <p className="text-4xl font-bold">5k+</p>
              <p className="text-sm uppercase tracking-widest opacity-80">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Our Values --- */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold">What Defines Us</h2>
            <p className="text-gray-500 mt-2">The pillars that keep our brand strong</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-red-400 mb-6 font-bold text-xl">01</div>
              <h3 className="text-xl font-bold mb-4">Inclusive Elegance</h3>
              <p className="text-gray-600">We design for every body. Our pieces are crafted to accentuate your natural shape, making high-fashion accessible to everyone.</p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-red-400 mb-6 font-bold text-xl">02</div>
              <h3 className="text-xl font-bold mb-4">Ethical Craftsmanship</h3>
              <p className="text-gray-600">Every stitch matters. We work with skilled artisans to ensure that our exotic collections are produced with care and integrity.</p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-red-400 mb-6 font-bold text-xl">03</div>
              <h3 className="text-xl font-bold mb-4">Customer-Centric</h3>
              <p className="text-gray-600">You are the center of our process. From the initial sketch to the final package, your comfort is our top priority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Meet the Spirit --- */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-serif font-bold mb-8 italic">"Fashion meets you."</h2>
        <p className="text-xl text-gray-500 leading-relaxed mb-10">
          Our goal is to be more than just a brand. We want to be your go-to destination where you feel understood, satisfied, and confident every single day.
        </p>
        <div className="flex justify-center gap-4">
          <div className="h-[1px] w-20 bg-gray-300 self-center"></div>
          <p className="text-gray-900 font-bold uppercase tracking-widest text-sm">Topz Fashions Team</p>
          <div className="h-[1px] w-20 bg-gray-300 self-center"></div>
        </div>
      </section>
    </div>
  );
};

export default WhoWeAre;