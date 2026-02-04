// Vehicle Types
export type VehicleType = 'Auto' | 'E-Rickshaw' | '2W' | '3W';
export type FlexType = 'Front' | 'Back' | 'Full Wrap';
export type PaymentMode = 'Cash' | 'UPI' | 'Bank';
export type PaymentStatus = 'Paid' | 'Pending';

export interface Vehicle {
  id: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  ownerName: string;
  mobileNumber: string;
  flexType: FlexType;
  flexStartDate: string;
  monthlyAmount: number;
  area: string;
  remarks: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  vehicleId: string;
  month: string;
  amountPaid: number;
  paymentMode: PaymentMode;
  paymentDate: string;
  status: PaymentStatus;
}

// Gold Types
export type GoldType = '22K' | '24K';
export type GoldPurpose = 'Sell' | 'Buy' | 'Repair';

export interface GoldRecord {
  id: string;
  customerName: string;
  mobileNumber: string;
  goldType: GoldType;
  weight: number;
  ratePerGram: number;
  totalValue: number;
  purpose: GoldPurpose;
  date: string;
  remarks: string;
  createdAt: string;
}

export interface GoldStock {
  totalWeight22K: number;
  totalWeight24K: number;
  totalValue: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalVehicles: number;
  paidVehicles: number;
  pendingPayments: number;
  monthlyCollection: number;
  goldStockValue: number;
  pendingAlerts: number;
}

// User/Auth
export interface User {
  email: string;
  name: string;
  role: 'admin';
}
