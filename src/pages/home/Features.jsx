import React from 'react';

const Features = () => {
  const featureList = [
    {
      icon: "ri-truck-line",
      title: "Free Shipping",
      desc: "For all orders over Discount",
      color: "text-red-500"
    },
    {
      icon: "ri-money-dollar-circle-line",
      title: "Money Back Guarantee",
      desc: "If goods have problems",
      color: "text-blue-500"
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Online Support 24/7",
      desc: "Dedicated support team",
      color: "text-green-500"
    },
    {
      icon: "ri-shield-check-line",
      title: "Payment Secure",
      desc: "100% secure payment",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featureList.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-5 lg:justify-center group"
            >
              {/* Icon Container */}
              <div className={`text-4xl ${feature.color} transition-transform duration-300 group-hover:-translate-y-2`}>
                <i className={feature.icon}></i>
              </div>

              {/* Text Content */}
              <div>
                <h6 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                  {feature.title}
                </h6>
                <p className="text-sm text-gray-500 mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;