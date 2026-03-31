import React, { useState } from 'react';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import UploadImage from './UploadImage';
import toast from 'react-hot-toast';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// কনস্ট্যান্ট ডেটা
const brands = [
    { label: 'Topz Fashions', value: 'Topz Fashions' },
    { label: 'Urban Aura', value: 'Urban Aura' },
    { label: 'Modest Mist', value: 'Modest Mist' },
    { label: 'Velvet Vogue', value: 'Velvet Vogue' },
    { label: 'Zenith Apparel', value: 'Zenith Apparel' },
    { label: 'Silk & Saffron', value: 'Silk & Saffron' },
    { label: 'Nordic Neat', value: 'Nordic Neat' },
    { label: 'Indigo Edge', value: 'Indigo Edge' },
    { label: 'Petal Soft', value: 'Petal Soft' },
    { label: 'Heritage Hue', value: 'Heritage Hue' },
];

const categories = [
    { label: "Panjabi", value: "panjabi" },
    { label: "Sweaters", value: "sweaters" },
    { label: "Casual Shirt", value: "casual shirt" },
    { label: "Formal Shirt", value: "formal shirt" },
    { label: "Kurti", value: "kurti" },
];

const colors = [
    { label: 'Black', value: 'black' }, { label: 'Red', value: 'red' },
    { label: 'Gold', value: 'gold' }, { label: 'Blue', value: 'blue' },
    { label: 'Silver', value: 'silver' }, { label: 'Beige', value: 'beige' },
    { label: 'Green', value: 'green' }, { label: 'White', value: 'white' },
    { label: 'Orange', value: 'orange' }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const genders = [
    { label: 'Man', value: 'man' }, { label: 'Woman', value: 'woman' }
];

const AddProduct = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: '', 
        category: '', 
        brand: '', 
        description: '', 
        price: '',
        oldprice: '', 
        color: '', 
        size: [], 
        sku: '', 
        gender: '', 
        quantity: ''
    });

    const [image, setImage] = useState("");
    const [addProduct, { isLoading }] = useAddProductMutation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setProduct(prev => ({ ...prev, description: value }));
    };

    const handleSizeChange = (sValue) => {
        setProduct((prev) => {
            const currentSizes = prev.size || [];
            const newSizes = currentSizes.includes(sValue)
                ? currentSizes.filter((s) => s !== sValue)
                : [...currentSizes, sValue];
            return { ...prev, size: newSizes };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ভ্যালিডেশন
        if (!product.brand) return toast.error("Please select a brand!");
        if (!image) return toast.error("Please upload an image!");
        if (product.size.length === 0) return toast.error("Please select at least one size!");

        const finalProductData = {
            ...product,
            description: product.description.replace(/&nbsp;/g, ' ').trim(),
            image,
            author: user?._id,
            price: Number(product.price), 
            oldprice: Number(product.oldprice || 0),
            quantity: Number(product.quantity || 1)
        };

        try {
            await addProduct(finalProductData).unwrap();
            toast.success("Product Added Successfully!");
            navigate("/dashboard/manage-products");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to add product");
        }
    };

    const inputStyle = "w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:text-white dark:bg-slate-800 transition-all";

    return (
        <div className='max-w-5xl mx-auto mt-12 px-4 pb-20'>
            {/* Header */}
            <div className="w-full mb-8 p-6 rounded-xl bg-blue-50 dark:bg-slate-800">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h4>
                <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                    <Link className="hover:text-blue-600" to={'/shop'}>Shop</Link>
                    <span>/</span>
                    <span className="font-medium text-blue-600">New Product</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold">Product Name</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} placeholder='Ex: Premium Cotton Shirt' className={inputStyle} required />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Brand</label>
                                <select name="brand" value={product.brand} onChange={handleChange} className={inputStyle} required>
                                    <option value="">Choose a Brand</option>
                                    {brands.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">SKU Code</label>
                                <input type="text" name="sku" value={product.sku} onChange={handleChange} placeholder="SKU-1234" className={inputStyle} required />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Gender</label>
                                <select name="gender" value={product.gender} onChange={handleChange} className={inputStyle} required>
                                    <option value="">Select Gender</option>
                                    {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Category</label>
                                <select name="category" value={product.category} onChange={handleChange} className={inputStyle} required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Color</label>
                                <select name="color" value={product.color} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Color</option>
                                    {colors.map(col => <option key={col.value} value={col.value}>{col.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Stock Quantity</label>
                                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="0" className={inputStyle} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleSizeChange(s)}
                                            className={`px-4 py-2 rounded-md border text-xs font-bold transition-all ${product.size.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-blue-600">Current Price (TK)</label>
                                <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="0" className={inputStyle} required />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">Old Price (TK)</label>
                                <input type="number" name="oldprice" value={product.oldprice} onChange={handleChange} placeholder="0" className={inputStyle} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold">Product Description</label>
                                <div className="dark:bg-slate-800 rounded-md">
                                    <ReactQuill 
                                        theme="snow"
                                        value={product.description}
                                        onChange={handleDescriptionChange}
                                        className="h-64 mb-12 dark:text-white"
                                        placeholder="পণ্যের বিস্তারিত লিখুন..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <label className="mb-4 block text-sm font-semibold">Product Image</label>
                        <UploadImage setImage={setImage} value={image} />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='w-full py-4 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700 disabled:bg-slate-400 shadow-lg shadow-blue-200 dark:shadow-none'
                    >
                        {isLoading ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;