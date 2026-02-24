import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function PatientAppointments() {
  const { appointments, emergencies } = useApp()
  const { t } = useLanguage()

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')

  const getStatusBadge = (status: string, delayMinutes?: number) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Confirmed
          </span>
        )
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Pending
          </span>
        )
      case 'delayed':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium animate-pulse">
            Delayed (+{delayMinutes} mins)
          </span>
        )
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            In Progress
          </span>
        )
      case 'completed':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Completed
          </span>
        )
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' || apt.status === 'pending' || apt.status === 'delayed'
  )
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t('patientAppointments.title') || 'My Appointments'}
        </h1>
        <p className="text-gray-600">
          {t('patientAppointments.subtitle') || 'Track and manage your scheduled appointments'}
        </p>
      </div>

      {/* Emergency Notification */}
      {activeEmergencies.length > 0 && (
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-red-700">
                {t('patientAppointments.delayNotification') || 'Appointment Delay Notice'}
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Due to <span className="font-semibold">{activeEmergencies[0].type}</span>, your appointments may be delayed by approximately{' '}
                <span className="font-semibold">{activeEmergencies[0].estimatedDelay} minutes</span>.
                We apologize for the inconvenience.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
            </svg>
            {t('patientAppointments.upcoming') || 'Upcoming Appointments'}
          </h2>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
              </svg>
            </div>
            <p className="text-gray-500">No upcoming appointments</p>
            <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {appointment.doctorName.split(' ')[1][0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{appointment.doctorName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                          </svg>
                          {appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                          </svg>
                          {appointment.time}
                        </span>
                      </div>
                      {appointment.delayReason && (
                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                          </svg>
                          {appointment.delayReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(appointment.status, appointment.delayMinutes)}
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              {t('patientAppointments.past') || 'Past Appointments'}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pastAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors opacity-75">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                      {appointment.doctorName.split(' ')[1][0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">{appointment.doctorName}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(appointment.status)}
                    {appointment.status === 'completed' && (
                      <button className="px-4 py-2 border border-teal-300 rounded-lg text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors">
                        View Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
