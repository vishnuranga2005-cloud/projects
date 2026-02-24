import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface SettingsProps {
  onLogout: () => void
}

export default function Settings({ onLogout }: SettingsProps) {
  const { currentPatient, setCurrentPatient } = useApp()
  const { language, setLanguage, t } = useLanguage()
  const { user } = useAuth()
  
  const [name, setName] = useState(currentPatient?.name || '')
  const [phone, setPhone] = useState(currentPatient?.phone || '')
  const [email, setEmail] = useState(currentPatient?.email || user?.email || '')
  const [dateOfBirth, setDateOfBirth] = useState(currentPatient?.dateOfBirth || '')
  const [gender, setGender] = useState(currentPatient?.gender || '')
  const [address, setAddress] = useState(currentPatient?.address || '')
  const [bloodGroup, setBloodGroup] = useState(currentPatient?.bloodGroup || '')
  const [emergencyContact, setEmergencyContact] = useState(currentPatient?.emergencyContact || '')
  const [emergencyPhone, setEmergencyPhone] = useState(currentPatient?.emergencyPhone || '')
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Sync form with currentPatient when it changes
  useEffect(() => {
    if (currentPatient) {
      setName(currentPatient.name || '')
      setPhone(currentPatient.phone || '')
      setEmail(currentPatient.email || user?.email || '')
      setDateOfBirth(currentPatient.dateOfBirth || '')
      setGender(currentPatient.gender || '')
      setAddress(currentPatient.address || '')
      setBloodGroup(currentPatient.bloodGroup || '')
      setEmergencyContact(currentPatient.emergencyContact || '')
      setEmergencyPhone(currentPatient.emergencyPhone || '')
    }
  }, [currentPatient, user])

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim()) {
      setSaveMessage('Name and phone are required')
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    // Update context
    setCurrentPatient({
      id: currentPatient?.id || user?.id || `patient-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      address: address.trim() || undefined,
      bloodGroup: bloodGroup || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
    })

    // Save to database if real user
    if (user?.id && !user.id.startsWith('demo-')) {
      try {
        const { error } = await supabase
          .from('patients')
          .upsert({
            user_id: user.id,
            email: email.trim() || user.email,
            full_name: name.trim(),
            phone: phone.trim(),
            date_of_birth: dateOfBirth || null,
            gender: gender || null,
            address: address.trim() || null,
            blood_group: bloodGroup || null,
            emergency_contact_name: emergencyContact.trim() || null,
            emergency_contact_phone: emergencyPhone.trim() || null,
          }, { onConflict: 'user_id' })

        if (error) {
          console.error('Save error:', error)
        }
      } catch (err) {
        console.error('DB error:', err)
      }
    }

    setIsSaving(false)
    setSaveMessage('Profile saved successfully!')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  ]

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t('settings.title') || 'Settings'}
        </h1>
        <p className="text-gray-600">
          {t('settings.subtitle') || 'Manage your profile and preferences'}
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {t('settings.profile') || 'Profile Information'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {name ? name[0].toUpperCase() : '?'}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Contact person name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
            </svg>
            {t('settings.language') || 'Language Preferences'}
          </h2>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            {t('settings.selectLanguage') || 'Select your preferred language for the interface'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'gu' | 'ta')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  language === lang.code
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p className="font-bold text-lg">{lang.nativeName}</p>
                <p className="text-sm text-gray-500">{lang.name}</p>
                {language === lang.code && (
                  <div className="mt-2">
                    <svg className="w-5 h-5 text-purple-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {t('settings.account') || 'Account'}
          </h2>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-800">{t('settings.signOut') || 'Sign Out'}</p>
              <p className="text-sm text-gray-500">
                {t('settings.signOutDescription') || 'Sign out of your account on this device'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
              {t('settings.signOutButton') || 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
