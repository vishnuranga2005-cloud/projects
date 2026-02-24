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

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')

  return (
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
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-bold">
              {userRole === 'patient' && currentPatient ? (
                currentPatient.name[0]
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-white">
                {userRole === 'patient' ? (currentPatient?.name || 'Guest User') : 'Dr. Vineet Ranga'}
              </p>
              <p className="text-xs text-white text-opacity-70">
                {userRole === 'patient' ? 'Patient' : 'Receptionist'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              title="Switch Portal"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
