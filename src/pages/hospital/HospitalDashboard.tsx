import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function HospitalDashboard() {
  const { appointments, emergencies, getActiveEmergencyDelay } = useApp()
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')
  const delay = getActiveEmergencyDelay()

  const todayDateString = currentTime.toISOString().split('T')[0]
  const todayAppointments = appointments.filter((apt) => apt.date === todayDateString)
  const pendingCount = appointments.filter((apt) => apt.status === 'pending').length
  const confirmedCount = appointments.filter((apt) => apt.status === 'confirmed').length
  const inProgressCount = appointments.filter((apt) => apt.status === 'in-progress').length
  const delayedCount = appointments.filter((apt) => apt.status === 'delayed').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('hospitalDashboard.title') || 'Hospital Dashboard'}
          </h1>
          <p className="text-gray-600">
            {t('hospitalDashboard.subtitle') || 'Manage appointments and emergencies'}
          </p>
        </div>
        <div className="flex flex-col items-end text-sm">
          <span className="font-semibold text-gray-800">{formatDate(currentTime)}</span>
          <span className="text-lg font-bold text-teal-600">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Emergency Alert */}
      {activeEmergencies.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-red-700 text-lg">Active Emergency</h3>
                <p className="text-red-600">{activeEmergencies[0].type} - {activeEmergencies[0].description}</p>
                <p className="text-sm text-red-500 mt-1">
                  All appointments delayed by {delay} minutes
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              activeEmergencies[0].severity === 'critical' 
                ? 'bg-red-200 text-red-800' 
                : activeEmergencies[0].severity === 'high'
                ? 'bg-orange-200 text-orange-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}>
              {activeEmergencies[0].severity.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-teal-500">
          <p className="text-sm text-gray-500">Total Today</p>
          <p className="text-3xl font-bold text-gray-800">{todayAppointments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Delayed</p>
          <p className="text-3xl font-bold text-red-600">{delayedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Today's Appointments</h2>
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              {todayAppointments.length} total
            </span>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {apt.patientName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{apt.patientName}</p>
                      <p className="text-sm text-gray-500">{apt.doctorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{apt.time}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'delayed' ? 'bg-red-100 text-red-700' :
                      apt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Status */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Hospital Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-gray-700">OPD Services</span>
              </div>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${activeEmergencies.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="font-medium text-gray-700">Emergency Ward</span>
              </div>
              <span className={activeEmergencies.length > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                {activeEmergencies.length > 0 ? 'Busy' : 'Normal'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-gray-700">ICU Status</span>
              </div>
              <span className="text-green-600 font-medium">8/12 beds available</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="font-medium text-gray-700">Avg. Waiting Time</span>
              </div>
              <span className="text-teal-600 font-medium">{15 + delay} mins</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-medium text-gray-700">In Progress</span>
              </div>
              <span className="text-blue-600 font-medium">{inProgressCount} patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
            <span className="text-sm font-medium">New Appointment</span>
          </button>
          <button className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <span className="text-sm font-medium">Add Emergency</span>
          </button>
          <button className="p-4 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-sm font-medium">Search Patient</span>
          </button>
          <button className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4-2h2v20h-2zm4 4h2v16h-2z" />
            </svg>
            <span className="text-sm font-medium">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  )
}
