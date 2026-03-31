import React from 'react';
import { motion } from 'framer-motion';

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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Protiti item 0.15s por por ashbe
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // 20% visible holei start hobe
        >
          {featureList.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              whileHover={{ scale: 1.05 }} // Hover korle ektu boro hobe
              className="flex items-center space-x-5 lg:justify-center group cursor-default"
            >
              {/* Icon Container with Hover Animation */}
              <motion.div 
                className={`text-4xl ${feature.color}`}
                whileHover={{ rotate: [0, -10, 10, 0] }} // Icon-ti halka shake hobe
                transition={{ duration: 0.3 }}
              >
                <i className={feature.icon}></i>
              </motion.div>

              {/* Text Content */}
              <div>
                <h6 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                  {feature.title}
                </h6>
                <p className="text-sm text-gray-500 mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;