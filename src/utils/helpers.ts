import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
