'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/shared/DataTable';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FlaskConical,
    AlertCircle,
    Hourglass,
    Banknote,
    ShoppingCart,
    CreditCard,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { formatCurrency, STATUS_COLORS } from '@/constants';
import type { TestOrder, Bill } from '@/types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOrders: TestOrder[] = [
    {
        id: '1',
        orderId: 'ORD-55210',
        patientId: 'DH-88291',
        patientName: 'Anura Kumara J.',
        patientAge: 42,
        patientGender: 'Male',
        orderDate: '2023-10-24',
        tests: [
            { testId: '1', testCode: 'LBT-001', testName: 'CBC', category: 'Hematology', price: 1200 },
            { testId: '2', testCode: 'LBT-042', testName: 'Lipid Profile', category: 'Biochemistry', price: 2450 },
            { testId: '3', testCode: 'LBT-011', testName: 'FBS', category: 'Biochemistry', price: 850 }
        ],
        status: 'IN_PROGRESS',
        subtotal: 4500,
        serviceCharge: 225,
        discount: 0,
        totalAmount: 4725,
    },
    {
        id: '2',
        orderId: 'ORD-55211',
        patientId: 'DH-88302',
        patientName: 'Nilmini Perera',
        patientAge: 35,
        patientGender: 'Female',
        orderDate: '2023-10-24',
        tests: [
            { testId: '4', testCode: 'LBT-005', testName: 'HbA1c', category: 'Biochemistry', price: 1800 },
            { testId: '5', testCode: 'LBT-012', testName: 'Vitamin D', category: 'Biochemistry', price: 3500 }
        ],
        status: 'PENDING',
        subtotal: 5300,
        serviceCharge: 265,
        discount: 0,
        totalAmount: 5565,
    },
];

const mockBills: Bill[] = [
    {
        id: '1',
        billId: 'INV-99042',
        orderId: 'ORD-55210',
        patientId: 'DH-88291',
        patientName: 'Anura Kumara J.',
        patientPhone: '+94 77 123 4567',
        orderDate: '2023-10-24',
        billDate: '2023-10-24',
        tests: [],
        subtotal: 4500,
        serviceCharge: 0,
        discount: 0,
        totalAmount: 4500,
        paidAmount: 4500,
        outstandingAmount: 0,
        paymentStatus: 'PAID',
        payments: [],
    },
    {
        id: '2',
        billId: 'INV-99043',
        orderId: 'ORD-55211',
        patientId: 'DH-88302',
        patientName: 'Nilmini Perera',
        patientPhone: '+94 77 987 6543',
        orderDate: '2023-10-24',
        billDate: '2023-10-24',
        tests: [],
        subtotal: 12800,
        serviceCharge: 0,
        discount: 0,
        totalAmount: 12800,
        paidAmount: 5000,
        outstandingAmount: 7800,
        paymentStatus: 'PARTIAL',
        payments: [],
    },
];

const STATS_BY_PERIOD = {
    '7': { testOrdersToday: 124, overduePayments: 18, partialPayments: 12, totalRevenueToday: 452300, trend: '+8%' },
    '30': { testOrdersToday: 540, overduePayments: 42, partialPayments: 35, totalRevenueToday: 1920000, trend: '+12%' },
    '90': { testOrdersToday: 1620, overduePayments: 98, partialPayments: 87, totalRevenueToday: 5840000, trend: '+15%' },
};

type Period = '7' | '30' | '90';

export default function OrdersBillingDashboard() {
    const router = useRouter();
    const [period, setPeriod] = useState<Period>('7');
    const stats = STATS_BY_PERIOD[period];

    const periodLabels: Record<Period, string> = {
        '7': 'Last 7 days',
        '30': 'Last 30 days',
        '90': 'Last 90 days',
    };

    const cyclePeriod = () => {
        setPeriod((p) => (p === '7' ? '30' : p === '30' ? '90' : '7'));
    };

    const orderColumns = [
        { header: 'ORDER ID', accessor: 'orderId' as const, className: 'font-medium' },
        { header: 'PATIENT NAME', accessor: 'patientName' as const },
        {
            header: 'TESTS SUMMARY',
            accessor: (row: TestOrder) => (
                <span className="text-gray-600">
                    {row.tests.map(t => t.testName).join(', ')}
                </span>
            ),
        },
        {
            header: 'ORDER STATUS',
            accessor: (row: TestOrder) => (
                <Badge variant="outline" className={STATUS_COLORS.ORDER[row.status]}>
                    {row.status.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            header: 'PAYMENT',
            accessor: () => (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    PAID
                </Badge>
            ),
        },
        {
            header: 'ACTIONS',
            accessor: (row: TestOrder) => (
                <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto font-normal flex items-center gap-1 hover:text-blue-700 transition-colors"
                    onClick={() => router.push(`/dashboard/orders/${row.id}`)}
                >
                    VIEW ORDER <ArrowRight className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    const billColumns = [
        { header: 'BILL ID', accessor: 'billId' as const, className: 'font-medium' },
        {
            header: 'TOTAL AMOUNT',
            accessor: (row: Bill) => formatCurrency(row.totalAmount),
            className: 'text-right',
        },
        {
            header: 'PAID AMOUNT',
            accessor: (row: Bill) => formatCurrency(row.paidAmount),
            className: 'text-right',
        },
        {
            header: 'OUTSTANDING',
            accessor: (row: Bill) => (
                <span className={row.outstandingAmount > 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                    {formatCurrency(row.outstandingAmount)}
                </span>
            ),
            className: 'text-right pr-20',
        },
        {
            header: 'STATUS',
            accessor: (row: Bill) => (
                <Badge variant="outline" className={
                    row.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-300' :
                        row.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-red-100 text-red-800 border-red-300'
                }>
                    {row.paymentStatus}
                </Badge>
            ),
            className: '',
        },
        {
            header: 'ACTIONS',
            accessor: (row: Bill) => (
                <Button
                    variant="link"
                    className="text-blue-600 p-0 h-auto font-normal flex items-center gap-1 hover:text-blue-700 transition-colors"
                    onClick={() => router.push(`/dashboard/bills/${row.id}`)}
                >
                    VIEW BILL <ArrowRight className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Orders & Billing Dashboard</h1>
                    <p className="text-gray-600 mt-1">
                        Manage laboratory test orders, billing statuses, and financial summaries.
                    </p>
                </div>
                <Button variant="outline" className="gap-2" onClick={cyclePeriod}>
                    <Calendar className="w-4 h-4" />
                    {periodLabels[period]}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Test Orders Today"
                    value={stats.testOrdersToday}
                    icon={FlaskConical}
                    iconColor="text-blue-600"
                    iconBgColor="bg-blue-100"
                    trend={{ value: stats.trend, isPositive: true }}
                />
                <StatCard
                    title="Overdue Payments"
                    value={stats.overduePayments}
                    icon={AlertCircle}
                    iconColor="text-red-600"
                    iconBgColor="bg-red-100"
                />
                <StatCard
                    title="Partial Payments"
                    value={stats.partialPayments}
                    icon={Hourglass}
                    iconColor="text-yellow-600"
                    iconBgColor="bg-yellow-100"
                />
                <StatCard
                    title="Total Revenue Today"
                    value={formatCurrency(stats.totalRevenueToday)}
                    icon={Banknote}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-100"
                />
            </div>

            <div className="flex gap-3 mb-8">
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push('/dashboard/create-order')}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create New Test Order
                </Button>

                {/* ── UPDATED BUTTON ── */}
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/payments/new')}
                >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                </Button>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Test Orders</h2>
                    <Button
                        variant="link"
                        className="text-blue-600 p-0 h-auto font-normal hover:text-blue-700"
                        onClick={() => router.push('/dashboard/orders')}
                    >
                        View All →
                    </Button>
                </div>
                <DataTable data={mockOrders} columns={orderColumns} />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Recent Bills</h2>
                    <Button
                        variant="link"
                        className="text-blue-600 p-0 h-auto font-normal hover:text-blue-700"
                        onClick={() => router.push('/dashboard/bills')}
                    >
                        View All →
                    </Button>
                </div>
                <DataTable data={mockBills} columns={billColumns} />
            </div>
        </div>
    );
}