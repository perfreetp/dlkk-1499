import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  FileCheck,
  CircleDot,
} from 'lucide-react';
import type { FlowRecordType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
}

export function formatDateTime(dateTimeString: string): string {
  const parts = dateTimeString.split(' ');
  if (parts.length === 2) {
    return `${formatDate(parts[0])} ${parts[1]}`;
  }
  return dateTimeString;
}

export function maskIdCard(idCard: string): string {
  if (idCard.length < 8) return idCard;
  return idCard.slice(0, 6) + '********' + idCard.slice(-4);
}

export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待办理',
    processing: '办理中',
    completed: '已完成',
    rejected: '需补正',
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-600',
    processing: 'bg-blue-100 text-blue-600',
    completed: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-600';
}

export const flowRecordIconMap: Record<FlowRecordType, typeof CheckCircle2> = {
  accepted: FileCheck,
  reviewing: CircleDot,
  rejected: AlertCircle,
  corrected: RotateCcw,
  processing: Clock,
  completed: CheckCircle2,
};

export const flowRecordColorMap: Record<FlowRecordType, { dot: string; line: string; text: string; bg: string }> = {
  accepted: { dot: 'bg-blue-500', line: 'bg-blue-200', text: 'text-blue-700', bg: 'bg-blue-50' },
  reviewing: { dot: 'bg-indigo-500', line: 'bg-indigo-200', text: 'text-indigo-700', bg: 'bg-indigo-50' },
  rejected: { dot: 'bg-red-500', line: 'bg-red-200', text: 'text-red-700', bg: 'bg-red-50' },
  corrected: { dot: 'bg-amber-500', line: 'bg-amber-200', text: 'text-amber-700', bg: 'bg-amber-50' },
  processing: { dot: 'bg-cyan-500', line: 'bg-cyan-200', text: 'text-cyan-700', bg: 'bg-cyan-50' },
  completed: { dot: 'bg-green-500', line: 'bg-green-200', text: 'text-green-700', bg: 'bg-green-50' },
};
