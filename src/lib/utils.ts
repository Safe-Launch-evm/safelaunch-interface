import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: 'accurate' | 'normal' = 'normal'
) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`;
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function formatAddress(address: string) {
  if (!address) return '';
  const prefix = address.substring(0, 4); // Take first 6 characters
  const suffix = address.substring(address.length - 4); // Take last 4 characters
  return `${prefix}...${suffix}`; // Combine with ellipsis in the middle
}
export function _formatAddress(address: string, gap: number) {
  if (!address) return '';
  const prefix = address.substring(0, gap); // Take first 6 characters
  const suffix = address.substring(address.length - gap); // Take last 4 characters
  return `${prefix}...${suffix}`; // Combine with ellipsis in the middle
}

export function formatDateToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
// export function toIntNumberFormat(value: number) {
//   let roundedNumber = Math.round(((value ?? 0) + Number.EPSILON) * 100) / 100;
//   let formattedNumber = roundedNumber.toFixed(2);
//   return new Intl.NumberFormat('en-US', { minimumFractionDigits: 5 }).format(
//     Number(formattedNumber)
//   );
// }
export function toIntNumberFormat(value: number, decimalPlaces: number = 5): string {
  // Handle the case where the value is 0
  if (value === 0) {
    return "0".padEnd(decimalPlaces + 2, "0");
  }

  // Calculate the factor for rounding
  const factor = Math.pow(10, decimalPlaces);

  // Round up to the specified number of decimal places
  const roundedNumber = Math.ceil(((value ?? 0) + Number.EPSILON) * factor) / factor;

  // Convert to string and split into integer and decimal parts
  const [integerPart, decimalPart = ""] = roundedNumber.toString().split(".");

  // Format the integer part with thousands separators
  const formattedIntegerPart = new Intl.NumberFormat('en-US').format(Number(integerPart));

  // Pad the decimal part to the specified number of places
  const formattedDecimalPart = decimalPart.padEnd(decimalPlaces, "0");

  // Combine the parts
  return `${formattedIntegerPart}.${formattedDecimalPart}`;
}

export function timeAgo(timestamp: any) {
  const now = Math.floor(Date.now() / 1000); // Get current time in seconds
  const diff = now - timestamp; // Time difference in seconds

  if (diff < 60) {
    return `${diff} second${diff === 1 ? '' : 's'} ago`;
  } else if (diff < 3600) {
    const min = Math.floor(diff / 60);
    return `${min} minute${min === 1 ? '' : 's'} ago`;
  } else if (diff < 86400) {
    const hrs = Math.floor(diff / 3600);
    return `${hrs} hour${hrs === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
}
