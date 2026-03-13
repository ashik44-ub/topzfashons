import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getBaseUrl } from '../../../utils/getBaseUrl';
import { updateQuantity } from '../../../redux/features/cart/CartSlice';
import toast from 'react-hot-toast';

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

    // ১. পেজ লোড হওয়ার সময় লোকাল স্টোরেজ থেকে ডাটা রিট্রিভ করা
    useEffect(() => {
        const savedData = localStorage.getItem('checkoutFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(parsedData);

            // ডিস্ট্রিক্ট অনুযায়ী ডেলিভারি চার্জ পুনরায় সেট করা
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

        // ২. ডাটা টাইপ করার সাথে সাথে লোকাল স্টোরেজে সেভ করা
        localStorage.setItem('checkoutFormData', JSON.stringify(updatedFormData));

        if (name === 'district') {
            if (value === 'Dhaka') {
                setDeliveryCharge(70);
            } else if (value === '') {
                setDeliveryCharge(0);
            } else {
                setDeliveryCharge(120);
            }
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
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

                // ১. শুরুর তারিখ চেক (Start Date Check)
                if (currentDate < start) {
                    setDiscount(0);
                    return toast.error(`This coupon will be Open from ${start.toLocaleDateString('en-GB')}`);
                }

                // ২. মেয়াদের তারিখ চেক (Expiry Date Check)
                if (currentDate > expiry) {
                    setDiscount(0);
                    return toast.error("This coupon has expired!");
                }

                // ৩. একটিভ স্ট্যাটাস চেক
                if (!coupon.isActive) {
                    setDiscount(0);
                    return toast.error("This coupon is currently inactive!");
                }

                // ৪. মিনিমাম অর্ডার চেক
                if (totalPrice < coupon.minAmount) {
                    setDiscount(0);
                    return toast.error(`Minimum order Tk. ${coupon.minAmount} required!`);
                }

                // ৫. ডিসকাউন্ট ক্যালকুলেশন
                let calculatedDiscount = 0;
                if (coupon.discountType === "percentage") {
                    calculatedDiscount = (totalPrice * coupon.discountValue) / 100;
                } else {
                    calculatedDiscount = coupon.discountValue;
                }

                setDiscount(Number(calculatedDiscount));
                toast.success(`Coupon Applied! Saved Tk. ${calculatedDiscount}`);
            }
        } catch (error) {
            setDiscount(0);
            const message = error.response?.data?.message || "Invalid Coupon Code";
            toast.error(message);
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.district) newErrors.district = "Please select a district";
        if (!formData.phone.trim() || !/^\d{11}$/.test(formData.phone)) {
            newErrors.phone = "Valid 11-digit phone number is required";
        }
        if (!formData.email.trim()) newErrors.email = "Email is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const makePayment = async () => {
        if (!validateForm()) return toast.error("Please fill all required fields!");

        const currentDiscount = Number(discount) || 0;
        const currentShipping = Number(deliveryCharge) || 0;
        const currentSubtotal = Number(totalPrice) || 0;
        const calculatedAmount = (currentSubtotal + currentShipping) - currentDiscount;

        const body = {
            products: products.map(p => ({
                productId: p._id,
                name: p.name,
                price: p.price,
                quantity: p.quantity,
                size: p.size,
                image: p.image
            })),
            userId: user?._id || null,
            username: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            amount: calculatedAmount,
            discount: currentDiscount,
            shippingInfo: {
                ...formData,
                deliveryCharge: currentShipping
            },
            status: "pending"
        };

        try {
            const response = await axios.post(`${getBaseUrl()}/order`, body);
            if (response.data?.url) {
                // পেমেন্ট পেজে যাওয়ার আগে ডাটা ক্লিয়ার করার দরকার নেই, 
                // কারণ পেমেন্ট ক্যানসেল করে ফিরে আসলে আমরা ডাটা রাখতে চাই।
                window.location.replace(response.data.url);
            }
        } catch (error) {
            console.error("Order error:", error);
            toast.error("Order is not proccessing।");
        }
    };

    const finalTotal = (Number(totalPrice) + deliveryCharge) - discount;
    const isFormIncomplete = !formData.firstName || !formData.address || !formData.district || !formData.phone;

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-28 py-12 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Billing Details */}
                <div className="space-y-5">
                    <h3 className="text-2xl font-bold border-b pb-3 text-gray-800 uppercase">Billing Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">First Name *</label>
                            <input placeholder='First Name' type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                className={`p-2.5 border rounded-md outline-none ${errors.firstName ? 'border-red-500' : 'focus:border-black'}`} />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold mb-1">Last Name</label>
                            <input placeholder='Last Name' type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                className="p-2.5 border rounded-md outline-none focus:border-black" />
                        </div>
                    </div>

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

                {/* Order Review */}
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm h-fit">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 uppercase border-b pb-2">Your Order</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            {products.map((item) => (
                                <tr key={item._id} className="border-b">
                                    <td className="py-4 flex gap-3">
                                        <img src={item.image} alt="" className="w-16 h-16 object-cover rounded border" />
                                        <div className="flex flex-col justify-center">
                                            <span className="font-medium text-gray-800 mb-1">
                                                {item.name} {item.size && `(${item.size})`}
                                            </span>
                                            <div className="flex items-center border w-fit rounded overflow-hidden">
                                                <button type="button" onClick={() => dispatch(updateQuantity({ id: item._id, type: 'decrement' }))}
                                                    className="px-2 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold">-</button>
                                                <span className="px-3 py-1 bg-white text-xs font-bold border-x">{item.quantity}</span>
                                                <button type="button" onClick={() => dispatch(updateQuantity({ id: item._id, type: 'increment' }))}
                                                    className="px-2 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold">+</button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right font-bold align-middle">
                                        Tk. {(item.price * item.quantity).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="text-gray-700">
                            <tr className="border-b">
                                <td className="py-3">Subtotal</td>
                                <td className="py-3 text-right font-bold">Tk. {totalPrice.toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-3">Shipping</td>
                                <td className="py-3 text-right font-medium">Tk. {deliveryCharge}</td>
                            </tr>
                            {discount > 0 && (
                                <tr className="border-b text-red-600">
                                    <td className="py-3 font-medium">Discount</td>
                                    <td className="py-3 text-right font-bold">- Tk. {discount.toLocaleString()}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="py-4 text-xl font-bold uppercase">Total</td>
                                <td className="py-4 text-right text-xl font-extrabold text-black">Tk. {finalTotal.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="flex gap-2 my-6 pt-6 border-t">
                        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 p-2 border rounded outline-none text-sm" />
                        <button type="button" onClick={handleApplyCoupon} className="bg-black text-white px-4 py-2 rounded text-xs font-bold uppercase">Apply</button>
                    </div>

                    <button type="button" onClick={makePayment} disabled={isFormIncomplete}
                        className={`w-full py-4 rounded font-bold text-lg uppercase transition-all 
                            ${isFormIncomplete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                        {isFormIncomplete ? 'Fill All Fields' : `Place Order (Tk. ${finalTotal.toLocaleString()})`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;