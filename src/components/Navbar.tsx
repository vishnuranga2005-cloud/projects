import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useApp } from '../contexts/AppContext'
import { UserRole } from '../contexts/AppContext'

interface NavbarProps {
  onMenuClick: () => void
  userRole: UserRole
  onLogout: () => void
}

export default function Navbar({ onMenuClick, userRole, onLogout }: NavbarProps) {
  const { language, setLanguage } = useLanguage()
  const { emergencies, currentPatient } = useApp()
  const [showProfileModal, setShowProfileModal] = useState(false)

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <>
    <nav className={`shadow-2xl sticky top-0 z-40 border-b-4 ${
      userRole === 'patient' 
        ? 'bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 border-teal-400' 
        : 'bg-gradient-to-r from-cyan-700 via-teal-600 to-teal-700 border-cyan-500'
    }`}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 hover:scale-105"
            title="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center font-bold text-teal-700 shadow-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 7h-2v2h2v2h-3v-2h-2v-2h2V8h3v2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">MediFlow Hospital</h1>
              <p className="text-xs text-white text-opacity-80">
                {userRole === 'patient' ? 'Patient Portal' : 'Hospital Staff Portal'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Emergency Alert for Hospital Staff */}
          {userRole === 'hospital' && activeEmergencies.length > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500 rounded-lg animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <span className="text-xs font-semibold text-white">{activeEmergencies.length} Active</span>
            </div>
          )}

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 text-white">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Online</span>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white bg-opacity-20 rounded-lg p-1">
            {(['en', 'hi', 'gu', 'ta'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  language === lang
                    ? 'bg-white text-teal-700 shadow-lg'
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Alerts */}
          <button className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200 group">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {activeEmergencies.length > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-white border-opacity-30">
            <button
              onClick={() => userRole === 'patient' && currentPatient && setShowProfileModal(true)}
              className={`flex items-center gap-3 ${userRole === 'patient' && currentPatient ? 'cursor-pointer hover:opacity-80' : ''}`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold">
                {userRole === 'patient' && currentPatient ? (
                  currentPatient.name[0].toUpperCase()
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white">
                  {userRole === 'patient' ? (currentPatient?.name || 'Guest User') : 'Dr. Vineet Ranga'}
                </p>
                <p className="text-xs text-white text-opacity-70">
                  {userRole === 'patient' ? 'Click to view profile' : 'Receptionist'}
                </p>
              </div>
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Patient Profile Modal */}
    {showProfileModal && currentPatient && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white relative">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-teal-600 text-3xl font-bold mx-auto mb-4">
              {currentPatient.name[0].toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-center">{currentPatient.name}</h2>
            <p className="text-teal-100 text-center">Patient Profile</p>
          </div>
          
          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📱 Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-800">{currentPatient.phone}</span>
                </div>
                {currentPatient.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-800">{currentPatient.email}</span>
                  </div>
                )}
                {currentPatient.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address:</span>
                    <span className="font-medium text-gray-800 text-right max-w-[60%]">{currentPatient.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                👤 Personal Information
              </h3>
              <div className="space-y-2 text-sm">
                {currentPatient.dateOfBirth && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date of Birth:</span>
                      <span className="font-medium text-gray-800">
                        {new Date(currentPatient.dateOfBirth).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium text-gray-800">{calculateAge(currentPatient.dateOfBirth)} years</span>
                    </div>
                  </>
                )}
                {currentPatient.gender && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium text-gray-800 capitalize">{currentPatient.gender}</span>
                  </div>
                )}
                {currentPatient.bloodGroup && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Blood Group:</span>
                    <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">{currentPatient.bloodGroup}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            {(currentPatient.emergencyContact || currentPatient.emergencyPhone) && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  🚨 Emergency Contact
                </h3>
                <div className="space-y-2 text-sm">
                  {currentPatient.emergencyContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-800">{currentPatient.emergencyContact}</span>
                    </div>
                  )}
                  {currentPatient.emergencyPhone && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span className="font-medium text-gray-800">{currentPatient.emergencyPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="p-4 border-t">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
