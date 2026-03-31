import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFetchProductByidQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Loading from '../../../../components/Loading';
import UploadImage from '../addproduct/UploadImage';
import toast from 'react-hot-toast';

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

const sizes = [
    { label: 'S', value: 's' }, { label: 'M', value: 'm' },
    { label: 'L', value: 'l' }, { label: 'XL', value: 'xl' },
    { label: 'XXL', value: 'xxl' }, { label: '3XL', value: '3xl' },
    { label: 'XS', value: 'xs' }
];

const brands = [
    { label: 'Topz Fashions', value: 'topz-fashions' },
    { label: 'Urban Aura', value: 'urban-aura' },
    { label: 'Modest Mist', value: 'modest-mist' },
    { label: 'Velvet Vogue', value: 'velvet-vogue' },
    { label: 'Zenith Apparel', value: 'zenith-apparel' },
    { label: 'Silk & Saffron', value: 'silk-saffron' },
    { label: 'Nordic Neat', value: 'nordic-neat' },
    { label: 'Indigo Edge', value: 'indigo-edge' },
    { label: 'Petal Soft', value: 'petal-soft' },
    { label: 'Heritage Hue', value: 'heritage-hue' },
];

const genders = [
    { label: 'Man', value: 'man' }, { label: 'Woman', value: 'woman' }
];

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const { data, isLoading: isProductLoading, refetch } = useFetchProductByidQuery(id);
    const [updateProductMutation, { isLoading: isUpdating }] = useUpdateProductMutation();

    const [product, setProduct] = useState({
        name: '', category: '', brand: '', description: '', price: '',
        oldprice: '', color: '', size: [], sku: '', gender: '', quantity: ''
    });

    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchedProduct = data?.data?.product || data?.product;
        if (fetchedProduct) {
            setProduct({
                name: fetchedProduct.name || '',
                category: fetchedProduct.category || '',
                brand: fetchedProduct.brand || '', // ব্র্যান্ড লোড করা হচ্ছে
                description: fetchedProduct.description || '',
                price: fetchedProduct.price || '',
                oldprice: fetchedProduct.oldprice || '',
                color: fetchedProduct.color || '',
                size: fetchedProduct.size || [],
                sku: fetchedProduct.sku || '',
                gender: fetchedProduct.gender || '',
                quantity: fetchedProduct.quantity || ''
            });
            setImage(fetchedProduct.image || "");
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
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
        
        // ডেসক্রিপশন থেকে অপ্রয়োজনীয় স্পেস এবং ক্যারেক্টার ক্লিন করা
        const cleanDescription = product.description.replace(/&nbsp;/g, ' ').trim();

        const updatedProductBody = {
            ...product,
            brand: product.brand, // ব্র্যান্ড নিশ্চিত করা হচ্ছে
            description: cleanDescription, // ক্লিনড ডেসক্রিপশন
            image: image || data?.data?.product?.image, 
            author: user?._id,
            price: Number(product.price),
            oldprice: Number(product.oldprice || 0),
            quantity: Number(product.quantity || 1)
        };

        try {
            await updateProductMutation({ id: id, ...updatedProductBody }).unwrap();
            toast.success("Product Updated Successfully!");
            refetch();
            navigate("/dashboard/manage-products");
        } catch (error) {
            console.error("Update Error:", error);
            toast.error(error?.data?.message || "Failed to update product");
        }
    };

    const inputStyle = "w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-slate-700 dark:text-white dark:bg-slate-800 transition-all";

    if (isProductLoading) return <Loading />;

    return (
        <div className='max-w-5xl mx-auto mt-12 px-4 pb-20'>
            <div className="w-full mb-8 flex flex-col gap-6 p-6 rounded-xl bg-orange-50 dark:bg-slate-800">
                <div className="flex flex-col">
                    <h4 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Update Product</h4>
                    <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><Link className="hover:text-blue-600" to={'/shop'}>Shop</Link></li>
                        <li className="h-1 w-1 rounded-full bg-slate-400"></li>
                        <li aria-current="page">Update: {product.name}</li>
                    </ol>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Name</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">SKU Code</label>
                                <input type="text" name="sku" value={product.sku} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Gender</label>
                                <select name="gender" value={product.gender} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Gender</option>
                                    {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                </select>
                            </div>
                            {/* ব্র্যান্ড আপডেট ফিল্ড */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Brand</label>
                                <select name="brand" value={product.brand} onChange={handleChange} className={inputStyle} required>
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Category</label>
                                <select name="category" value={product.category} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                </select>
                            </div>
                            {/* বাকি ইনপুটগুলো আগের মতোই থাকবে... */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Color</label>
                                <select name="color" value={product.color} onChange={handleChange} className={inputStyle}>
                                    <option value="">Select Color</option>
                                    {colors.map(col => <option key={col.value} value={col.value}>{col.label}</option>)}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Sizes</label>
                                <div className="flex flex-wrap gap-3">
                                    {sizes.map((s) => (
                                        <button
                                            key={s.value}
                                            type="button"
                                            onClick={() => handleSizeChange(s.value)}
                                            className={`px-4 py-2 rounded-md border text-sm transition-all ${product.size?.includes(s.value)
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Stock Quantity</label>
                                <input type="number" name="quantity" value={product.quantity} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Current Price</label>
                                <input type="number" name="price" value={product.price} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Old Price</label>
                                <input type="number" name="oldprice" value={product.oldprice} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
                                <textarea name="description" rows="4" value={product.description} onChange={handleChange} className={inputStyle}></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                        <label className="mb-4 block text-sm font-semibold text-slate-700 dark:text-slate-200">Product Image</label>
                        <UploadImage setImage={setImage} value={image} />
                    </div>
                    <button
                        type='submit'
                        disabled={isUpdating}
                        className='w-full py-4 bg-blue-600 text-white rounded-xl font-bold transition-all duration-300 hover:bg-blue-700 disabled:bg-slate-400 flex justify-center items-center gap-2'
                    >
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all"
                    >
                        Cancel Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;