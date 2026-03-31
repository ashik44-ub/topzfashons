import React from 'react';
import { motion } from 'framer-motion';
import bannerImg1 from "../../assets/category-1.jpg";
import bannerImg2 from "../../assets/category-2.jpg";
import bannerImg3 from "../../assets/category-3.jpg";
import bannerImg4 from "../../assets/category-4.jpg";
import bannerImg5 from "../../assets/category-5.jpg";
import { Link } from 'react-router-dom';

const Banner = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Ekta card ashar 0.2s por arekta ashbe
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  return (
    <section className="overflow-hidden">
      <motion.div 
        className="container-fluid mx-auto px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="flex flex-wrap">
          
          {/* Large Left Item (Women's Fashion) */}
          <motion.div 
            className="w-full lg:w-1/2 p-0"
            variants={itemVariants}
          >
            <div 
              className="relative h-[400px] md:h-[600px] lg:h-[700px] bg-cover bg-center flex items-center px-8 md:px-20" 
              style={{ backgroundImage: `url(${bannerImg1})` }}
            >
              <div className="relative z-10 max-w-md">
                <motion.h1 
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4"
                >
                  Women’s fashion
                </motion.h1>
                <p className="text-gray-800 mb-6 leading-relaxed">
                  The Abaya is more than just a garment; it is a symbol of grace, modesty, and cultural identity.
                </p>
                <Link to={'/categories/woman'} className="inline-block text-sm font-bold uppercase tracking-[2px] border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all cursor-pointer">
                  Shop Now
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column Grid */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-wrap">
              
              {[
                { title: "Men’s fashion", img: bannerImg2, link: "/categories/man", desc: "Redefine your style with our premium Men’s collection." },
                { title: "Panjabi", img: bannerImg3, link: "/categories/panjabi", desc: "Celebrate tradition with our premium Panjabis." },
                { title: "Sweaters", img: bannerImg4, link: "/categories/sweaters", desc: "Stay warm in style! Our premium sweaters offer comfort." },
                { title: "Kurtis Dress", img: bannerImg5, link: "/categories/kurti", desc: "Discover the perfect blend of tradition and modern style!" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="w-full md:w-1/2 p-0 border-white border"
                  variants={itemVariants}
                >
                  <div 
                    className="relative h-[300px] lg:h-[350px] bg-cover bg-center flex items-center px-10 group overflow-hidden" 
                    style={{ backgroundImage: `url(${item.img})` }}
                  >
                    {/* Overlay for better text readability on hover */}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500"></div>
                    
                    <div className="relative z-10">
                      <h4 className="text-xl font-bold text-black mb-1">{item.title}</h4>
                      <p className="text-gray-800 mb-6 leading-relaxed text-sm line-clamp-2">{item.desc}</p>
                      <Link to={item.link} className="inline-block text-black text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all">
                        Shop now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
          </div> 
        </div>
      </motion.div>
    </section>
  );
};

export default Banner;