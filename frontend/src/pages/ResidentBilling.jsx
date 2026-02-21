import React, { useState, useEffect } from 'react';
import { getMyBills, payBill } from '../services/dataService';
import { toast } from 'react-toastify';

export default function ResidentBilling() {
    const [searchTerm, setSearchTerm] = useState('');
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const data = await getMyBills();
                setBills(data);
            } catch (error) {
                toast.error('Failed to load bills.');
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    const handlePay = async (id, amount) => {
        try {
            await payBill(id, { amount, paymentMethod: 'Card' });
            toast.success('Payment successful!');
            setBills(bills.map(b => b._id === id ? { ...b, status: 'paid' } : b));
        } catch (error) {
            toast.error('Payment failed.');
        }
    };

    return (
        <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto custom-scrollbar overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Dues & Bills</h1>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                <p className="text-slate-600 dark:text-slate-400">View and pay your pending bills.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
                                <th className="py-3 px-4 font-semibold">Date</th>
                                <th className="py-3 px-4 font-semibold">Type</th>
                                <th className="py-3 px-4 font-semibold">Amount</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">Loading bills...</td>
                                </tr>
                            ) : bills.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500">No bills found.</td>
                                </tr>
                            ) : (
                                bills.map(bill => (
                                    <tr key={bill._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="py-3 px-4 text-sm font-medium">{new Date(bill.dueDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm capitalize">{bill.type}</td>
                                        <td className="py-3 px-4 text-sm font-bold">${bill.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded font-semibold capitalize ${bill.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : bill.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {bill.status !== 'paid' && (
                                                <button onClick={() => handlePay(bill._id, bill.amount)} className="text-sm font-bold text-primary hover:underline">Pay Now</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
