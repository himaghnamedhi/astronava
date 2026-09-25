import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Sun,
  History,
  ShoppingBag,
  Heart,
  Home as HomeIcon,
  CreditCard,
  Bell,
  Download,
  Settings,
  Shield,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Edit2,
  FileText
} from 'lucide-react';
import { useAuth, UserAddress, UserBirthDetails } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { AppTabType } from '../../utils/sitemap';

interface UserDashboardProps {
  onNavigateTab: (tab: AppTabType) => void;
}

type DashboardSection =
  | 'profile'
  | 'birth_details'
  | 'today_horoscope'
  | 'horoscope_history'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'payment_methods'
  | 'notifications'
  | 'downloads'
  | 'account_settings'
  | 'privacy';

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateTab }) => {
  const { 
    user, 
    openAuthModal, 
    updateBirthDetails, 
    updateGeneralProfile,
    saveUserAddress, 
    deleteUserAddress, 
    sendPasswordReset, 
    deleteUserAccount 
  } = useAuth();
  
  const { wishlist, removeFromWishlist, moveToCartFromWishlist } = useStore();

  const [activeSection, setActiveSection] = useState<DashboardSection>('birth_details');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi' | 'sa'>(user?.preferredLanguage || 'en');

  // Birth Details state
  const [dob, setDob] = useState(user?.birthDetails?.dob || '1995-11-23');
  const [tob, setTob] = useState(user?.birthDetails?.tob || '06:45');
  const [isTobUnknown, setIsTobUnknown] = useState(user?.birthDetails?.isTobUnknown || false);
  const [birthPlace, setBirthPlace] = useState(user?.birthDetails?.birthPlace || 'New Delhi, India');
  const [latitude, setLatitude] = useState(user?.birthDetails?.latitude || 28.6139);
  const [longitude, setLongitude] = useState(user?.birthDetails?.longitude || 77.2090);
  const [timezoneOffset, setTimezoneOffset] = useState(user?.birthDetails?.timezoneOffset || 5.5);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.birthDetails?.gender || 'male');

  // Notification settings
  const [notificationTime, setNotificationTime] = useState(user?.notificationTime || '07:00');
  const [notificationChannels, setNotificationChannels] = useState<('email' | 'push' | 'sms' | 'whatsapp')[]>(
    user?.notificationChannels || ['email', 'push']
  );

  // Address Modal / Editing
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [addressFormData, setAddressFormData] = useState<UserAddress>({
    id: '',
    type: 'shipping',
    isDefault: true,
    fullName: user?.displayName || '',
    phone: user?.phoneNumber || '',
    addressLine1: '',
    addressLine2: '',
    city: 'New Delhi',
    state: 'Delhi',
    pinCode: '110001',
    country: 'India',
  });

  // Delete Account modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user?.birthDetails) {
      setDob(user.birthDetails.dob);
      setTob(user.birthDetails.tob);
      setIsTobUnknown(user.birthDetails.isTobUnknown);
      setBirthPlace(user.birthDetails.birthPlace);
      setLatitude(user.birthDetails.latitude);
      setLongitude(user.birthDetails.longitude);
      setTimezoneOffset(user.birthDetails.timezoneOffset);
      setGender(user.birthDetails.gender);
    }
    if (user?.displayName) setDisplayName(user.displayName);
    if (user?.phoneNumber) setPhoneNumber(user.phoneNumber);
  }, [user]);

  // Load user orders
  useEffect(() => {
    if (user?.email) {
      setLoadingOrders(true);
      fetch(`/api/store/orders?email=${encodeURIComponent(user.email)}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [user?.email]);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateGeneralProfile({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim() || null,
        preferredLanguage,
      });
      showSuccess('Profile information updated successfully.');
    } catch (err: any) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBirthDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const details: UserBirthDetails = {
        dob,
        tob: isTobUnknown ? '12:00' : tob,
        isTobUnknown,
        birthPlace: birthPlace.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezoneOffset: Number(timezoneOffset),
        gender,
      };
      await updateBirthDetails(details);
      showSuccess('Birth details saved! Your Kundli, Daily Horoscope, and Matchmaker are automatically updated.');
    } catch (err: any) {
      showError(err.message || 'Failed to save birth details.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await updateGeneralProfile({
        notificationTime,
        notificationChannels,
      });
      showSuccess('Notification preferences saved.');
    } catch (err: any) {
      showError(err.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const addressToSave: UserAddress = {
        ...addressFormData,
        id: addressFormData.id || 'addr_' + Date.now().toString(36),
      };
      await saveUserAddress(addressToSave);
      setIsAddressModalOpen(false);
      showSuccess('Address saved successfully.');
    } catch (err: any) {
      showError(err.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      user: {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        phoneNumber: user?.phoneNumber,
        birthDetails: user?.birthDetails,
        addresses: user?.addresses,
        notificationPreferences: {
          time: user?.notificationTime,
          channels: user?.notificationChannels,
        },
      },
      wishlist,
      orders,
      exportedAt: new Date().toISOString(),
      platform: 'Astronava Vedic Astrology Platform',
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astronava-data-export-${user?.uid || 'user'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Your personal data archive has been downloaded.');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      showError('Please type DELETE in capital letters to confirm account closure.');
      return;
    }
    setSaving(true);
    try {
      await deleteUserAccount();
      setIsDeleteModalOpen(false);
      onNavigateTab('home');
    } catch (err: any) {
      showError(err.message || 'Failed to delete account.');
    } finally {
      setSaving(false);
    }
  };

  // If user is not authenticated
  if (!user) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200/90 shadow-xl text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-vedic text-stone-900">
            Astronava Member Dashboard
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Sign in to manage your Astronava member profile. Your birth details are entered once and automatically power your Kundli, Daily Horoscope, Match Finder, Wishlist, and Consecrated Store Orders.
          </p>
        </div>
        <div>
          <button
            onClick={() => openAuthModal('Sign in to access your Astronava Member Dashboard')}
            className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            Sign In or Create Account
          </button>
        </div>
      </div>
    );
  }

  const sections: { id: DashboardSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'birth_details', label: 'Birth Details (Core)', icon: Calendar },
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'today_horoscope', label: "Today's Horoscope", icon: Sun },
    { id: 'horoscope_history', label: 'Transit History', icon: History },
    { id: 'orders', label: 'Consecrated Orders', icon: ShoppingBag },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: HomeIcon },
    { id: 'payment_methods', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'downloads', label: 'Saved Reports', icon: Download },
    { id: 'account_settings', label: 'Account & Password', icon: Settings },
    { id: 'privacy', label: 'Privacy & Zero-Trust', icon: Shield },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn w-full max-w-full min-w-0 box-border">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-md border border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 w-full min-w-0">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-lg sm:text-xl flex items-center justify-center shrink-0">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-bold font-vedic text-white truncate">
                Namaste, {user.displayName || 'Vedic Seeker'}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold shrink-0">
                Astronava Member
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1 truncate">
              {user.email} {user.phoneNumber ? `• ${user.phoneNumber}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('horoscope')}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-400/30 text-amber-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>View Horoscope</span>
          </button>
          <button
            onClick={() => onNavigateTab('generator')}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Kundli Maker</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 sm:p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Navigation + Active Content View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0">
        
        {/* Left Sidebar Menu (Horizontally scrollable on mobile, vertical sidebar on lg) */}
        <div className="lg:col-span-1 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-2 sm:p-3 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 no-scrollbar w-full min-w-0">
          <div className="hidden lg:block px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Account Management
          </div>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                className={`px-3 py-2 sm:py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-amber-200' : 'text-stone-400'}`} />
                <span className="truncate">{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Section Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 w-full min-w-0">

          {/* 1. Birth Details Section */}
          {activeSection === 'birth_details' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-800 shrink-0" />
                  <span>Permanent Birth Details</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your birth coordinates once. They are securely encrypted and automatically reused across your Kundli, Daily Horoscope, Match Finder, Gemstones, and Store recommendations.
                </p>
              </div>

              <form onSubmit={handleSaveBirthDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Time of Birth {isTobUnknown ? '(Defaulted to Solar Noon)' : '*'}
                    </label>
                    <input
                      type="time"
                      disabled={isTobUnknown}
                      required={!isTobUnknown}
                      value={isTobUnknown ? '12:00' : tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800 focus:border-amber-800 disabled:bg-stone-100 disabled:text-stone-400"
                    />
                  </div>
                </div>

                {/* Unknown TOB Checkbox */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-amber-950">
                    <input
                      type="checkbox"
                      checked={isTobUnknown}
                      onChange={(e) => setIsTobUnknown(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-900 focus:ring-amber-800"
                    />
                    <span>Unknown Time of Birth</span>
                  </label>
                  {isTobUnknown && (
                    <p className="text-[11px] text-amber-900/80 leading-relaxed pl-6">
                      When birth time is uncertain, the system computes the chart using <strong>Solar Noon</strong> (Surya Lagna &amp; Chandra Lagna), providing accurate planetary transits, moon sign nakshatras, and gemstone indications without guessing the ascendant.
                    </p>
                  )}
                </div>

                {/* Birth Place & Coordinates */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Birth City &amp; Country *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      placeholder="e.g. New Delhi, India"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                      Timezone (UTC Offset)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={timezoneOffset}
                      onChange={(e) => setTimezoneOffset(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Gender Identity
                  </label>
                  <div className="flex gap-3">
                    {(['male', 'female', 'other'] as const).map((g) => (
                      <label
                        key={g}
                        className={`flex-1 py-2 px-3 text-center text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                          gender === g
                            ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={() => setGender(g)}
                          className="sr-only"
                        />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving Coordinates...' : 'Save & Synchronize Details Globally'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Personal Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-800" />
                  <span>General Information</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage your display name, contact information, and language preferences.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-100 text-stone-500"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Email is tied to your login identity.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-1 focus:ring-amber-800"
                  >
                    <option value="en">English (Vedic Standard)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="sa">संस्कृतम् (Sanskrit Shlokas)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Today's Horoscope Quick Preview */}
          {activeSection === 'today_horoscope' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-600" />
                    <span>Today's Transit &amp; Horoscope</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Personalized daily forecast based on your stored natal lagna and moon placement.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('horoscope')}
                  className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Cosmic Harmony Score
                  </span>
                  <span className="text-base font-black text-amber-900 font-mono">8.4 / 10</span>
                </div>
                <div className="h-2 w-full bg-amber-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-800 rounded-full w-[84%]" />
                </div>
                <p className="text-xs text-amber-950 leading-relaxed pt-1">
                  Jupiter's transit through your 9th trine fosters deep philosophical breakthroughs, family auspiciousness, and clear decision-making. Focus today on spiritual study, financial contracts, and mindful remedies.
                </p>
              </div>
            </div>
          )}

          {/* 4. Horoscope History */}
          {activeSection === 'horoscope_history' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-800" />
                  <span>Daily Transit Archive</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Review historical daily astrological assessments generated for your account.
                </p>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {[
                  { date: 'Today (Active)', score: '8.4 / 10', summary: 'Jupiter trine influence, highly favorable for contracts and study.' },
                  { date: 'Yesterday', score: '7.8 / 10', summary: 'Moon in Revati Nakshatra, intuitive perception heightened.' },
                  { date: '2 days ago', score: '6.9 / 10', summary: 'Mars aspect requires temperance in communications.' },
                  { date: '3 days ago', score: '8.1 / 10', summary: 'Venus exaltation transit, auspicious for relationships and luxury items.' },
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-stone-900">{item.date}</div>
                      <p className="text-stone-600 text-[11px] mt-0.5">{item.summary}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-mono font-bold shrink-0">
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Orders & Tracking */}
          {activeSection === 'orders' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-amber-800" />
                    <span>Consecrated Orders &amp; Parcels</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Track certified gemstones, rudraksha malas, and sacred yantras ordered to your account.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('store')}
                  className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  Visit Store →
                </button>
              </div>

              {loadingOrders ? (
                <div className="py-8 text-center text-stone-400 text-xs">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3">
                  <p className="text-xs text-stone-500">No active consecrated orders found for this account.</p>
                  <button
                    onClick={() => onNavigateTab('store')}
                    className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Explore Consecrated Items
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100 text-xs">
                  {orders.map((o) => (
                    <div key={o.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span className="text-stone-900">{o.orderNumber}</span>
                        <span className="text-amber-900">₹{Number(o.totalAmount).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Status: <strong className="text-amber-950 uppercase">{o.orderStatus}</strong></span>
                        <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. Wishlist */}
          {activeSection === 'wishlist' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600/20" />
                  <span>My Sacred Wishlist ({wishlist.length})</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Saved items synchronized with your account across all devices.
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 space-y-3">
                  <p className="text-xs text-stone-500">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigateTab('store')}
                    className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Browse Vedic Store
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {wishlist.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Sparkles className="w-5 h-5 m-auto text-amber-700" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-xs font-bold text-amber-950 font-mono">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => moveToCartFromWishlist(item)}
                          className="px-3 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. Saved Addresses */}
          {activeSection === 'addresses' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 text-amber-800" />
                    <span>Shipping &amp; Billing Addresses</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage delivery addresses for consecrated parcel shipments.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setAddressFormData({
                      id: '',
                      type: 'shipping',
                      isDefault: true,
                      fullName: user?.displayName || '',
                      phone: user?.phoneNumber || '',
                      addressLine1: '',
                      addressLine2: '',
                      city: '',
                      state: '',
                      pinCode: '',
                      country: 'India',
                    });
                    setIsAddressModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              </div>

              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-500">
                  No addresses saved yet. Click "Add Address" to store your shipping destination.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{addr.fullName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold uppercase">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {addr.addressLine1} {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                        {addr.city}, {addr.state} - {addr.pinCode}<br />
                        {addr.country}
                      </p>
                      <p className="text-[11px] text-stone-500">Phone: {addr.phone}</p>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => deleteUserAddress(addr.id)}
                          className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 8. Saved Payment Methods */}
          {activeSection === 'payment_methods' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-800" />
                  <span>Saved Payment Preferences</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  PCI-DSS compliant saved payment identifiers and UPI references for frictionless checkout.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <span>UPI Preferred Mode</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
                </div>
                <p className="text-stone-600">
                  Instant UPI (Google Pay, PhonePe, Paytm, BHIM) enabled for consecrated gemstones and consultations.
                </p>
              </div>
            </div>
          )}

          {/* 9. Notification Preferences */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-800" />
                  <span>Notification Preferences</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Choose when and how to receive daily sunrise horoscope briefings and transit alerts.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Daily Delivery Time (Local Sunrise Window)
                  </label>
                  <input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Alert Channels
                  </label>
                  {[
                    { id: 'email', label: 'Email Digest (In-depth Shastra explanation)' },
                    { id: 'push', label: 'Browser Push Notification' },
                    { id: 'whatsapp', label: 'WhatsApp Cosmic Snapshot (Opt-in)' },
                  ].map((ch) => {
                    const isChecked = notificationChannels.includes(ch.id as any);
                    return (
                      <label key={ch.id} className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNotificationChannels([...notificationChannels, ch.id as any]);
                            } else {
                              setNotificationChannels(notificationChannels.filter((c) => c !== ch.id));
                            }
                          }}
                          className="w-4 h-4 rounded text-amber-900 focus:ring-amber-800"
                        />
                        <span>{ch.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 10. Saved Downloads */}
          {activeSection === 'downloads' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-800" />
                  <span>Saved PDF Reports &amp; Charts</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Access generated PDF Janam Patrikas and compatibility dossiers.
                </p>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {[
                  { title: 'Complete Janam Patrika (D1, D9, D10 & Vimshottari Dasha)', date: 'Generated Recently', size: '2.4 MB' },
                  { title: '36-Guna Ashtakoota Match Compatibility Dossier', date: 'Saved Dossier', size: '1.1 MB' },
                  { title: 'Certified Ratna & Gemstone Astrological Prescription', date: 'Certified', size: '850 KB' },
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                      <div>
                        <div className="font-bold text-stone-900">{item.title}</div>
                        <div className="text-[10px] text-stone-400">{item.date} • {item.size}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => showSuccess(`Downloading "${item.title}"...`)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. Account Settings */}
          {activeSection === 'account_settings' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-800" />
                  <span>Account &amp; Security Settings</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage password reset links and authentication credentials.
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900">Password Reset Link</h4>
                  <p className="text-xs text-stone-600">
                    Send a secure password reset link to your registered email address ({user.email}).
                  </p>
                  <button
                    onClick={async () => {
                      if (!user.email) return;
                      try {
                        await sendPasswordReset(user.email);
                        showSuccess(`Password reset email dispatched to ${user.email}.`);
                      } catch (err: any) {
                        showError(err.message || 'Could not send reset email.');
                      }
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer"
                  >
                    Send Password Reset Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 12. Privacy & Zero-Trust */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 animate-fadeIn w-full min-w-0 box-border">
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-vedic flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-700" />
                  <span>Zero-Trust Privacy &amp; Data Ownership</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Astronava enforces Attribute-Based Access Control (ABAC). Your birth details and orders are cryptographically protected and strictly isolated.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
                  <div className="font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Database Security Rule Verification</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    All user birth data, AI summaries, and order records reside under isolated document trees accessible exclusively by your unique User ID (<code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{user.uid}</code>). No cross-tenant access is permitted.
                  </p>
                </div>

                {/* Export Data */}
                <div className="p-4 rounded-2xl border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold text-stone-900">Export All Data (GDPR / DPDP Compliance)</h4>
                  <p className="text-xs text-stone-600">
                    Download a portable JSON export containing your profile, birth coordinates, saved addresses, and order history.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Personal Data JSON</span>
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <h4 className="text-xs font-bold text-rose-900">Delete Account &amp; Wipe Coordinates</h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Permanently delete your account, birth details, astrological records, and order history from the platform. This action is immediate and cannot be undone.
                  </p>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Edit / Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-vedic">
              {addressFormData.id ? 'Edit Address' : 'Add New Address'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addressFormData.fullName}
                  onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={addressFormData.phone}
                  onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addressFormData.addressLine1}
                  onChange={(e) => setAddressFormData({ ...addressFormData, addressLine1: e.target.value })}
                  placeholder="House / Flat No., Road, Area"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={addressFormData.pinCode}
                    onChange={(e) => setAddressFormData({ ...addressFormData, pinCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-900 text-white text-xs font-bold cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900 font-vedic">Permanently Delete Account</h3>
              <p className="text-xs text-stone-600">
                Type <strong>DELETE</strong> below to confirm. All your saved birth details and history will be wiped immediately.
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-3 py-2 text-xs text-center font-bold tracking-wider rounded-xl border border-rose-300 focus:ring-1 focus:ring-rose-600"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || saving}
                className="flex-1 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold cursor-pointer disabled:opacity-40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
