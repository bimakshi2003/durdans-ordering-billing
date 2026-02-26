'use client';

import React, { useState, useMemo, use } from 'react';
import { ChevronLeft, Printer, UserCheck, Receipt } from 'lucide-react'; // Added Receipt icon
import Link from 'next/link';

// Updated Mock Data with tests and prices
const mockBills = [
    {
        id: '1',
        billId: 'INV-2023-004521',
        orderId: 'ORD-55429',
        patientName: 'Anura Kumara Jayantha',
        totalAmount: 4725,
        paidAmount: 2000,
        outstandingAmount: 2725,
        tests: [
            { name: 'Full Blood Count (CBC)', price: 1200 },
            { name: 'Lipid Profile', price: 2450 },
            { name: 'FBS (Fasting Blood Sugar)', price: 1075 }
        ]
    },
    {
        id: '2',
        billId: 'INV-2023-004520',
        orderId: 'ORD-55428',
        patientName: 'Dilhani Perera',
        totalAmount: 12400,
        paidAmount: 12400,
        outstandingAmount: 0,
        tests: [
            { name: 'Vitamin D (25-OH)', price: 11000 },
            { name: 'Serum Creatinine', price: 1400 }
        ]
    },
    // Adding default tests for other mocks to prevent errors
    { id: '3', billId: 'INV-2023-004519', orderId: 'ORD-55425', patientName: 'Maithripala S.', totalAmount: 8500, paidAmount: 0, outstandingAmount: 8500, tests: [{ name: 'General Lab Services', price: 8500 }] },
    { id: '4', billId: 'INV-2023-004518', orderId: 'ORD-55421', patientName: 'Shirani K.', totalAmount: 3200, paidAmount: 3200, outstandingAmount: 0, tests: [{ name: 'General Lab Services', price: 3200 }] },
    { id: '5', billId: 'INV-2023-004517', orderId: 'ORD-55420', patientName: 'Kamal Bandara', totalAmount: 7035, paidAmount: 3000, outstandingAmount: 4035, tests: [{ name: 'General Lab Services', price: 7035 }] },
    { id: '6', billId: 'INV-2023-004516', orderId: 'ORD-55418', patientName: 'Priyantha Rajapaksa', totalAmount: 5355, paidAmount: 0, outstandingAmount: 5355, tests: [{ name: 'General Lab Services', price: 5355 }] },
    { id: '7', billId: 'INV-2023-004515', orderId: 'ORD-55415', patientName: 'Sandya Fernando', totalAmount: 10290, paidAmount: 10290, outstandingAmount: 0, tests: [{ name: 'General Lab Services', price: 10290 }] },
    { id: '8', billId: 'INV-2023-004514', orderId: 'ORD-55412', patientName: 'Nirosha Wickramasinghe', totalAmount: 2940, paidAmount: 1500, outstandingAmount: 1440, tests: [{ name: 'General Lab Services', price: 2940 }] },
];

export default function BillDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const billIdFromUrl = resolvedParams.id;

    const bill = useMemo(() => {
        return mockBills.find(b =>
            String(b.id) === String(billIdFromUrl) ||
            b.billId === billIdFromUrl
        );
    }, [billIdFromUrl]);

    const [transactionId] = useState(() => `TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    const [issuedBy] = useState("Dr. Adrian S.");
    const [currentDate] = useState(() => new Date().toLocaleDateString('en-GB'));
    const [currentTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    if (!bill) {
        return (
            <div className="p-20 text-center flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-red-600">Bill Not Found</h2>
                <p className="text-slate-500">Received ID: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{billIdFromUrl || 'None'}</span></p>
                <Link href="/dashboard/bills" className="text-blue-600 font-bold hover:underline">Return to List</Link>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans print:bg-white print:p-0">
            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 1.5cm; }
                    nav, header, aside, footer, button, a, .print-hidden { display: none !important; }
                }
            `}</style>

            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link href="/dashboard/bills" className="flex items-center text-slate-500 hover:text-blue-600 transition">
                    <ChevronLeft size={20} />
                    <span className="font-semibold">Back to Records</span>
                </Link>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">
                    <Printer size={18} className="inline mr-2" /> Print Receipt
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
                <div className="bg-slate-900 p-10 text-white text-center">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Durdans Hospital ERP</p>
                    <h1 className="text-2xl font-bold">Official Receipt</h1>
                </div>

                <div className="p-10">
                    <div className="mb-10 pb-6 border-b border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Name</label>
                        <h2 className="text-3xl font-black text-slate-900 mt-1 uppercase">{bill.patientName}</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Bill ID</p>
                            <p className="font-mono font-bold text-slate-700">{bill.billId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                            <p className="font-mono font-bold text-slate-700">{bill.orderId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                            <p className="font-mono font-bold text-slate-700">{transactionId}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Issued By</p>
                            <p className="font-bold text-slate-900 flex items-center gap-1.5"><UserCheck size={14} /> {issuedBy}</p>
                        </div>
                    </div>

                    {/* NEW: Itemized Tests Section */}
                    <div className="mt-10">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Receipt size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Itemized Charges</span>
                        </div>
                        <div className="border border-slate-100 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Service / Test Description</th>
                                    <th className="px-6 py-3 text-right">Amount (LKR)</th>
                                </tr>
                                </thead>
                                <tbody className="text-sm">
                                {bill.tests?.map((test, index) => (
                                    <tr key={index} className="border-t border-slate-100">
                                        <td className="px-6 py-4 text-slate-700 font-medium">{test.name}</td>
                                        <td className="px-6 py-4 text-right text-slate-900 font-bold">{test.price.toLocaleString()}.00</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4 max-w-xs ml-auto bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Total Bill</span>
                            <span className="font-bold text-slate-800">LKR {bill.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Amount Paid</span>
                            <span className="font-bold text-green-600">LKR {bill.paidAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-200">
                            <span className="text-[10px] font-black uppercase">Balance Due</span>
                            <span className="text-lg font-black text-blue-600">LKR {bill.outstandingAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-20 flex justify-between items-center border-t border-slate-100 pt-6">
                        <p className="text-[10px] text-slate-400 italic">Electronically verified document</p>
                        <p className="text-[10px] text-slate-300 font-mono">{currentDate} {currentTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}