import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Vehicle, Payment, GoldRecord, DashboardStats } from '@/types';

interface DataContextType {
  vehicles: Vehicle[];
  payments: Payment[];
  goldRecords: GoldRecord[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  addGoldRecord: (record: Omit<GoldRecord, 'id' | 'createdAt' | 'totalValue'>) => void;
  updateGoldRecord: (id: string, record: Partial<GoldRecord>) => void;
  deleteGoldRecord: (id: string) => void;
  getStats: () => DashboardStats;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data
const sampleVehicles: Vehicle[] = [
  {
    id: '1',
    vehicleType: 'Auto',
    vehicleNumber: 'UP32 AB 1234',
    ownerName: 'Rajesh Kumar',
    mobileNumber: '9876543210',
    flexType: 'Full Wrap',
    flexStartDate: '2024-01-15',
    monthlyAmount: 1500,
    area: 'Hazratganj',
    remarks: 'Premium location',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    vehicleType: 'E-Rickshaw',
    vehicleNumber: 'UP32 CD 5678',
    ownerName: 'Amit Singh',
    mobileNumber: '9876543211',
    flexType: 'Back',
    flexStartDate: '2024-02-01',
    monthlyAmount: 800,
    area: 'Aminabad',
    remarks: '',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    vehicleType: '2W',
    vehicleNumber: 'UP32 EF 9012',
    ownerName: 'Priya Sharma',
    mobileNumber: '9876543212',
    flexType: 'Front',
    flexStartDate: '2024-02-15',
    monthlyAmount: 500,
    area: 'Gomti Nagar',
    remarks: 'Daily commuter route',
    createdAt: '2024-02-15'
  }
];

const samplePayments: Payment[] = [
  { id: '1', vehicleId: '1', month: '2024-01', amountPaid: 1500, paymentMode: 'UPI', paymentDate: '2024-01-20', status: 'Paid' },
  { id: '2', vehicleId: '1', month: '2024-02', amountPaid: 1500, paymentMode: 'Cash', paymentDate: '2024-02-18', status: 'Paid' },
  { id: '3', vehicleId: '2', month: '2024-02', amountPaid: 800, paymentMode: 'Bank', paymentDate: '2024-02-25', status: 'Paid' },
  { id: '4', vehicleId: '1', month: '2024-03', amountPaid: 0, paymentMode: 'Cash', paymentDate: '', status: 'Pending' },
  { id: '5', vehicleId: '2', month: '2024-03', amountPaid: 0, paymentMode: 'UPI', paymentDate: '', status: 'Pending' },
  { id: '6', vehicleId: '3', month: '2024-02', amountPaid: 500, paymentMode: 'UPI', paymentDate: '2024-02-28', status: 'Paid' },
];

const sampleGoldRecords: GoldRecord[] = [
  {
    id: '1',
    customerName: 'Sunita Devi',
    mobileNumber: '9876543220',
    goldType: '22K',
    weight: 10.5,
    ratePerGram: 5800,
    totalValue: 60900,
    purpose: 'Sell',
    date: '2024-02-20',
    remarks: 'Wedding jewelry',
    createdAt: '2024-02-20'
  },
  {
    id: '2',
    customerName: 'Ramesh Gupta',
    mobileNumber: '9876543221',
    goldType: '24K',
    weight: 5.0,
    ratePerGram: 6200,
    totalValue: 31000,
    purpose: 'Buy',
    date: '2024-02-22',
    remarks: 'Investment',
    createdAt: '2024-02-22'
  },
  {
    id: '3',
    customerName: 'Meera Patel',
    mobileNumber: '9876543222',
    goldType: '22K',
    weight: 2.5,
    ratePerGram: 5800,
    totalValue: 14500,
    purpose: 'Repair',
    date: '2024-02-25',
    remarks: 'Chain repair',
    createdAt: '2024-02-25'
  }
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(sampleVehicles);
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [goldRecords, setGoldRecords] = useState<GoldRecord[]>(sampleGoldRecords);

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVehicles(prev => [...prev, newVehicle]);
  }, []);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setPayments(prev => prev.filter(p => p.vehicleId !== id));
  }, []);

  const addPayment = useCallback((payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: generateId()
    };
    setPayments(prev => [...prev, newPayment]);
  }, []);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const addGoldRecord = useCallback((record: Omit<GoldRecord, 'id' | 'createdAt' | 'totalValue'>) => {
    const newRecord: GoldRecord = {
      ...record,
      id: generateId(),
      totalValue: record.weight * record.ratePerGram,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGoldRecords(prev => [...prev, newRecord]);
  }, []);

  const updateGoldRecord = useCallback((id: string, updates: Partial<GoldRecord>) => {
    setGoldRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates };
        if (updates.weight !== undefined || updates.ratePerGram !== undefined) {
          updated.totalValue = updated.weight * updated.ratePerGram;
        }
        return updated;
      }
      return r;
    }));
  }, []);

  const deleteGoldRecord = useCallback((id: string) => {
    setGoldRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const getStats = useCallback((): DashboardStats => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthPayments = payments.filter(p => p.month === currentMonth || p.month.startsWith('2024'));
    const paidThisMonth = monthPayments.filter(p => p.status === 'Paid');
    const pendingPayments = payments.filter(p => p.status === 'Pending');
    
    const goldStockValue = goldRecords
      .filter(r => r.purpose === 'Buy')
      .reduce((sum, r) => sum + r.totalValue, 0) -
      goldRecords
      .filter(r => r.purpose === 'Sell')
      .reduce((sum, r) => sum + r.totalValue, 0);

    return {
      totalVehicles: vehicles.length,
      paidVehicles: paidThisMonth.length,
      pendingPayments: pendingPayments.length,
      monthlyCollection: paidThisMonth.reduce((sum, p) => sum + p.amountPaid, 0),
      goldStockValue: Math.abs(goldStockValue),
      pendingAlerts: pendingPayments.length
    };
  }, [vehicles, payments, goldRecords]);

  return (
    <DataContext.Provider value={{
      vehicles,
      payments,
      goldRecords,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addPayment,
      updatePayment,
      addGoldRecord,
      updateGoldRecord,
      deleteGoldRecord,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
