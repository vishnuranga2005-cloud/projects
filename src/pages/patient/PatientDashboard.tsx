import { useApp } from '../../contexts/AppContext'

export default function PatientDashboard() {
  const { emergencies, getActiveEmergencyDelay, getPatientAppointments, currentPatient } = useApp()

  const myAppointments = getPatientAppointments()
  const activeEmergencies = emergencies.filter((e) => e.status === 'active')
  const delay = getActiveEmergencyDelay()
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = myAppointments.filter(
    (apt) => apt.date === today && (apt.status === 'confirmed' || apt.status === 'delayed')
  )

  // Simulated waiting time based on queue and emergencies
  const baseWaitingTime = 15
  const currentWaitingTime = baseWaitingTime + delay

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome{currentPatient ? `, ${currentPatient.name}` : ' to MediFlow Hospital'}
            </h1>
            <p className="text-teal-100">
              Book appointments and track your healthcare journey
            </p>
          </div>
          {currentPatient && (
            <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold">
                {currentPatient.name[0].toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold">{currentPatient.phone}</p>
                {currentPatient.bloodGroup && (
                  <p className="text-teal-200">Blood: <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">{currentPatient.bloodGroup}</span></p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patient Quick Info Card */}
      {currentPatient && (currentPatient.dateOfBirth || currentPatient.gender || currentPatient.address) && (
        <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-purple-500">
          <div className="flex flex-wrap gap-6 text-sm">
            {currentPatient.dateOfBirth && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">🎂 DOB:</span>
                <span className="font-medium text-gray-800">
                  {new Date(currentPatient.dateOfBirth).toLocaleDateString('en-IN', { 
                    day: 'numeric', month: 'short', year: 'numeric' 
                  })}
                </span>
              </div>
            )}
            {currentPatient.gender && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">👤 Gender:</span>
                <span className="font-medium text-gray-800 capitalize">{currentPatient.gender}</span>
              </div>
            )}
            {currentPatient.address && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📍 Address:</span>
                <span className="font-medium text-gray-800">{currentPatient.address}</span>
              </div>
            )}
            {currentPatient.emergencyContact && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">🚨 Emergency:</span>
                <span className="font-medium text-gray-800">{currentPatient.emergencyContact} ({currentPatient.emergencyPhone})</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emergency Alert Banner */}
      {activeEmergencies.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 10c-1.67 0-3.14-.85-4-2.15.02-1.32 2.67-2.05 4-2.05s3.98.73 4 2.05c-.86 1.3-2.33 2.15-4 2.15z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-700 text-lg">
                Emergency Alert
              </h3>
              <p className="text-red-600 mb-2">
                Due to emergency cases, appointments may be delayed.
              </p>
              <div className="bg-red-100 rounded-lg p-3">
                <p className="text-sm text-red-700">
                  <span className="font-semibold">
                    Estimated Delay:
                  </span>{' '}
                  {delay} minutes
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {activeEmergencies[0].type} - {activeEmergencies[0].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Waiting Time */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Average Waiting Time
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {currentWaitingTime} <span className="text-lg font-normal text-gray-500">mins</span>
              </p>
              {delay > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  (+{delay} mins due to emergency)
                </p>
              )}
            </div>
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Doctors Available */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Doctors Available
              </p>
              <p className="text-3xl font-bold text-gray-800">8</p>
              <p className="text-xs text-green-500 mt-1">Ready for consultation</p>
            </div>
            <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 7h-2v2h2v2h-3v-2h-2v-2h2V8h3v2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Your Appointments Today */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Appointments Today
              </p>
              <p className="text-3xl font-bold text-gray-800">{todayAppointments.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {todayAppointments.length > 0 ? 'Scheduled' : 'No appointments'}
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Services Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
              <span className="text-sm font-medium">
                Book Appointment
              </span>
            </button>
            <button className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="text-sm font-medium">
                Find Doctor
              </span>
            </button>
            <button className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span className="text-sm font-medium">
                Check Wait Time
              </span>
            </button>
            <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zm-6-10h4v2h-4zm0 3h4v2h-4zm0 3h4v2h-4zm-8-6h6v6H6zm0 8h10v2H6z" />
              </svg>
              <span className="text-sm font-medium">
                View Records
              </span>
            </button>
          </div>
        </div>

        {/* Hospital Status */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Hospital Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${activeEmergencies.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Emergency Ward
                </span>
              </div>
              <span className={`text-sm font-medium ${activeEmergencies.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {activeEmergencies.length > 0 ? 'Busy' : 'Normal'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  OPD Services
                </span>
              </div>
              <span className="text-sm font-medium text-green-600">Open</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Pharmacy
                </span>
              </div>
              <span className="text-sm font-medium text-yellow-600">Moderate Queue</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Laboratory
                </span>
              </div>
              <span className="text-sm font-medium text-green-600">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
