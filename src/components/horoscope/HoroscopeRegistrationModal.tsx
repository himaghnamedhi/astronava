import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Info,
  ChevronDown,
} from 'lucide-react';
import { HoroscopeUserProfile } from '../../types/horoscope';
import { POPULAR_CITIES, CityPreset } from '../../data/vedicAstrologyCalculator';

interface HoroscopeRegistrationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSaveProfile: (profile: HoroscopeUserProfile) => void;
  initialProfile?: HoroscopeUserProfile | null;
  isInline?: boolean;
}

export const HoroscopeRegistrationModal: React.FC<HoroscopeRegistrationModalProps> = ({
  isOpen = true,
  onClose,
  onSaveProfile,
  initialProfile,
  isInline = false,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [dob, setDob] = useState(initialProfile?.dob || '');
  const [tob, setTob] = useState(initialProfile?.tob || '07:30');
  const [isTobUnknown, setIsTobUnknown] = useState(initialProfile?.isTobUnknown || false);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialProfile?.gender || 'male');

  // City Search & Selection
  const [citySearch, setCitySearch] = useState(initialProfile?.birthPlace || '');
  const [selectedCity, setSelectedCity] = useState<CityPreset>({
    name: initialProfile?.birthPlace || '',
    stateOrRegion: '',
    country: 'India',
    lat: initialProfile?.latitude || 0,
    lng: initialProfile?.longitude || 0,
    timezone: initialProfile?.timezoneOffset || 5.5,
  });
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [consentGiven, setConsentGiven] = useState(initialProfile?.consentGiven ?? true);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep fields synchronized if initialProfile updates
  React.useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || '');
      setEmail(initialProfile.email || '');
      setPhone(initialProfile.phone || '');
      setDob(initialProfile.dob || '');
      setTob(initialProfile.tob || '07:30');
      setIsTobUnknown(initialProfile.isTobUnknown || false);
      setGender(initialProfile.gender || 'male');
      setCitySearch(initialProfile.birthPlace || '');
      setSelectedCity({
        name: initialProfile.birthPlace || '',
        stateOrRegion: '',
        country: 'India',
        lat: initialProfile.latitude || 0,
        lng: initialProfile.longitude || 0,
        timezone: initialProfile.timezoneOffset || 5.5,
      });
      setConsentGiven(initialProfile.consentGiven ?? true);
    }
  }, [initialProfile]);

  if (!isInline && !isOpen) return null;

  const filteredCities = POPULAR_CITIES.filter((c) => {
    const q = citySearch.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.stateOrRegion && c.stateOrRegion.toLowerCase().includes(q)) ||
      c.country.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  const handleSelectCity = (c: CityPreset) => {
    setSelectedCity(c);
    setCitySearch(`${c.name}${c.stateOrRegion ? `, ${c.stateOrRegion}` : ''}, ${c.country}`);
    setCityDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!dob) {
      setErrorMessage('Please select your Date of Birth.');
      return;
    }
    if (!isTobUnknown && !tob) {
      setErrorMessage('Please select your Time of Birth or check "Exact Time Unknown".');
      return;
    }
    if (!consentGiven) {
      setErrorMessage('Please provide consent to calculate your daily horoscope.');
      return;
    }

    // Fallback/Resolve city
    let cityToUse = selectedCity;
    if (!cityToUse.name || cityToUse.name.trim() === '' || cityToUse.lat === 0) {
      const q = citySearch.trim().toLowerCase();
      const match = POPULAR_CITIES.find(
        (c) =>
          c.name.toLowerCase() === q ||
          q.includes(c.name.toLowerCase()) ||
          c.name.toLowerCase().includes(q)
      );
      if (match) {
        cityToUse = match;
      } else if (citySearch.trim()) {
        cityToUse = {
          name: citySearch.trim(),
          stateOrRegion: '',
          country: 'India',
          lat: 28.6139,
          lng: 77.2090,
          timezone: 5.5,
        };
      } else {
        setErrorMessage('Please select your birth city from the list or enter a valid city.');
        return;
      }
    }

    const profile: HoroscopeUserProfile = {
      uid: initialProfile?.uid || `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      dob,
      tob: isTobUnknown ? '12:00' : tob,
      isTobUnknown,
      birthPlace: cityToUse.name,
      latitude: cityToUse.lat,
      longitude: cityToUse.lng,
      timezoneOffset: cityToUse.timezone,
      gender,
      notificationChannels: initialProfile?.notificationChannels || ['email'],
      preferredNotificationTime: initialProfile?.preferredNotificationTime || '07:00',
      consentGiven: true,
      registeredAt: initialProfile?.registeredAt || new Date().toISOString(),
    };

    onSaveProfile(profile);
    if (onClose) {
      onClose();
    }
  };

  const formContent = (
    <div className={`relative w-full ${isInline ? 'max-w-4xl mx-auto' : 'max-w-2xl'} bg-white rounded-3xl ${isInline ? 'shadow-sm border border-stone-200/90' : 'shadow-2xl border border-stone-200 my-8'} overflow-hidden`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-stone-900 text-white p-6 sm:p-8 relative">
        {onClose && (
          <button
            id="btn-close-horoscope-reg"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-vedic text-white tracking-wide">
              Set Up Your Daily Horoscope Profile
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/85 mt-1 max-w-2xl leading-relaxed">
              Unique predictions calculated daily using verified Vedic planetary transits (Gochar), Vimshottari Dasha, and Sarvashtakavarga scores.
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Identity Info - Responsive 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="horoscope-input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="horoscope-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="radhika@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-none transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Gender & Phone - Responsive 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Gender (For Ayurvedic Dosage & Pronouns)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    gender === g
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mobile Number (Optional)
            </label>
            <input
              id="horoscope-input-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Birth Date & Time - Responsive 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-stone-100">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="horoscope-input-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-none transition-all cursor-pointer"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Time of Birth
              </label>
              <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isTobUnknown}
                  onChange={(e) => setIsTobUnknown(e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-700 rounded cursor-pointer"
                />
                <span>Exact Time Unknown</span>
              </label>
            </div>

            <div className="relative">
              <Clock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                id="horoscope-input-tob"
                type="time"
                disabled={isTobUnknown}
                value={isTobUnknown ? '12:00' : tob}
                onChange={(e) => setTob(e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isTobUnknown
                    ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-stone-900 cursor-pointer'
                }`}
              />
            </div>
            {isTobUnknown && (
              <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600 shrink-0" />
                <span>Uses 12:00 PM Noon Solar Lagna. Moon sign & transits remain exact.</span>
              </p>
            )}
          </div>
        </div>

        {/* Place of Birth - Responsive Width */}
        <div className="relative pt-3 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Place of Birth <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              id="horoscope-input-city"
              type="text"
              value={citySearch}
              onFocus={() => setCityDropdownOpen(true)}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setCityDropdownOpen(true);
              }}
              placeholder="Search city, state, or country..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-sm outline-none transition-all"
              required
            />
            <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {cityDropdownOpen && filteredCities.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-stone-200 shadow-xl max-h-56 overflow-y-auto z-50 p-1.5">
              {filteredCities.map((c, i) => (
                <div
                  key={`${c.name}-${i}`}
                  onClick={() => handleSelectCity(c)}
                  className="px-3 py-2 text-xs rounded-xl hover:bg-amber-50 hover:text-amber-950 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-stone-800">{c.name}</span>
                    {c.stateOrRegion && <span className="text-stone-500">, {c.stateOrRegion}</span>}
                    <span className="text-stone-400"> ({c.country})</span>
                  </div>
                  <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {c.lat.toFixed(2)}°N, {c.lng.toFixed(2)}°E
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Consent */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
          <input
            id="horoscope-consent-check"
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-amber-800 rounded cursor-pointer shrink-0"
            required
          />
          <label htmlFor="horoscope-consent-check" className="text-xs text-amber-950 leading-relaxed cursor-pointer select-none">
            <span className="font-semibold">Privacy Consent:</span> I consent to Astronava calculating my personalized daily horoscope using my birth coordinates. My astrological birth data will only be used to compute Vedic planetary charts and will never be shared or sold.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            id="btn-save-horoscope-profile"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Calculate Daily Horoscope</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (isInline) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      {formContent}
    </div>
  );
};
