import React from 'react'
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories = [
        { id: 1, name: 'Women’s fashion', path: 'woman' },
        { id: 2, name: 'Men’s fashion', path: 'man' },
        { id: 3, name: 'Panjabi', path: 'panjabi' },
        { id: 4, name: 'Sweaters', path: 'sweaters' }, // কমা (,) মিসিং ছিল
        { id: 5, name: 'Shirts', path: 'shirts' } // id ডুপ্লিকেট ছিল, ৫ করে দিয়েছি
    ]

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap gap-12 justify-center lg:flex-row">
                    {
                        categories.map((category, index) => ( // বানান ঠিক করা হয়েছে: category
                            <Link 
                                key={index} 
                                className="categories__card bg-white p-6 shadow-sm border rounded-lg hover:shadow-md transition-all" 
                                to={`/categories/${category.path}`}
                            >
                                <h4 className="text-lg font-semibold text-gray-800 uppercase tracking-wide">
                                    {category.name}
                                </h4>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default Categories