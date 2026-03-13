import React, { useState } from 'react'
import PostAReview from './PostAReview';
import RatingStar from '../../../components/RatingStar'
import avatar from '../../../assets/avatar.png'

const ReviewsCard = ({ productReviews }) => {
    const reviews = productReviews || [];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenReviewModal = () => {
        setIsModalOpen(true)
    }
    const handleCloseReviewModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className='my-6 bg-white p-8'>
            <div>
                {/* রিভিউ লিস্ট দেখানোর অংশ */}
                {reviews.length > 0 ? (
                    <div className='mb-12'>
                        <h3 className="text-lg font-medium mb-4">All Comments...</h3>
                        <div className='space-y-6'>
                            {reviews.map((item, index) => (
                                <div key={index} className="border-b pb-6">
                                    <div className="flex gap-4 items-center">
                                        <img src={avatar} alt="user" className="h-12 w-12 rounded-full" />
                                        <div className="space-y-1">
                                            <p className="text-lg font-medium underline capitalize underline-offset-4 text-blue-400">
                                                {item?.userId?.username || 'User'}
                                            </p>
                                            <p className="text-[12px] italic text-gray-400">
                                                {new Date(item?.createdAt).toLocaleDateString()}
                                            </p>
                                            <RatingStar rating={item?.rating} />
                                        </div>
                                    </div>
                                    <div className="text-gray-600 mt-4 bg-gray-50 p-4 rounded-md">
                                        <p className="md:w-4/5 leading-relaxed">{item?.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="mt-4 italic text-gray-500 mb-8">No reviews found yet.</p>
                )}
            </div>

            {/* রিভিউ দেওয়ার বাটন সেকশন */}
            <div id="content_product_reviews" className="animate-fadeIn p-6 bg-primary-light rounded-md">
                <h4 className="font-bold text-lg">Review this product</h4>
                <p className="text-gray-600 mb-4">Share your thoughts with other customers</p>
                <button
                    onClick={handleOpenReviewModal}
                    className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-primary transition-colors flex items-center gap-2"
                >
                    <i className="ri-pencil-line"></i> Write a review
                </button>
            </div>

            {/* রিভিউ পোস্ট করার মডাল */}
            <PostAReview isModalOpen={isModalOpen} handleClose={handleCloseReviewModal} />
        </div>
    )
}

export default ReviewsCard