import { useApp } from '../contexts/AppContext'
import { UserRole } from '../contexts/AppContext'

interface SidebarProps {
  isOpen: boolean
  currentPage: string
  onNavigate: (page: string) => void
  userRole: UserRole
}

export default function Sidebar({ isOpen, currentPage, onNavigate, userRole }: SidebarProps) {
  const { appointments, emergencies } = useApp()

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length
  const todayAppointments = appointments.filter((a) => a.date === '2026-02-22').length

  // Patient Menu Items
  const patientMenuItems = [
    {
      id: 'patient-dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      id: 'book-appointment',
      label: 'Book Appointment',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-5h5v5h-5z" />
        </svg>
      ),
    },
    {
      id: 'patient-appointments',
      label: 'My Appointments',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
      ),
    },
    {
      id: 'find-doctors',
      label: 'Find Doctors',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      id: 'medical-history',
      label: 'Medical History',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 6h-2v2h2v2h-2v2H9v-2H7v-2h2v-2H7v-2h2v-2h2v2h2v2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      ),
    },
  ]

  // Hospital Staff Menu Items
  const hospitalMenuItems = [
    {
      id: 'hospital-dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z" />
        </svg>
      ),
    },
    {
      id: 'manage-appointments',
      label: 'Manage Appointments',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
        </svg>
      ),
      badge: pendingAppointments > 0 ? pendingAppointments : undefined,
    },
    {
      id: 'emergency-management',
      label: 'Emergency Cases',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      ),
      badge: activeEmergencies.length > 0 ? activeEmergencies.length : undefined,
      isEmergency: activeEmergencies.length > 0,
    },
    {
      id: 'patient-medications',
      label: 'Patient Medications',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 3h12v2H6V3zm6 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
  ]

  const menuItems = userRole === 'patient' ? patientMenuItems : hospitalMenuItems

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-gradient-to-b from-white to-slate-50 border-r-4 transition-all duration-300 z-30 shadow-xl ${
        userRole === 'patient' ? 'border-teal-200' : 'border-cyan-200'
      } ${isOpen ? 'w-64' : '-translate-x-full w-64'}`}
    >
      <div className="p-4 space-y-2 mt-4">
        {/* Role Badge */}
        <div className={`px-4 py-2 rounded-lg mb-4 ${
          userRole === 'patient' 
            ? 'bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700' 
            : 'bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700'
        }`}>
          <p className="text-xs font-bold uppercase tracking-wide">
            {userRole === 'patient' ? 'Patient Portal' : 'Staff Portal'}
          </p>
        </div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium border-l-4 relative ${
              currentPage === item.id
                ? userRole === 'patient'
                  ? 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-600 shadow-md'
                  : 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 border-cyan-600 shadow-md'
                : 'text-gray-700 hover:bg-teal-50 hover:border-teal-400 border-transparent'
            } ${(item as any).isEmergency ? 'animate-pulse' : ''}`}
          >
            <span className={(item as any).isEmergency ? 'text-red-500' : ''}>
              {item.icon}
            </span>
            <span className="text-sm flex-1">{item.label}</span>
            {(item as any).badge && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                (item as any).isEmergency 
                  ? 'bg-red-500 text-white' 
                  : 'bg-yellow-400 text-yellow-900'
              }`}>
                {(item as any).badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Status Card */}
      <div className="px-4 py-4 mt-4">
        {userRole === 'patient' ? (
          // Patient: Show waiting time
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 shadow-sm border-2 border-teal-200">
            <p className="text-xs text-teal-700 uppercase font-bold tracking-wide">Average Wait Time</p>
            <p className="text-3xl font-bold text-teal-700 mt-2">
              {15 + (activeEmergencies.length > 0 ? activeEmergencies[0].estimatedDelay : 0)} min
            </p>
            {activeEmergencies.length > 0 && (
              <p className="text-xs text-red-500 mt-1">
                +{activeEmergencies[0].estimatedDelay} min due to emergency
              </p>
            )}
          </div>
        ) : (
          // Hospital: Show appointments status
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 shadow-sm border-2 border-cyan-200">
            <p className="text-xs text-cyan-700 uppercase font-bold tracking-wide">Today's Overview</p>
            <p className="text-2xl font-bold text-cyan-700 mt-2">{todayAppointments}</p>
            <p className="text-xs text-cyan-600 mt-1">Appointments Today</p>
            <div className="flex gap-2 mt-3">
              <div className="flex-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg text-center">
                {pendingAppointments} Pending
              </div>
              <div className="flex-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg text-center">
                {appointments.filter((a) => a.status === 'confirmed').length} Confirmed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Alert for Patient Sidebar */}
      {userRole === 'patient' && activeEmergencies.length > 0 && (
        <div className="px-4">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <p className="text-xs text-red-600 font-medium">
                Emergency in progress - delays expected
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
