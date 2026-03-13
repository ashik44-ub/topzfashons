import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostAReviewMutation } from '../../../redux/features/reviews/reviewsApi';
import toast from 'react-hot-toast';

const PostAReview = ({ isModalOpen, handleClose }) => {
    const { id } = useParams(); // URL থেকে প্রোডাক্ট আইডি নিচ্ছি
    const { user } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const [postAReview, { isLoading }] = usePostAReviewMutation();
    const navigate = useNavigate();

    const handleRating = (value) => {
        setRating(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ১. ইউজার লগইন চেক
        if (!user) {
            alert("You must be logged in to post a review");
            return navigate('/login');
        }

        // ২. ভ্যালিডেশন
        if (rating === 0) {
            alert("Please select a rating!");
            return;
        }
        if (!comment.trim()) {
            alert("Please write a comment!");
            return;
        }

        const newReview = {
            comment: comment,
            rating: rating,
            userId: user?._id,
            productId: id // useParams থেকে পাওয়া আইডি
        };

        try {
            // unwrap() ব্যবহার করা হয়েছে সরাসরি রেজাল্ট পাওয়ার জন্য
            await postAReview(newReview).unwrap();
            toast.success("Thanks For Your Review");
            setRating(0);
            setComment('');
            handleClose(); // মডাল বন্ধ করা
        } catch (error) {
            console.error("Failed to post review:", error);
            alert(error?.data?.message || "Error posting review");
        }
    };

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 ${isModalOpen ? "flex" : "hidden"} bg-black/80 items-center justify-center z-50 px-2 transition-opacity duration-300`}
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Post a Review</h2>
                <p className="text-gray-500 mb-6">Share your feedback about this product.</p>

                {/* স্টার রেটিং সেকশন */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="font-semibold mr-2 text-gray-700">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            className={`text-2xl transition-all hover:scale-110 active:scale-90 ${
                                rating >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                        >
                            <i className={rating >= star ? "ri-star-fill" : "ri-star-line"}></i>
                        </button>
                    ))}
                </div>

                {/* কমেন্ট বক্স */}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full border border-gray-200 p-4 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm"
                    placeholder="Describe your experience..."
                />

                {/* বাটন গ্রুপ */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className={`px-8 py-2.5 bg-primary text-white rounded-full font-semibold shadow-lg shadow-primary/30 hover:bg-opacity-90 transition-all active:scale-95 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostAReview;