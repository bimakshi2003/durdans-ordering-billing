'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    CreditCard,
    Receipt,
    Wallet,
    CheckCircle2,
    User,
    FileText,
    Search,
    XCircle,
    AlertCircle,
    Printer,
    UserCheck,
} from 'lucide-react';
import { formatCurrency, formatDateTime, PAYMENT_METHODS } from '@/constants';
import { toast } from 'sonner';
import Link from 'next/link';

// ✅ COMPLETE MOCK DATA - ALL PATIENTS
const mockPatientsWithBills = [
    {
        id: '1',
        billId: 'INV-2023-004521',
        orderId: 'ORD-55429',
        billDate: '2023-10-25T10:30:00',
        patient: {
            name: 'Anura Kumara Jayantha',
            id: 'DH-88291',
            age: 42,
            gender: 'Male',
            phone: '+94 77 123 4567',
            email: 'anura.kumara@email.com',
        },
        doctor: { name: 'Dr. K. Perera', regNo: 'SLMC-12345' },
        subtotal: 4500,
        serviceCharge: 225,
        discount: 0,
        totalAmount: 4725,
        paidAmount: 0,
        outstandingAmount: 4725,
        paymentStatus: 'PENDING',
        tests: [
            { name: 'Complete Blood Count (CBC)', code: 'LBT-001', price: 1200 },
            { name: 'Lipid Profile', code: 'LBT-042', price: 2450 },
            { name: 'Fasting Blood Sugar (FBS)', code: 'LBT-011', price: 850 },
        ],
    },
    {
        id: '2',
        billId: 'INV-2023-004520',
        orderId: 'ORD-55428',
        billDate: '2023-10-25T11:45:00',
        patient: {
            name: 'Dilhani Perera',
            id: 'DH-88302',
            age: 35,
            gender: 'Female',
            phone: '+94 71 234 5678',
            email: 'dilhani.p@email.com',
        },
        doctor: { name: 'Dr. S. Jayawardena', regNo: 'SLMC-23456' },
        subtotal: 12400,
        serviceCharge: 0,
        discount: 0,
        totalAmount: 12400,
        paidAmount: 12400,
        outstandingAmount: 0,
        paymentStatus: 'PAID',
        tests: [
            { name: 'Vitamin D (25-OH)', code: 'LBT-025', price: 11000 },
            { name: 'Serum Creatinine', code: 'LBT-018', price: 1400 },
        ],
    },
    {
        id: '3',
        billId: 'INV-2023-004519',
        orderId: 'ORD-55425',
        billDate: '2023-10-24T14:20:00',
        patient: {
            name: 'Maithripala Silva',
            id: 'DH-88411',
            age: 55,
            gender: 'Male',
            phone: '+94 76 345 6789',
            email: 'maithri.silva@email.com',
        },
        doctor: { name: 'Dr. R. Fernando', regNo: 'SLMC-67890' },
        subtotal: 8500,
        serviceCharge: 425,
        discount: 0,
        totalAmount: 8925,
        paidAmount: 0,
        outstandingAmount: 8925,
        paymentStatus: 'OVERDUE',
        tests: [
            { name: 'HbA1c', code: 'LBT-005', price: 1800 },
            { name: 'Lipid Profile', code: 'LBT-042', price: 2450 },
            { name: 'Complete Blood Count', code: 'LBT-001', price: 1200 },
            { name: 'Liver Function Test', code: 'LBT-015', price: 3050 },
        ],
    },
    {
        id: '4',
        billId: 'INV-2023-004518',
        orderId: 'ORD-55421',
        billDate: '2023-10-24T09:30:00',
        patient: {
            name: 'Shirani Karunaratne',
            id: 'DH-88450',
            age: 38,
            gender: 'Female',
            phone: '+94 77 456 7890',
            email: 'shirani.k@email.com',
        },
        doctor: { name: 'Dr. M. Dissanayake', regNo: 'SLMC-34567' },
        subtotal: 3200,
        serviceCharge: 0,
        discount: 0,
        totalAmount: 3200,
        paidAmount: 3200,
        outstandingAmount: 0,
        paymentStatus: 'PAID',
        tests: [
            { name: 'Thyroid Profile (TSH, T3, T4)', code: 'LBT-020', price: 3200 },
        ],
    },
    {
        id: '5',
        billId: 'INV-2023-004517',
        orderId: 'ORD-55420',
        billDate: '2023-10-23T09:15:00',
        patient: {
            name: 'Kamal Bandara',
            id: 'DH-88399',
            age: 48,
            gender: 'Male',
            phone: '+94 70 567 8901',
            email: 'kamal.b@email.com',
        },
        doctor: { name: 'Dr. S. Wijesinghe', regNo: 'SLMC-11223' },
        subtotal: 6700,
        serviceCharge: 335,
        discount: 0,
        totalAmount: 7035,
        paidAmount: 3000,
        outstandingAmount: 4035,
        paymentStatus: 'PARTIAL',
        tests: [
            { name: 'Lipid Profile', code: 'LBT-042', price: 2450 },
            { name: 'Fasting Blood Sugar', code: 'LBT-011', price: 850 },
            { name: 'Thyroid Profile', code: 'LBT-020', price: 3400 },
        ],
    },
    {
        id: '6',
        billId: 'INV-2023-004516',
        orderId: 'ORD-55418',
        billDate: '2023-10-23T16:45:00',
        patient: {
            name: 'Priyantha Rajapaksa',
            id: 'DH-88310',
            age: 60,
            gender: 'Male',
            phone: '+94 71 678 9012',
            email: 'priyantha.r@email.com',
        },
        doctor: { name: 'Dr. N. Gunawardena', regNo: 'SLMC-44556' },
        subtotal: 5100,
        serviceCharge: 255,
        discount: 0,
        totalAmount: 5355,
        paidAmount: 0,
        outstandingAmount: 5355,
        paymentStatus: 'OVERDUE',
        tests: [
            { name: 'Kidney Function Test', code: 'LBT-017', price: 2200 },
            { name: 'Urine Full Report', code: 'LBT-008', price: 900 },
            { name: 'ECG', code: 'LBT-030', price: 2000 },
        ],
    },
    {
        id: '7',
        billId: 'INV-2023-004515',
        orderId: 'ORD-55415',
        billDate: '2023-10-22T10:20:00',
        patient: {
            name: 'Sandya Fernando',
            id: 'DH-88275',
            age: 29,
            gender: 'Female',
            phone: '+94 76 789 0123',
            email: 'sandya.f@email.com',
        },
        doctor: { name: 'Dr. A. Colombage', regNo: 'SLMC-55667' },
        subtotal: 9800,
        serviceCharge: 490,
        discount: 0,
        totalAmount: 10290,
        paidAmount: 10290,
        outstandingAmount: 0,
        paymentStatus: 'PAID',
        tests: [
            { name: 'Complete Blood Count', code: 'LBT-001', price: 1200 },
            { name: 'Liver Function Test', code: 'LBT-015', price: 3050 },
            { name: 'Kidney Function Test', code: 'LBT-017', price: 2200 },
            { name: 'Lipid Profile', code: 'LBT-042', price: 2450 },
            { name: 'Vitamin D', code: 'LBT-025', price: 900 },
        ],
    },
    {
        id: '8',
        billId: 'INV-2023-004514',
        orderId: 'ORD-55412',
        billDate: '2023-10-22T14:30:00',
        patient: {
            name: 'Nirosha Wickramasinghe',
            id: 'DH-88201',
            age: 45,
            gender: 'Female',
            phone: '+94 77 890 1234',
            email: 'nirosha.w@email.com',
        },
        doctor: { name: 'Dr. P. Amarasinghe', regNo: 'SLMC-66778' },
        subtotal: 2800,
        serviceCharge: 140,
        discount: 0,
        totalAmount: 2940,
        paidAmount: 1500,
        outstandingAmount: 1440,
        paymentStatus: 'PARTIAL',
        tests: [
            { name: 'HbA1c', code: 'LBT-005', price: 1800 },
            { name: 'Fasting Blood Sugar', code: 'LBT-011', price: 850 },
            { name: 'Serum Creatinine', code: 'LBT-018', price: 150 },
        ],
    },
];

export default function NewPaymentPage() {
    const router = useRouter();

    // ✅ FIX: All hooks at the top level - BEFORE any conditional returns
    const [currentStep, setCurrentStep] = useState<'search' | 'payment' | 'success'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<typeof mockPatientsWithBills>([]);
    const [selectedBill, setSelectedBill] = useState<typeof mockPatientsWithBills[0] | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [receiptId, setReceiptId] = useState('');
    const [transactionId] = useState(() => `TXN-${Math.floor(100000 + Math.random() * 900000)}`);

    const [formData, setFormData] = useState({
        amount: '',
        method: 'CASH',
        referenceNumber: '',
        cardLastFour: '',
        bankName: '',
        notes: '',
        receivedBy: 'Dr. Adrian S.',
    });

    // Search function
    const handleSearch = () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a patient name, ID, or bill number');
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = mockPatientsWithBills.filter(
            (bill) =>
                bill.patient.name.toLowerCase().includes(query) ||
                bill.patient.id.toLowerCase().includes(query) ||
                bill.billId.toLowerCase().includes(query) ||
                bill.orderId.toLowerCase().includes(query)
        );

        setSearchResults(results);

        if (results.length === 0) {
            toast.error('No bills found matching your search');
        }
    };

    // Select bill for payment
    const handleSelectBill = (bill: typeof mockPatientsWithBills[0]) => {
        setSelectedBill(bill);
        setFormData({ ...formData, amount: bill.outstandingAmount.toString() });
        setCurrentStep('payment');
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    // Submit payment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const amount = parseFloat(formData.amount);

        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid payment amount');
            setIsSubmitting(false);
            return;
        }

        if (selectedBill && amount > selectedBill.outstandingAmount) {
            toast.error(
                `Payment amount cannot exceed outstanding balance of ${formatCurrency(
                    selectedBill.outstandingAmount
                )}`
            );
            setIsSubmitting(false);
            return;
        }

        if (formData.method !== 'CASH' && !formData.referenceNumber) {
            toast.error('Please enter a reference number for non-cash payments');
            setIsSubmitting(false);
            return;
        }

        setTimeout(() => {
            const newReceiptId = `RCP-${Date.now()}`;
            setReceiptId(newReceiptId);
            setCurrentStep('success');
            toast.success(`Payment of ${formatCurrency(amount)} recorded successfully!`);
            setIsSubmitting(false);
        }, 1500);
    };

    // Print receipt
    const handlePrintReceipt = () => {
        window.print();
    };

    // ========== STEP 1: SEARCH SCREEN ==========
    if (currentStep === 'search') {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold">Process Payment</h1>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Search for a patient or bill to process payment
                    </p>

                    {/* Search Card */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search by Patient Name, Patient ID, Bill ID, or Order ID
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="e.g., Anura Kumara, DH-88291, INV-2023-004521"
                                                className="pl-10 h-12 text-lg"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                        {searchQuery && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleClearSearch}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={handleSearch}
                                            className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </div>

                                {/* Quick Tips */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex gap-2">
                                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-medium mb-1">Search Tips:</p>
                                            <ul className="list-disc list-inside space-y-1 text-blue-800">
                                                <li>Enter full or partial patient name</li>
                                                <li>Use patient ID (e.g., DH-88291)</li>
                                                <li>Search by bill number (e.g., INV-2023-004521)</li>
                                                <li>Use order ID (e.g., ORD-55429)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Search Results ({searchResults.length}{' '}
                                    {searchResults.length === 1 ? 'bill' : 'bills'} found)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {searchResults.map((bill) => (
                                        <div
                                            key={bill.id}
                                            className="p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    {/* Patient Info */}
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {bill.patient.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {bill.patient.id} • {bill.patient.age}Y •{' '}
                                                                {bill.patient.gender}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {bill.patient.phone}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bill Details */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Bill ID</p>
                                                            <p className="font-semibold text-sm">
                                                                {bill.billId}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Order ID</p>
                                                            <p className="font-semibold text-sm">
                                                                {bill.orderId}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Bill Date</p>
                                                            <p className="font-semibold text-sm">
                                                                {new Date(bill.billDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Status</p>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    bill.paymentStatus === 'PENDING'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : bill.paymentStatus === 'PARTIAL'
                                                                            ? 'bg-orange-100 text-orange-800'
                                                                            : bill.paymentStatus === 'PAID'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-red-100 text-red-800'
                                                                }
                                                            >
                                                                {bill.paymentStatus}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Financial Summary */}
                                                    <div className="flex items-center gap-6 bg-gray-50 rounded-lg p-3">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Total Bill</p>
                                                            <p className="font-semibold">
                                                                {formatCurrency(bill.totalAmount)}
                                                            </p>
                                                        </div>
                                                        {bill.paidAmount > 0 && (
                                                            <div>
                                                                <p className="text-xs text-gray-500">Paid</p>
                                                                <p className="font-semibold text-green-600">
                                                                    {formatCurrency(bill.paidAmount)}
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-xs text-gray-500">Outstanding</p>
                                                            <p className="text-xl font-bold text-orange-600">
                                                                {formatCurrency(bill.outstandingAmount)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Select Button */}
                                                <Button
                                                    onClick={() => handleSelectBill(bill)}
                                                    className="bg-green-600 hover:bg-green-700 ml-4"
                                                    disabled={bill.outstandingAmount === 0}
                                                >
                                                    {bill.outstandingAmount === 0 ? (
                                                        <>
                                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                                            Paid
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CreditCard className="w-4 h-4 mr-2" />
                                                            Process Payment
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* No Results Message */}
                    {searchQuery && searchResults.length === 0 && (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No bills found
                                </h3>
                                <p className="text-gray-600">
                                    Try searching with a different patient name, ID, or bill number
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

    // ========== STEP 2: PAYMENT FORM SCREEN ==========
    if (currentStep === 'payment' && selectedBill) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setCurrentStep('search');
                                setSelectedBill(null);
                            }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Search
                        </Button>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold">Process Payment</h1>
                    </div>
                    <p className="text-gray-600 mb-8">
                        Recording payment for {selectedBill.patient.name}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Patient & Bill Info */}
                        <div className="lg:col-span-1 space-y-4">
                            {/* Patient Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Patient Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold">{selectedBill.patient.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Patient ID</p>
                                        <p className="font-semibold">{selectedBill.patient.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Age / Gender</p>
                                        <p className="font-semibold">
                                            {selectedBill.patient.age}Y / {selectedBill.patient.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold">{selectedBill.patient.phone}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bill Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Receipt className="w-5 h-5" />
                                        Bill Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Bill ID:</span>
                                        <span className="font-semibold">{selectedBill.billId}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-semibold">{selectedBill.orderId}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Bill Date:</span>
                                        <span className="font-semibold">
                                            {formatDateTime(selectedBill.billDate)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span>{formatCurrency(selectedBill.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Service Charge:</span>
                                            <span>{formatCurrency(selectedBill.serviceCharge)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                            <span>Total:</span>
                                            <span>{formatCurrency(selectedBill.totalAmount)}</span>
                                        </div>
                                        {selectedBill.paidAmount > 0 && (
                                            <div className="flex justify-between text-green-600 mt-2">
                                                <span>Paid:</span>
                                                <span>{formatCurrency(selectedBill.paidAmount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold text-xl text-orange-600 mt-2">
                                            <span>Outstanding:</span>
                                            <span>{formatCurrency(selectedBill.outstandingAmount)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tests List */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Tests Ordered</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {selectedBill.tests.map((test, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-start text-sm pb-2 border-b last:border-0"
                                            >
                                                <div>
                                                    <p className="font-medium">{test.name}</p>
                                                    <p className="text-xs text-gray-500">{test.code}</p>
                                                </div>
                                                <span className="font-semibold">
                                                    {formatCurrency(test.price)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Payment Form */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Wallet className="w-6 h-6" />
                                        Payment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Payment Amount */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Amount (LKR){' '}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, amount: e.target.value })
                                                }
                                                className="text-2xl font-bold h-14"
                                                placeholder="0.00"
                                                required
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Maximum: {formatCurrency(selectedBill.outstandingAmount)}
                                            </p>
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Method <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={formData.method}
                                                onValueChange={(value) =>
                                                    setFormData({ ...formData, method: value })
                                                }
                                            >
                                                <SelectTrigger className="h-12">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PAYMENT_METHODS.map((method) => (
                                                        <SelectItem key={method.value} value={method.value}>
                                                            {method.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Conditional Fields */}
                                        {(formData.method === 'CREDIT_CARD' ||
                                            formData.method === 'DEBIT_CARD') && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Card Last 4 Digits{' '}
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    type="text"
                                                    maxLength={4}
                                                    value={formData.cardLastFour}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            cardLastFour: e.target.value,
                                                        })
                                                    }
                                                    placeholder="1234"
                                                    required
                                                />
                                            </div>
                                        )}

                                        {formData.method === 'BANK_TRANSFER' && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Bank Name <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={formData.bankName}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                bankName: e.target.value,
                                                            })
                                                        }
                                                        placeholder="e.g., Commercial Bank"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Reference Number{' '}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={formData.referenceNumber}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                referenceNumber: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Bank transaction reference"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {formData.method !== 'CASH' &&
                                            formData.method !== 'BANK_TRANSFER' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Transaction/Reference Number
                                                        {formData.method !== 'CASH' && (
                                                            <span className="text-red-500"> *</span>
                                                        )}
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={formData.referenceNumber}
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                referenceNumber: e.target.value,
                                                            })
                                                        }
                                                        placeholder="Transaction ID or reference number"
                                                        required={formData.method !== 'CASH'}
                                                    />
                                                </div>
                                            )}

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notes (Optional)
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={formData.notes}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, notes: e.target.value })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Add any additional notes..."
                                            />
                                        </div>

                                        {/* Received By */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Received By
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.receivedBy}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex gap-3 pt-4 border-t">
                                            <Button
                                                type="submit"
                                                className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    'Processing...'
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                                        Process Payment
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-12 text-lg"
                                                onClick={() => {
                                                    setCurrentStep('search');
                                                    setSelectedBill(null);
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ========== STEP 3: SUCCESS SCREEN WITH PRINTABLE RECEIPT ==========
    if (currentStep === 'success' && selectedBill) {
        const currentDate = new Date().toLocaleDateString('en-GB');
        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        return (
            <div className="min-h-screen bg-gray-50 print:bg-white">
                {/* Print Styles */}
                <style jsx global>{`
                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            margin: 1.5cm;
                        }
                        nav,
                        header,
                        aside,
                        footer,
                        button,
                        a,
                        .print-hidden {
                            display: none !important;
                        }
                    }
                `}</style>

                {/* Action Buttons (Hidden on Print) */}
                <div className="print-hidden max-w-4xl mx-auto p-6 flex justify-between items-center">
                    <Link href="/dashboard">
                        <Button variant="ghost">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex gap-3">
                        <Button onClick={handlePrintReceipt} className="bg-blue-600 hover:bg-blue-700">
                            <Printer className="w-4 h-4 mr-2" />
                            Print Receipt
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/dashboard/bills/${selectedBill.id}`)}
                        >
                            <Receipt className="w-4 h-4 mr-2" />
                            View Bill Details
                        </Button>
                    </div>
                </div>

                {/* Receipt */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none print:mt-0 mt-6">
                    {/* Header */}
                    <div className="bg-slate-900 p-10 text-white text-center">
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            Durdans Hospital ERP
                        </p>
                        <h1 className="text-2xl font-bold">Payment Receipt</h1>
                    </div>

                    <div className="p-10">
                        {/* Patient Name */}
                        <div className="mb-10 pb-6 border-b border-slate-100">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Patient Name
                            </label>
                            <h2 className="text-3xl font-black text-slate-900 mt-1 uppercase">
                                {selectedBill.patient.name}
                            </h2>
                        </div>

                        {/* Receipt Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Bill ID
                                </p>
                                <p className="font-mono font-bold text-slate-700">{selectedBill.billId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Receipt ID
                                </p>
                                <p className="font-mono font-bold text-slate-700">{receiptId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Transaction ID
                                </p>
                                <p className="font-mono font-bold text-slate-700">{transactionId}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                                    Received By
                                </p>
                                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <UserCheck size={14} /> {formData.receivedBy}
                                </p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mt-10 mb-10">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <Receipt size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    Payment Details
                                </span>
                            </div>
                            <div className="border border-slate-100 rounded-xl overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="text-sm">
                                    <tr className="border-b border-slate-100">
                                        <td className="px-6 py-4 text-slate-700 font-medium">
                                            Payment Method
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 font-bold">
                                            {
                                                PAYMENT_METHODS.find((m) => m.value === formData.method)
                                                    ?.label
                                            }
                                        </td>
                                    </tr>
                                    {formData.referenceNumber && (
                                        <tr className="border-b border-slate-100">
                                            <td className="px-6 py-4 text-slate-700 font-medium">
                                                Reference Number
                                            </td>
                                            <td className="px-6 py-4 text-slate-900 font-bold font-mono">
                                                {formData.referenceNumber}
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="border-b border-slate-100 bg-green-50">
                                        <td className="px-6 py-4 text-slate-700 font-medium">
                                            Amount Paid
                                        </td>
                                        <td className="px-6 py-4 text-green-600 font-black text-xl">
                                            LKR {parseFloat(formData.amount).toLocaleString()}.00
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Itemized Tests */}
                        <div className="mt-10">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <Receipt size={16} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                    Itemized Charges
                                </span>
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
                                    {selectedBill.tests?.map((test, index) => (
                                        <tr key={index} className="border-t border-slate-100">
                                            <td className="px-6 py-4 text-slate-700 font-medium">
                                                {test.name}
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-900 font-bold">
                                                {test.price.toLocaleString()}.00
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="mt-12 space-y-4 max-w-xs ml-auto bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-white">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Total Bill</span>
                                <span className="font-bold text-slate-800">
                                    LKR {selectedBill.totalAmount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-bold text-green-600">
                                    LKR {parseFloat(formData.amount).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-200">
                                <span className="text-[10px] font-black uppercase">Balance Due</span>
                                <span className="text-lg font-black text-blue-600">
                                    LKR{' '}
                                    {(
                                        selectedBill.outstandingAmount - parseFloat(formData.amount)
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-20 flex justify-between items-center border-t border-slate-100 pt-6">
                            <p className="text-[10px] text-slate-400 italic">
                                Electronically verified document
                            </p>
                            <p className="text-[10px] text-slate-300 font-mono">
                                {currentDate} {currentTime}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Actions (Hidden on Print) */}
                <div className="print-hidden max-w-4xl mx-auto p-6 text-center">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setCurrentStep('search');
                            setSelectedBill(null);
                            setSearchQuery('');
                            setSearchResults([]);
                            setFormData({
                                amount: '',
                                method: 'CASH',
                                referenceNumber: '',
                                cardLastFour: '',
                                bankName: '',
                                notes: '',
                                receivedBy: 'Dr. Adrian S.',
                            });
                        }}
                    >
                        Process Another Payment
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}