import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getBaseUrl } from '../../../../utils/getBaseUrl';

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discountValue: '',
        discountType: 'percentage',
        startDate: '', // নতুন ফিল্ড
        expiryDate: '',
        minAmount: '',
        description: '',
        isActive: true
    });

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${getBaseUrl()}/api/couponcode`);
            setCoupons(Array.isArray(response.data) ? response.data : response.data.data || []);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.code || !formData.discountValue || !formData.startDate || !formData.expiryDate) {
            return toast.error("Code, Value, Start and Expiry Date are required!");
        }

        try {
            const response = await axios.post(`${getBaseUrl()}/api/couponcode/create-coupon`, formData);
            if (response.data.success) {
                toast.success("Coupon Created Successfully!");
                setFormData({
                    code: '', discountValue: '', discountType: 'percentage',
                    startDate: '', expiryDate: '', minAmount: '', description: '', isActive: true
                });
                fetchCoupons();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${getBaseUrl()}/api/couponcode/${id}`);
            toast.success("Deleted!");
            fetchCoupons();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i className="ri-coupon-2-line"></i> Coupon Management
                    </h1>
                    <p className="text-gray-500 text-sm italic">Manage validity for Topz Fashions</p>
                </div>
                <button onClick={fetchCoupons} className="bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all text-sm">
                    <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Form */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                    <h2 className="text-lg font-bold mb-5 border-b pb-2 flex items-center gap-2">
                        <i className="ri-calendar-event-line"></i> Set Coupon Validity
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Coupon Code</label>
                            <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. SUMMER26" className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-sm uppercase" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-xs text-gray-500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">End Date</label>
                                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-xs text-gray-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Type</label>
                                <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full p-2.5 border rounded-lg outline-none focus:border-black bg-white text-sm">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Value</label>
                                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} placeholder="10" className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Min. Order Amount</label>
                            <input type="number" name="minAmount" value={formData.minAmount} onChange={handleInputChange} placeholder="500" className="w-full p-2.5 border rounded-lg outline-none focus:border-black text-sm" />
                        </div>

                        <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-all mt-2 text-sm">
                            SAVE COUPON
                        </button>
                    </form>
                </div>

                {/* List Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-[10px] uppercase font-bold">
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Validity</th>
                                <th className="px-6 py-4">Discount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded border border-dashed border-gray-400 text-xs">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[11px] text-gray-500 leading-tight">
                                        {/* Start Date: 5-Mar-26 */}
                                        <span className="text-green-600 font-semibold">Start:</span> {
                                            coupon.startDate ? new Date(coupon.startDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: '2-digit'
                                            }).replace(/ /g, '-') : 'N/A'
                                        }
                                        <br />
                                        {/* Expiry Date: 27-Mar-26 */}
                                        <span className="text-red-600 font-semibold">End:</span> {
                                            coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: '2-digit'
                                            }).replace(/ /g, '-') : 'N/A'
                                        }
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `Tk. ${coupon.discountValue}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {coupon.isActive ? 'Active' : 'Expired'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(coupon._id)} className="text-gray-400 hover:text-red-600 p-2">
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Coupon;