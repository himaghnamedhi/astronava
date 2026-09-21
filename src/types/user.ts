export interface UserBirthDetails {
  dob: string; // YYYY-MM-DD
  tob: string; // HH:mm
  isTobUnknown: boolean;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number;
  gender: 'male' | 'female' | 'other';
}

export interface UserAddress {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface UserPaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking';
  isDefault: boolean;
  last4?: string;
  cardBrand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  upiId?: string;
}

export interface UserDownloadItem {
  id: string;
  title: string;
  type: 'kundli_patrika' | 'match_report' | 'gemstone_prescription' | 'horoscope_archive';
  fileUrl: string;
  fileSize: string;
  generatedAt: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  isAnonymous?: boolean;
  emailVerified?: boolean;
  preferredLanguage?: 'en' | 'hi' | 'sa';
  preferredTimezone?: string;
  notificationTime?: string;
  notificationsEnabled?: boolean;
  notificationChannels?: ('email' | 'push' | 'sms' | 'whatsapp')[];
  birthDetails?: UserBirthDetails;
  addresses?: UserAddress[];
  paymentMethods?: UserPaymentMethod[];
  downloads?: UserDownloadItem[];
  createdAt?: string;
}
