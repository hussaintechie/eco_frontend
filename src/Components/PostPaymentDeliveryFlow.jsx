import React, { useState, useEffect } from "react";
import { Star, Check, User, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getReviewStatusAPI, submitReviewAPI } from "../api/review";
import { toast } from "react-toastify";


const PostPaymentDeliveryFlow = ({ order_id }) => {
  const navigate = useNavigate();

  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState("");

  const ratingTags = [
    "Fast Delivery",
    "Fresh Items",
    "Good Packaging",
    "Polite Partner",
  ];

  // 🔹 Check review status on load
  useEffect(() => {
    checkReviewStatus();
  }, []);

  const checkReviewStatus = async () => {
    try {
      const res = await getReviewStatusAPI();

      if (!res.data.isReviewed) {
        setShowReview(true);

        // ⏱ Auto hide after 20 seconds
        setTimeout(() => {
          setShowReview(false);
        }, 20000);
      }
    } catch (err) {
      console.error("Review status error", err);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const submitFeedback = async () => {
    try {
      if (!rating) {
        toast.error("Please select a rating");
        return;
      }

      await submitReviewAPI({
        rating,
        tags: selectedTags,
        comment,
      });

      setShowReview(false);
    } catch (err) {
      setShowReview(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 p-6 text-center">

      {/* ✅ Payment Success */}
      <div className="bg-white p-5 rounded-full shadow-lg mb-4">
        <Check size={60} className="text-green-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">
        Order Placed Successfully
      </h2>

      <p className="text-gray-500 mt-2 mb-6">
        Your items are being prepared 🚚
      </p>

      {/* ⭐ REVIEW UI (First User Only – 20 sec) */}
      {showReview && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <User size={32} className="text-gray-500" />
          </div>

          <h3 className="font-bold text-lg mb-1">
            Rate Your Experience
          </h3>

          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={34}
                className={`cursor-pointer ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {ratingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  selectedTags.includes(tag)
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={submitFeedback}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* 🚚 TRACK ORDER BUTTON */}
      <button
        onClick={() => navigate("/orders")}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
      >
        <Truck size={20} />
        Track Order
      </button>

    </div>
  );
};

export default PostPaymentDeliveryFlow;
