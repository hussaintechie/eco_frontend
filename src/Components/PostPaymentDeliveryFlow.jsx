import React, { useState, useRef, useEffect } from 'react';
import { Star, Check, ShieldCheck, User, Package } from 'lucide-react';

const PostPaymentDeliveryFlow = () => {
  // Steps: 'payment_success' -> 'verify_delivery' -> 'rate_delivery' -> 'finished'
  const [currentStep, setCurrentStep] = useState('payment_success');
  
  // Verification State
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  // Rating State
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  const ratingTags = ["Fast Delivery", "Fresh Items", "Good Packaging", "Polite Partner"];

  // --- Handlers ---

  // OTP Input Logic (Auto-focus next box)
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOrder = () => {
    // API Call to verify OTP goes here
    console.log("Verifying Code:", otp.join(''));
    setTimeout(() => {
      setCurrentStep('rate_delivery');
    }, 500);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const submitFeedback = () => {
    // API Call to save rating
    console.log({ rating, selectedTags, comment });
    setCurrentStep('finished');
  };

  // --- RENDER STEPS ---

  // 1. Payment Success Splash
  if (currentStep === 'payment_success') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50 p-6 text-center">
        <div className="bg-white p-5 rounded-full shadow-lg mb-6 animate-bounce">
          <Check size={60} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500 mt-2 mb-8">Your items are being packed.</p>
        
        {/* Simulate waiting for delivery arrival */}
        <button 
          onClick={() => setCurrentStep('verify_delivery')}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-green-700 transition"
        >
          Track Order & Verify
        </button>
      </div>
    );
  }

  // 2. Delivery Verification (Enter Code)
  if (currentStep === 'verify_delivery') {
    return (
      <div className="flex flex-col h-screen bg-white">
        <div className="p-6 pt-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Secure Delivery</h2>
              <p className="text-sm text-gray-500">Enter PIN to receive package</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center mb-8">
            <p className="text-gray-600 mb-4 font-medium">Ask delivery partner for code</p>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpBackspace(e, index)}
                  className="w-14 h-14 border-2 border-gray-300 rounded-xl text-center text-2xl font-bold focus:border-green-500 focus:outline-none bg-white shadow-sm"
                />
              ))}
            </div>
          </div>

          <button 
            onClick={verifyOrder}
            disabled={otp.join('').length < 4}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              otp.join('').length === 4 
              ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Receipt
          </button>
        </div>
      </div>
    );
  }

  // 3. Rating & Review
  if (currentStep === 'rate_delivery') {
    return (
      <div className="flex flex-col h-screen bg-white overflow-y-auto">
        <div className="p-6 pt-10 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User size={40} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Rate Delivery Partner</h2>
          <p className="text-sm text-gray-500">How was your experience?</p>

          {/* Star Rating */}
          <div className="flex justify-center gap-3 my-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={40}
                className={`cursor-pointer transition-colors ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {ratingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedTags.includes(tag)
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

        
        </div>
      </div>
    );
  }

  // 4. Finished State
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white p-6 text-center">
      <div className="bg-green-100 p-6 rounded-full mb-6">
        <Package size={48} className="text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
      <p className="text-gray-500 mt-2">Your feedback helps us improve.</p>
      <button 
        className="mt-8 px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default PostPaymentDeliveryFlow;