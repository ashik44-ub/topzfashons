import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '../../../utils/getBaseUrl';
import { updateQuantity } from '../../../redux/features/cart/CartSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion'; // Framer motion import

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, totalPrice } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        district: '',
        phone: '',
        email: user?.email || '',
    });

    useEffect(() => {
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(parsedData);
            if (parsedData.district === 'Dhaka') {
                setDeliveryCharge(70);
            } else if (parsedData.district !== '') {
                setDeliveryCharge(120);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        localStorage.setItem('checkoutFormData', JSON.stringify(updatedFormData));

        if (name === 'district') {
            if (value === 'Dhaka') setDeliveryCharge(70);
            else if (value === '') setDeliveryCharge(0);
            else setDeliveryCharge(120);
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // ফিক্সড: আইডি এবং সাইজ দুইটাই পাঠাতে হবে
    const handleUpdateQuantity = (type, id, size) => {
        dispatch(updateQuantity({ type, id, size }));
    };

    const handleApplyCoupon = async () => {
        const trimmedCode = couponCode.trim();
        if (!trimmedCode) return toast.error("Please enter a coupon code");

        try {
            const response = await axios.get(`${getBaseUrl()}/api/couponcode/${trimmedCode}`);
            const coupon = response.data;

            if (coupon) {
                const currentDate = new Date();
                const start = new Date(coupon.startDate);
                const expiry = new Date(coupon.expiryDate);

                if (currentDate < start) {
                    setDiscount(0);
                    return toast.error(`Coupon opens from ${start.toLocaleDateString('en-GB')}`);
                }
                if (currentDate > expiry) {
                    setDiscount(0);
                    return toast.error("Coupon expired!");
                }
                if (!coupon.isActive) {
                    setDiscount(0);
                    return toast.error("Coupon inactive!");
                }
                if (totalPrice < coupon.minAmount) {
                    setDiscount(0);
                    return toast.error(`Minimum order Tk. ${coupon.minAmount} required!`);
                }

                let calculatedDiscount = coupon.discountType === "percentage" 
                    ? (totalPrice * coupon.discountValue) / 100 
                    : coupon.discountValue;

                setDiscount(Number(calculatedDiscount));
                toast.success(`Coupon Applied! Saved Tk. ${calculatedDiscount}`);
            }
        } catch (error) {
            setDiscount(0);
            toast.error(error.response?.data?.message || "Invalid Coupon Code");
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "Required";
        if (!formData.address.trim()) newErrors.address = "Required";
        if (!formData.district) newErrors.district = "Required";
        if (!formData.phone.trim() || !/^\d{11}$/.test(formData.phone)) newErrors.phone = "Invalid Phone";
        if (!formData.email.trim()) newErrors.email = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const makePayment = async () => {
        if (!validateForm()) return toast.error("Please fill all required fields!");
        const body = {
            products: products.map(p => ({
                productId: p._id, name: p.name, price: p.price, quantity: p.quantity, size: p.size, image: p.image
            })),
            userId: user?._id || null,
            username: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            amount: (totalPrice + deliveryCharge) - discount,
            discount,
            shippingInfo: { ...formData, deliveryCharge },
            status: "pending"
        };

        try {
            const response = await axios.post(`${getBaseUrl()}/order`, body);
            if (response.data?.url) window.location.replace(response.data.url);
        } catch (error) {
            toast.error("Order processing failed!");
        }
    };

    const finalTotal = (Number(totalPrice) + deliveryCharge) - discount;
    const isFormIncomplete = !formData.firstName || !formData.address || !formData.district || !formData.phone;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-7xl mx-auto px-4 lg:px-28 py-12 font-sans"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Billing Details - Left Side */}
                <div className="space-y-5">
                    <h3 className="text-2xl font-bold border-b pb-3 text-gray-800 uppercase">Billing Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">First Name *</label>
                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} className={`p-2.5 border rounded-md outline-none ${errors.firstName ? 'border-red-500' : 'focus:border-black'}`} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Last Name</label>
                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="p-2.5 border rounded-md outline-none focus:border-black" />
                        </div>
                    </div>
                    {/* ... (বাকি ইনপুট ফিল্ডগুলো আগের মতোই থাকবে) */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">District *</label>
                        <select name="district" value={formData.district} onChange={handleInputChange}
                            className={`p-2.5 border rounded-md bg-white outline-none ${errors.district ? 'border-red-500' : 'focus:border-black'}`}>
                            <option value="">Select District</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Bagerhat">Bagerhat</option>
                            <option value="Bandarban">Bandarban</option>
                            <option value="Barguna">Barguna</option>
                            <option value="Barishal">Barishal</option>
                            <option value="Bhola">Bhola</option>
                            <option value="Bogra">Bogra</option>
                            <option value="Brahmanbaria">Brahmanbaria</option>
                            <option value="Chandpur">Chandpur</option>
                            <option value="Chattogram">Chattogram</option>
                            <option value="Chuadanga">Chuadanga</option>
                            <option value="Cumilla">Cumilla</option>
                            <option value="Cox's Bazar">Cox's Bazar</option>
                            <option value="Dinajpur">Dinajpur</option>
                            <option value="Faridpur">Faridpur</option>
                            <option value="Feni">Feni</option>
                            <option value="Gaibandha">Gaibandha</option>
                            <option value="Gazipur">Gazipur</option>
                            <option value="Gopalganj">Gopalganj</option>
                            <option value="Habiganj">Habiganj</option>
                            <option value="Jamalpur">Jamalpur</option>
                            <option value="Jashore">Jashore</option>
                            <option value="Jhalokati">Jhalokati</option>
                            <option value="Jhenaidah">Jhenaidah</option>
                            <option value="Joypurhat">Joypurhat</option>
                            <option value="Khagrachari">Khagrachari</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Kishoreganj">Kishoreganj</option>
                            <option value="Kurigram">Kurigram</option>
                            <option value="Kushtia">Kushtia</option>
                            <option value="Lakshmipur">Lakshmipur</option>
                            <option value="Lalmonirhat">Lalmonirhat</option>
                            <option value="Madaripur">Madaripur</option>
                            <option value="Magura">Magura</option>
                            <option value="Manikganj">Manikganj</option>
                            <option value="Meherpur">Meherpur</option>
                            <option value="Moulvibazar">Moulvibazar</option>
                            <option value="Munshiganj">Munshiganj</option>
                            <option value="Mymensingh">Mymensingh</option>
                            <option value="Naogaon">Naogaon</option>
                            <option value="Narail">Narail</option>
                            <option value="Narayanganj">Narayanganj</option>
                            <option value="Narsingdi">Narsingdi</option>
                            <option value="Natore">Natore</option>
                            <option value="Netrokona">Netrokona</option>
                            <option value="Nilphamari">Nilphamari</option>
                            <option value="Noakhali">Noakhali</option>
                            <option value="Pabna">Pabna</option>
                            <option value="Panchagarh">Panchagarh</option>
                            <option value="Patuakhali">Patuakhali</option>
                            <option value="Pirojpur">Pirojpur</option>
                            <option value="Rajbari">Rajbari</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Rangamati">Rangamati</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Satkhira">Satkhira</option>
                            <option value="Shariatpur">Shariatpur</option>
                            <option value="Sherpur">Sherpur</option>
                            <option value="Sirajganj">Sirajganj</option>
                            <option value="Sunamganj">Sunamganj</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Tangail">Tangail</option>
                            <option value="Thakurgaon">Thakurgaon</option>
                        </select>
                       {errors.district && <span className="text-red-500 text-xs mt-1">{errors.district}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Street Address *</label>
                        <input type="text" name="address" value={formData.address} placeholder="House and street name" onChange={handleInputChange}
                            className={`p-2.5 border rounded-md outline-none ${errors.address ? 'border-red-500' : 'focus:border-black'}`} />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Mobile Number *</label>
                        <input type="tel" name="phone" value={formData.phone} placeholder="017XXXXXXXX" onChange={handleInputChange}
                            className={`p-2.5 border rounded-md outline-none ${errors.phone ? 'border-red-500' : 'focus:border-black'}`} />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-1">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!!user}
                            className={`p-2.5 border rounded-md outline-none ${user ? 'bg-gray-100' : 'focus:border-black'}`} />
                    </div>
                </div>

                {/* Order Review - Right Side */}
                <motion.div 
                    layout
                    className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm h-fit"
                >
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 uppercase border-b pb-2">Your Order</h3>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {products.map((item) => (
                                <motion.div 
                                    key={`${item._id}-${item.size}`}
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex gap-3">
                                        <img src={item.image} className="w-16 h-16 object-cover rounded border" alt="" />
                                        <div className="flex flex-col justify-center">
                                            <span className="font-medium text-gray-800 text-sm">
                                                {item.name} {item.size && `(${item.size})`}
                                            </span>
                                            <div className="flex items-center border w-fit rounded mt-1 bg-white">
                                                {/* ফিক্সড: এখানে id এবং size দুইটাই পাঠানো হয়েছে */}
                                                <button type="button" onClick={() => handleUpdateQuantity('decrement', item._id, item.size)} className="px-2 py-0.5 hover:bg-gray-100 text-gray-700">-</button>
                                                <span className="px-3 py-0.5 text-xs font-bold border-x">{item.quantity}</span>
                                                <button type="button" onClick={() => handleUpdateQuantity('increment', item._id, item.size)} className="px-2 py-0.5 hover:bg-gray-100 text-gray-700">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm">Tk. {(item.price * item.quantity).toLocaleString()}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="mt-6 space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">Tk. {totalPrice.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span className="font-medium">Tk. {deliveryCharge}</span></div>
                        {discount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span className="font-bold">- Tk. {discount.toLocaleString()}</span></div>}
                        <div className="flex justify-between border-t pt-4 text-xl font-bold text-black uppercase">
                            <span>Total</span>
                            <span>Tk. {finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 my-6 pt-6 border-t">
                        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 p-2 border rounded outline-none text-sm" />
                        <button type="button" onClick={handleApplyCoupon} className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-800">Apply</button>
                    </div>

                    <motion.button 
                        whileHover={{ scale: isFormIncomplete ? 1 : 1.01 }}
                        whileTap={{ scale: isFormIncomplete ? 1 : 0.98 }}
                        onClick={makePayment} 
                        disabled={isFormIncomplete}
                        className={`w-full py-4 rounded font-bold text-lg uppercase transition-all ${isFormIncomplete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:shadow-lg'}`}
                    >
                        {isFormIncomplete ? 'Fill Required Fields' : `Place Order`}
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Checkout;