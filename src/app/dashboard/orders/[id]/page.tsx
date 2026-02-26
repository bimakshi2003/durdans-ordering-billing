'use client';

import React, { use, useMemo, useState } from 'react';
import { ChevronLeft, FlaskConical, Calendar, User, ClipboardList, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/constants';

const mockOrders = [
    {
        id: '1',
        orderId: 'ORD-55210',
        patientName: 'Anura Kumara J.',
        patientAge: 42,
        patientGender: 'Male',
        orderDate: '2023-10-24',
        tests: [
            { testId: '1', testCode: 'LBT-001', testName: 'CBC', category: 'Hematology', price: 1200 },
            { testId: '2', testCode: 'LBT-042', testName: 'Lipid Profile', category: 'Biochemistry', price: 2450 },
            { testId: '3', testCode: 'LBT-011', testName: 'FBS', category: 'Biochemistry', price: 850 }
        ],
        status: 'IN_PROGRESS', // Button will be HIDDEN for this
        totalAmount: 4725,
    },
    {
        id: '2',
        orderId: 'ORD-55211',
        patientName: 'Nilmini Perera',
        patientAge: 35,
        patientGender: 'Female',
        orderDate: '2023-10-24',
        tests: [
            { testId: '4', testCode: 'LBT-005', testName: 'HbA1c', category: 'Biochemistry', price: 1800 },
            { testId: '5', testCode: 'LBT-012', testName: 'Vitamin D', category: 'Biochemistry', price: 3500 }
        ],
        status: 'PENDING', // Button will be VISIBLE for this
        totalAmount: 5565,
    },
];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const order = useMemo(() => {
        return mockOrders.find(o => o.id === resolvedParams.id);
    }, [resolvedParams.id]);

    const handleCancelOrder = () => {
        setIsCancelled(true);
        setIsCancelling(false);
    };

    if (!order) return null;

    // Logic: Only allow cancellation if status is PENDING and not already cancelled
    const canCancel = order.status === 'PENDING' && !isCancelled;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-blue-600 transition gap-2">
                        <ArrowLeft size={18} />
                        <span className="font-semibold text-sm">Back to Dashboard</span>
                    </Link>

                    {/* --- CONDITIONAL CANCEL BUTTON --- */}
                    {canCancel && (
                        <div className="flex items-center gap-2">
                            {isCancelling ? (
                                <div className="flex gap-2 items-center bg-white border border-red-100 p-1 rounded-lg shadow-sm animate-in fade-in zoom-in-95">
                                    <span className="text-[10px] font-bold text-red-500 px-2 uppercase tracking-tight">Confirm?</span>
                                    <Button variant="ghost" size="sm" className="h-8 text-slate-500 px-3" onClick={() => setIsCancelling(false)}>No</Button>
                                    <Button variant="destructive" size="sm" className="h-8 bg-red-600 px-3" onClick={handleCancelOrder}>Yes, Cancel</Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 gap-2 font-bold"
                                    onClick={() => setIsCancelling(true)}
                                >
                                    <Trash2 size={16} /> Cancel Order
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className={`${isCancelled ? 'bg-slate-500' : 'bg-blue-600'} p-8 text-white flex justify-between items-center transition-colors duration-500`}>
                        <div>
                            <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Laboratory Order</p>
                            <h1 className="text-3xl font-bold">{order.orderId}</h1>
                        </div>
                        <Badge className={`${isCancelled ? 'bg-slate-200 text-slate-700' : 'bg-white text-blue-600'} hover:bg-white text-sm px-4 py-1`}>
                            {isCancelled ? 'VOIDED' : order.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    <div className="p-8">
                        {/* --- ALERT MESSAGE BOX --- */}
                        {isCancelled && (
                            <div className="mb-8 border-2 border-red-200 bg-red-50 rounded-xl p-6 flex items-start gap-4 animate-in slide-in-from-top-4">
                                <div className="bg-red-100 p-3 rounded-full text-red-600 shadow-sm">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-red-800 font-bold text-lg">Order Successfully Cancelled</h3>
                                    <p className="text-red-600 text-sm mt-1 leading-relaxed">
                                        This order was cancelled on <strong>{new Date().toLocaleDateString()}</strong>.
                                        The lab records have been updated and this order will no longer appear in the daily processing queue.
                                    </p>
                                    <Link href="/dashboard" className="mt-4 block">
                                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Return to Dashboard</Button>
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-slate-50 p-6 rounded-xl border border-slate-100 transition-opacity ${isCancelled ? 'opacity-50' : ''}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><User size={20}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Patient</p>
                                    <p className="font-bold text-slate-700">{order.patientName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><ClipboardList size={20}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Details</p>
                                    <p className="font-bold text-slate-700">{order.patientAge}Y / {order.patientGender}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calendar size={20}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Order Date</p>
                                    <p className="font-bold text-slate-700">{order.orderDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className={isCancelled ? 'opacity-40 grayscale pointer-events-none' : ''}>
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FlaskConical size={20} className="text-blue-600"/> Ordered Tests
                            </h3>
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Test Name</th>
                                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase">Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {order.tests.map((test) => (
                                        <tr key={test.testId} className="border-b border-slate-50 last:border-none">
                                            <td className="p-4 font-semibold text-slate-700">{test.testName}</td>
                                            <td className="p-4 text-right font-bold text-slate-700">{formatCurrency(test.price)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50">
                                    <tr>
                                        <td className="p-4 text-right font-bold text-slate-500 uppercase text-[10px]">Net Total</td>
                                        <td className="p-4 text-right font-black text-blue-600 text-lg">{formatCurrency(order.totalAmount)}</td>
                                    </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}