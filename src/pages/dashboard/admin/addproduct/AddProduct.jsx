import React, { useState } from 'react'
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UploadImage from './UploadImage';
import toast from 'react-hot-toast';

const categories = [
    { label: "Panjabi", value: "panjabi" },
    { label: "Sweaters", value: "sweaters" },
    { label: "Casual Shirt", value: "casual shirt" },
    { label: "Formal Shirt", value: "formal shirt" },
];

const colors = [
    { label: 'Black', value: 'black' }, { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' }, { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' }, { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' }, { label: 'White', value: 'white' }
];

const sizes = [
    { label: 'S', value: 's' }, { label: 'M', value: 'm' },
    { label: 'L', value: 'l' }, { label: 'XL', value: 'xl' },
    { label: 'XXL', value: 'xxl' }, { label: '3XL', value: '3xl' },
    { label: 'XS', value: 'xs' }
];

const genders = [
    { label: 'Man', value: 'man' }, { label: 'Woman', value: 'woman' }
];

const AddProduct = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Logic Fix: Added missing keys in initial state
    const [product, setProduct] = useState({
        name: '', category: '', description: '', price: '',
        oldprice: '', color: '', size: '', sku: '', gender: '', quantity: ''
    });

    const [image, setImage] = useState("");
    const [addProduct, { isLoading }] = useAddProductMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProduct({ ...product, image, author: user?._id }).unwrap();
            toast.success("Product Added Successfully!")
            navigate("/dashboard/manage-products");
        } catch (error) {
            console.error(error);
        }
    };

    const handleSizeChange = (sValue) => {
    setProduct((prev) => {
        const currentSizes = prev.size || [];
        // যদি সাইজটি আগে থেকেই অ্যারেতে থাকে তবে সরিয়ে দাও, না থাকলে যোগ করো
        const newSizes = currentSizes.includes(sValue)
            ? currentSizes.filter((s) => s !== sValue)
            : [...currentSizes, sValue];
            
        return { ...prev, size: newSizes };
    });
};

    // Reusable Tailwind Input Style
    const inputStyle = "w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:text-white dark:bg-slate-800 transition-all";

    return (
        <div className='max-w-5xl mx-auto mt-12 px-4 pb-20'>
            {/* Header / Breadcrumb */}
            <div className="w-full mb-8 flex flex-col gap-6 p-6 rounded-xl bg-blue-50 dark:bg-slate-800">
                <div className="flex flex-col">
                    <h4 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h4>
                    <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><Link className="hover:text-blue-600" to={'/shop'}>Shop</Link></li>
                        <li className="h-1 w-1 rounded-full bg-slate-400"></li>
                        <li aria-current="page">New Product</li>
                    </ol>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Side: Product Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* Product Name */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Name</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} placeholder='Ex: Premium Cotton Shirt' className={inputStyle} required />
                            </div>

                            {/* SKU */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">SKU Code</label>
                                <input type="text" name="sku" value={product.sku} onChange={handleChange} placeholder="SKU-1234" className={inputStyle} />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Gender</label>
                                <select name="gender" value={product.gender} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Gender</option>
                                    {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label>
                                <select name="category" value={product.category} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Color</label>
                                <select name="color" value={product.color} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Color</option>
                                    {colors.map(col => <option key={col.value} value={col.value}>{col.label}</option>)}
                                </select>
                            </div>

                            {/* Size */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Sizes (Select multiple)
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((s) => (
                                        <button
                                            key={s.value}
                                            type="button" // এটা না দিলে ফর্ম সাবমিট হয়ে যেতে পারে
                                            onClick={() => handleSizeChange(s.value)}
                                            className={`px-4 py-2 rounded-md border text-sm transition-all ${product.size?.includes(s.value)
                                                    ? "bg-blue-600 text-white border-blue-600" // সিলেক্ট হলে নীল
                                                    : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                                                }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Stock Quantity</label>
                                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="0" className={inputStyle} />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Current Price ($)</label>
                                <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="0.00" className={inputStyle} />
                            </div>

                            {/* Old Price */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Old Price ($)</label>
                                <input type="number" name="oldprice" value={product.oldprice} onChange={handleChange} placeholder="0.00" className={inputStyle} />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Description</label>
                                <textarea name="description" rows="4" value={product.description} onChange={handleChange} placeholder="Tell the story of this product..." className={inputStyle}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image Upload & Action */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <label className="mb-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Image</label>
                        <UploadImage setImage={setImage} value={image} />
                        <p className="mt-2 text-xs text-slate-500">Upload a high-quality JPG/PNG (Max 2MB).</p>
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full py-4 bg-slate-900 text-white rounded-xl font-bold transition-all duration-300 hover:bg-blue-700 disabled:bg-slate-400 flex justify-center items-center gap-2 shadow-lg shadow-blue-900/10'
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Processing...
                            </>
                        ) : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddProduct;