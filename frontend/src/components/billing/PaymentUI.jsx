import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PaymentUI({ bill, onBack, onPaySuccess }) {
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [upiId, setUpiId] = useState('');

    // Card Details
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    // Net Banking
    const [selectedBank, setSelectedBank] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate payment delay
        setTimeout(async () => {
            try {
                let methodDetails = paymentMethod;
                if (paymentMethod === 'upi') methodDetails = `UPI (${upiId})`;
                else if (paymentMethod === 'card') methodDetails = `Card (****${cardNumber.slice(-4)})`;
                else if (paymentMethod === 'netbanking') methodDetails = `Net Banking (${selectedBank})`;

                await onPaySuccess(bill._id, {
                    amount: bill.amount,
                    paymentMethod: methodDetails
                });
            } catch (error) {
                console.error("Payment failed", error);
            } finally {
                setIsProcessing(false);
            }
        }, 1500);
    };

    const isPayDisabled = () => {
        if (isProcessing) return true;
        if (paymentMethod === 'upi') return !upiId;
        if (paymentMethod === 'card') return !cardNumber || !cardExpiry || !cardCvv || !cardHolder;
        if (paymentMethod === 'netbanking') return !selectedBank;
        return false;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md mx-auto"
        >
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-xl font-bold">Complete Payment</h2>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">Amount Due</span>
                    <span className="text-xl font-bold text-primary">₹{bill.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Invoice: {bill.invoiceNumber || 'N/A'}</span>
                    <span className="capitalize">{bill.type}</span>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-1">Select Payment Method</p>

                {/* UPI Option */}
                <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                    <span className="material-symbols-outlined text-primary">contactless_pay</span>
                    <div className="flex-1">
                        <p className="font-bold text-sm">UPI</p>
                        <p className="text-xs text-slate-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary' : 'border-slate-300'}`}>
                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                </div>

                {paymentMethod === 'upi' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-2">
                        <input
                            type="text"
                            placeholder="username@bankid"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Enter your UPI ID to continue</p>
                    </motion.div>
                )}

                {/* Card Option */}
                <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                    <span className="material-symbols-outlined text-slate-600">credit_card</span>
                    <div className="flex-1">
                        <p className="font-bold text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-slate-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                </div>

                {paymentMethod === 'card' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-2 space-y-3">
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            maxLength={16}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                maxLength={5}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <input
                                type="password"
                                placeholder="CVV"
                                value={cardCvv}
                                maxLength={3}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                className="w-1/2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Net Banking Option */}
                <div
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                >
                    <span className="material-symbols-outlined text-slate-600">account_balance</span>
                    <div className="flex-1">
                        <p className="font-bold text-sm">Net Banking</p>
                        <p className="text-xs text-slate-500">All major banks supported</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'netbanking' ? 'border-primary' : 'border-slate-300'}`}>
                        {paymentMethod === 'netbanking' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                </div>

                {paymentMethod === 'netbanking' && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-2">
                        <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select Bank</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="Axis">Axis Bank</option>
                            <option value="KOTAK">Kotak Bank</option>
                        </select>
                    </motion.div>
                )}
            </div>

            <button
                onClick={handlePayment}
                disabled={isPayDisabled()}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                        Pay ₹{bill.amount.toFixed(2)} Now
                    </>
                )}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-4">Secured by SocietyConnect Payment Gateway</p>
        </motion.div>
    );
}
