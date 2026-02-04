import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Vehicle, Payment, GoldRecord } from '@/types';

interface FlexCollectionData {
  vehicleNumber: string;
  ownerName: string;
  month: string;
  amount: number;
  paymentMode: string;
  paymentDate: string;
}

interface PendingPaymentData {
  vehicleNumber: string;
  ownerName: string;
  mobileNumber: string;
  area: string;
  month: string;
  amountDue: number;
}

interface GoldReportData {
  customerName: string;
  goldType: string;
  weight: number;
  ratePerGram: number;
  totalValue: number;
  purpose: string;
  date: string;
}

// PDF Export Functions
export function exportFlexCollectionPDF(
  payments: Payment[],
  vehicles: Vehicle[],
  totalCollection: number
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(26, 32, 44);
  doc.text('Bharat Flex & Gold Manager', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Monthly Flex Collection Report', 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);

  // Table data
  const tableData = payments.map(payment => {
    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
    return [
      vehicle?.vehicleNumber || '-',
      vehicle?.ownerName || '-',
      payment.month,
      `₹${payment.amountPaid.toLocaleString()}`,
      payment.paymentMode,
      payment.paymentDate
    ];
  });

  autoTable(doc, {
    startY: 48,
    head: [['Vehicle', 'Owner', 'Month', 'Amount', 'Mode', 'Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [26, 32, 44], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
    footStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFillColor(34, 197, 94);
  doc.rect(14, finalY + 10, 182, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Total Collection: ₹${totalCollection.toLocaleString()}`, 20, finalY + 18);

  doc.save('flex-collection-report.pdf');
}

export function exportPendingPaymentsPDF(
  payments: Payment[],
  vehicles: Vehicle[],
  totalPending: number
) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(26, 32, 44);
  doc.text('Bharat Flex & Gold Manager', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Pending Payment List', 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);

  const tableData = payments.map(payment => {
    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
    return [
      vehicle?.vehicleNumber || '-',
      vehicle?.ownerName || '-',
      vehicle?.mobileNumber || '-',
      vehicle?.area || '-',
      payment.month,
      `₹${(vehicle?.monthlyAmount || 0).toLocaleString()}`
    ];
  });

  autoTable(doc, {
    startY: 48,
    head: [['Vehicle', 'Owner', 'Mobile', 'Area', 'Month', 'Due']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [26, 32, 44], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;
  doc.setFillColor(239, 68, 68);
  doc.rect(14, finalY + 10, 182, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(`Total Pending: ₹${totalPending.toLocaleString()}`, 20, finalY + 18);

  doc.save('pending-payments-report.pdf');
}

export function exportGoldReportPDF(
  records: GoldRecord[],
  totalBuy: number,
  totalSell: number
) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(26, 32, 44);
  doc.text('Bharat Flex & Gold Manager', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('Gold Transaction Report', 14, 32);
  
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);

  const tableData = records.map(record => [
    record.customerName,
    record.goldType,
    `${record.weight}g`,
    `₹${record.ratePerGram.toLocaleString()}`,
    `₹${record.totalValue.toLocaleString()}`,
    record.purpose,
    record.date
  ]);

  autoTable(doc, {
    startY: 48,
    head: [['Customer', 'Type', 'Weight', 'Rate/g', 'Total', 'Purpose', 'Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [26, 32, 44], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 100;
  
  // Buy total
  doc.setFillColor(34, 197, 94);
  doc.rect(14, finalY + 10, 89, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`Total Bought: ₹${totalBuy.toLocaleString()}`, 20, finalY + 18);
  
  // Sell total
  doc.setFillColor(234, 179, 8);
  doc.rect(107, finalY + 10, 89, 12, 'F');
  doc.setTextColor(26, 32, 44);
  doc.text(`Total Sold: ₹${totalSell.toLocaleString()}`, 113, finalY + 18);

  doc.save('gold-transaction-report.pdf');
}

// Excel Export Functions
export function exportFlexCollectionExcel(
  payments: Payment[],
  vehicles: Vehicle[],
  totalCollection: number
) {
  const data: FlexCollectionData[] = payments.map(payment => {
    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
    return {
      vehicleNumber: vehicle?.vehicleNumber || '-',
      ownerName: vehicle?.ownerName || '-',
      month: payment.month,
      amount: payment.amountPaid,
      paymentMode: payment.paymentMode,
      paymentDate: payment.paymentDate
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add header row styling
  ws['!cols'] = [
    { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }
  ];

  // Add total row
  const totalRow = data.length + 2;
  ws[`A${totalRow}`] = { v: 'Total Collection:', t: 's' };
  ws[`D${totalRow}`] = { v: totalCollection, t: 'n' };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Flex Collection');
  XLSX.writeFile(wb, 'flex-collection-report.xlsx');
}

export function exportPendingPaymentsExcel(
  payments: Payment[],
  vehicles: Vehicle[],
  totalPending: number
) {
  const data: PendingPaymentData[] = payments.map(payment => {
    const vehicle = vehicles.find(v => v.id === payment.vehicleId);
    return {
      vehicleNumber: vehicle?.vehicleNumber || '-',
      ownerName: vehicle?.ownerName || '-',
      mobileNumber: vehicle?.mobileNumber || '-',
      area: vehicle?.area || '-',
      month: payment.month,
      amountDue: vehicle?.monthlyAmount || 0
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }
  ];

  const totalRow = data.length + 2;
  ws[`A${totalRow}`] = { v: 'Total Pending:', t: 's' };
  ws[`F${totalRow}`] = { v: totalPending, t: 'n' };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pending Payments');
  XLSX.writeFile(wb, 'pending-payments-report.xlsx');
}

export function exportGoldReportExcel(
  records: GoldRecord[],
  totalBuy: number,
  totalSell: number
) {
  const data: GoldReportData[] = records.map(record => ({
    customerName: record.customerName,
    goldType: record.goldType,
    weight: record.weight,
    ratePerGram: record.ratePerGram,
    totalValue: record.totalValue,
    purpose: record.purpose,
    date: record.date
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [
    { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }
  ];

  const totalRow = data.length + 2;
  ws[`A${totalRow}`] = { v: 'Total Bought:', t: 's' };
  ws[`E${totalRow}`] = { v: totalBuy, t: 'n' };
  ws[`A${totalRow + 1}`] = { v: 'Total Sold:', t: 's' };
  ws[`E${totalRow + 1}`] = { v: totalSell, t: 'n' };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Gold Transactions');
  XLSX.writeFile(wb, 'gold-transaction-report.xlsx');
}
