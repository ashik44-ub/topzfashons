import React, { useEffect, useState } from 'react';
import avatarImg from "../../../../assets/avatar.png";
import { useDispatch, useSelector } from 'react-redux';
import { useEditProfileMutation } from '../../../../redux/features/auth/authApi';
import { setUser } from '../../../../redux/features/auth/authSlice';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';

const UserProfile = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    
    // তিনটি আলাদা মডালের জন্য স্টেট
    const [isModalOpen, setIsModalOpen] = useState(false); // General Profile & Image
    const [isEmailModalOpen, setEmailModalOpen] = useState(false); // Email Update
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false); // Password Update

    const [formData, setFormData] = useState({
        username: '',
        profileImage: '',
        bio: '',
        profession: '',
        dob: '',
        gender: '',
        email: '',
        oldPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                profileImage: user.profileImage || '',
                bio: user.bio || '',
                profession: user.profession || '',
                dob: user.dob || '',
                gender: user.gender || '',
                email: user.email || '',
                oldPassword: '',
                newPassword: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [editProfile, { isLoading }] = useEditProfileMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await editProfile({ id: user?._id, profileData: formData }).unwrap();
            const updatedUser = response.user || response.data || response; 
            
            dispatch(setUser(updatedUser)); 
            toast.success("Updated Successfully!");
            
            // সব মডাল বন্ধ করা
            setIsModalOpen(false);
            setEmailModalOpen(false);
            setPasswordModalOpen(false);
            
            // পাসওয়ার্ড ফিল্ড ক্লিয়ার করা
            setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
        } catch (error) {
            toast.error(error.data?.message || 'Update failed!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* --- Profile Header --- */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                    <img 
                        src={user?.profileImage || avatarImg} 
                        alt="Profile" 
                        className="w-32 h-32 object-cover rounded-2xl ring-4 ring-gray-50 shadow-lg" 
                    />
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                            {user?.username || "Guest User"}
                        </h2>
                        <p className="text-red-500 font-bold text-xs uppercase tracking-widest">{user?.profession || "No Profession Set"}</p>
                        <p className="text-gray-500 text-sm max-w-md">{user?.bio || "No bio added yet."}</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* --- Info Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] border-b pb-3">Personal Details</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Gender</span>
                                <span className="text-sm font-bold text-gray-900 uppercase">{user?.gender || "Not Set"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Birthday</span>
                                <span className="text-sm font-bold text-gray-900">{user?.dob || "Not Set"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] border-b pb-3">Contact & Security</h3>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                    <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                                </div>
                                <button onClick={() => setEmailModalOpen(true)} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-lg hover:bg-blue-100 transition-colors">Change</button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Password</p>
                                    <p className="text-sm font-bold text-gray-900">••••••••••••</p>
                                </div>
                                <button onClick={() => setPasswordModalOpen(true)} className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-lg hover:bg-red-100 transition-colors">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 1. Edit Profile Modal (General Info & Profile Image) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative p-8 animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 text-2xl">&times;</button>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-6">Update Profile</h2>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Profile Image URL */}
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profile Image URL</label>
                                <input type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="Paste image link here" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-900" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-900" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Profession</label>
                                <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-900" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Birthday</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-900" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-gray-900">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Bio</label>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none resize-none focus:border-gray-900"></textarea>
                            </div>
                            <button type="submit" disabled={isLoading} className="md:col-span-2 w-full py-4 bg-gray-900 text-white font-black uppercase rounded-2xl hover:bg-black transition-all shadow-xl">
                                {isLoading ? <BeatLoader size={8} color="#fff" /> : "Save Profile Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- 2. Email Update Modal --- */}
            {isEmailModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in zoom-in duration-200">
                        <button onClick={() => setEmailModalOpen(false)} className="absolute top-5 right-5 text-gray-400 text-2xl">&times;</button>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Update Email</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-500" />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold uppercase rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                                {isLoading ? <BeatLoader size={8} color="#fff" /> : "Update Email"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- 3. Password Update Modal --- */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative animate-in zoom-in duration-200">
                        <button onClick={() => setPasswordModalOpen(false)} className="absolute top-5 right-5 text-gray-400 text-2xl">&times;</button>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Security Update</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Required" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-red-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="New password" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-red-500" />
                            </div>
                            <button type="submit" disabled={isLoading} className="w-full py-3 bg-red-600 text-white font-bold uppercase rounded-xl hover:bg-red-700 transition-all shadow-lg">
                                {isLoading ? <BeatLoader size={8} color="#fff" /> : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;