import React from 'react';
import bannerImg1 from "../../assets/category-1.jpg";
import bannerImg2 from "../../assets/category-2.jpg";
import bannerImg3 from "../../assets/category-3.jpg";
import bannerImg4 from "../../assets/category-4.jpg";
import bannerImg5 from "../../assets/category-5.jpg";
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="overflow-hidden">
      <div className="container-fluid mx-auto px-0">
        <div className="flex flex-wrap">
          
          {/* Large Left Item (Women's Fashion) */}
          <div className="w-full lg:w-1/2 p-0">
            <div 
              className="relative h-[400px] md:h-[600px] lg:h-[700px] bg-cover bg-center flex items-center px-8 md:px-20" 
              style={{ backgroundImage: `url(${bannerImg1})` }}
            >
              <div className="relative z-10 max-w-md">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4">
                Women’s fashion
              </h1>
              <p className="text-gray-800 mb-6 leading-relaxed">
                The Abaya is more than just a garment; it is a symbol of grace, modesty, and cultural identity. Traditionally worn by women in many parts of the Muslim world, this long, flowing robe has evolved from a simple black overgarment into a global fashion statement that resonates with women seeking both style and sophistication.
              </p>
              
              <Link to={'/categories/woman'} className="inline-block text-sm font-bold uppercase tracking-[2px] border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all cursor-pointer">Shop Now</Link>
            </div>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-wrap">
              
              {/* Men's Fashion */}
              <div className="w-full md:w-1/2 p-0 border-white border">
                <div 
                  className="relative h-[300px] lg:h-[350px] bg-cover bg-center flex items-center px-10" 
                  style={{ backgroundImage: `url(${bannerImg2})` }}
                >
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-black mb-1">Men’s fashion</h4>
                    <Link to={'/categories/man'} className="inline-block text-black text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all">
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Kid's Fashion */}
              <div className="w-full md:w-1/2 p-0 border-white border">
                <div 
                  className="relative h-[300px] lg:h-[350px] bg-cover bg-center flex items-center px-10" 
                  style={{ backgroundImage: `url(${bannerImg3})` }}
                >
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-black mb-1">Panjabi</h4>
                    <Link to={'/categories/panjabi'} className="inline-block text-black text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all">
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cosmetics */}
              <div className="w-full md:w-1/2 p-0 border-white border">
                <div 
                  className="relative h-[300px] lg:h-[350px] bg-cover bg-center flex items-center px-10" 
                  style={{ backgroundImage: `url(${bannerImg4})` }}
                >
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Sweaters</h4>
                    <Link to={'/categories/sweaters'}  className="inline-block text-black text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all">
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Accessories */}
              <div className="w-full md:w-1/2 p-0 border-white border">
                <div 
                  className="relative h-[300px] lg:h-[350px] bg-cover bg-center flex items-center px-10" 
                  style={{ backgroundImage: `url(${bannerImg5})` }}
                >
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">25% Discount</h4>
                    <Link to={'/categories/kurti'}  className="inline-block text-xs font-bold uppercase tracking-widest border-b-2 border-red-500 pb-1 hover:text-red-500 transition-all">
                      Shop now
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div> 
        </div>
      </div>
    </section>
  );
};

export default Banner;