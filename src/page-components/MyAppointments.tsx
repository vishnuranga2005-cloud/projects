import { useState } from 'react'

type FilterStatus = 'all' | 'upcoming' | 'completed' | 'cancelled'

export default function MyAppointments() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const allAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      clinic: 'City Medical Center',
      date: '2026-02-15',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'Regular Checkup',
      notes: 'Annual heart checkup',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dentist',
      clinic: 'Smile Dental Clinic',
      date: '2026-02-18',
      time: '2:30 PM',
      status: 'upcoming',
      type: 'Dental Cleaning',
      notes: 'Regular dental cleaning',
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Williams',
      specialization: 'General Practice',
      clinic: 'Downtown Health Center',
      date: '2026-02-10',
      time: '3:00 PM',
      status: 'completed',
      type: 'General Consultation',
      notes: 'Follow-up consultation',
    },
    {
      id: 4,
      doctorName: 'Dr. David Rodriguez',
      specialization: 'Dermatologist',
      clinic: 'Skin Care Clinic',
      date: '2026-02-05',
      time: '11:00 AM',
      status: 'completed',
      type: 'Skin Treatment',
      notes: 'Acne treatment session',
    },
    {
      id: 5,
      doctorName: 'Dr. Lisa Anderson',
      specialization: 'Pediatrician',
      clinic: 'Children\'s Health Center',
      date: '2026-01-28',
      time: '4:00 PM',
      status: 'cancelled',
      type: 'Children Checkup',
      notes: 'Cancelled due to schedule conflict',
    },
  ]

  const filteredAppointments = allAppointments.filter((apt) => {
    if (filterStatus === 'all') return true
    return apt.status === filterStatus
  })

  const groupedAppointments = {
    upcoming: filteredAppointments.filter((a) => a.status === 'upcoming'),
    completed: filteredAppointments.filter((a) => a.status === 'completed'),
    cancelled: filteredAppointments.filter((a) => a.status === 'cancelled'),
  }

  const AppointmentCard = ({ appointment }: { appointment: (typeof allAppointments)[0] }) => {
    const statusConfig = {
      upcoming: {
        bg: 'bg-gradient-to-r from-cyan-50 to-transparent',
        border: 'border-l-4 border-teal-600',
        badge: 'bg-cyan-100 text-teal-700',
        icon: '📅',
      },
      completed: {
        bg: 'bg-gradient-to-r from-emerald-50 to-transparent',
        border: 'border-l-4 border-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
        icon: '✅',
      },
      cancelled: {
        bg: 'bg-gradient-to-r from-red-50 to-transparent',
        border: 'border-l-4 border-red-600',
        badge: 'bg-red-100 text-red-700',
        icon: '❌',
      },
    }

    const config = statusConfig[appointment.status as keyof typeof statusConfig]

    return (
      <div className={`rounded-xl p-6 ${config.bg} ${config.border} shadow-md hover:shadow-lg transition-all duration-300`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {config.icon}
              {appointment.doctorName}
            </h3>
            <p className="text-sm text-gray-600 font-medium mt-1">{appointment.specialization}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${config.badge}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b-2 border-gray-200">
          <div className="flex items-center gap-2">
            <span>🏥</span>
            <div>
              <p className="text-xs text-gray-600">Clinic</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.clinic}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>📅</span>
            <div>
              <p className="text-xs text-gray-600">Date</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>🕐</span>
            <div>
              <p className="text-xs text-gray-600">Time</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>🏷️</span>
            <div>
              <p className="text-xs text-gray-600">Type</p>
              <p className="text-sm font-semibold text-gray-900">{appointment.type}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-bold">📝 Notes:</span> {appointment.notes}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {appointment.status === 'upcoming' && (
            <>
              <button className="flex-1 min-w-[120px] px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg font-semibold transition-all text-sm">
                ✓ Details
              </button>
              <button className="flex-1 min-w-[120px] px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-semibold transition-colors text-sm">
                📅 Reschedule
              </button>
              <button className="flex-1 min-w-[120px] px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors text-sm">
                ✕ Cancel
              </button>
            </>
          )}
          {appointment.status === 'completed' && (
            <>
              <button className="flex-1 min-w-[120px] px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-semibold transition-colors text-sm">
                📄 Records
              </button>
              <button className="flex-1 min-w-[120px] px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg font-semibold transition-all text-sm">
                ⭐ Review
              </button>
            </>
          )}
          {appointment.status === 'cancelled' && (
            <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:shadow-lg font-semibold transition-all text-sm">
              🔄 Rebook
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900">📋 My Appointments</h2>
        <p className="text-gray-600 mt-2">Manage and track all your medical appointments with our healthcare providers</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gradient-to-r from-white to-cyan-50 rounded-2xl shadow-lg mb-10 p-4 flex gap-3 overflow-x-auto border-b-4 border-teal-600">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => {
          const counts = {
            all: allAppointments.length,
            upcoming: groupedAppointments.upcoming.length,
            completed: groupedAppointments.completed.length,
            cancelled: groupedAppointments.cancelled.length,
          }

          const labels = {
            all: 'All',
            upcoming: '📅 Upcoming',
            completed: '✅ Completed',
            cancelled: '❌ Cancelled',
          }

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap shadow-sm ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {labels[status]} <span className="ml-2 font-bold">({counts[status]})</span>
            </button>
          )
        })}
      </div>

      {/* Appointments List */}
      {filterStatus === 'all' ? (
        <div className="space-y-10">
          {/* Upcoming Section */}
          {groupedAppointments.upcoming.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-teal-600 rounded"></span>
                📅 Upcoming Appointments
              </h3>
              <div className="space-y-4">
                {groupedAppointments.upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Section */}
          {groupedAppointments.completed.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-600 rounded"></span>
                ✅ Completed Appointments
              </h3>
              <div className="space-y-4">
                {groupedAppointments.completed.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Section */}
          {groupedAppointments.cancelled.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-red-600 rounded"></span>
                ❌ Cancelled Appointments
              </h3>
              <div className="space-y-4">
                {groupedAppointments.cancelled.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt) => <AppointmentCard key={apt.id} appointment={apt} />)
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg border-t-4 border-teal-600">
              <div className="text-5xl mb-4">🗓️</div>
              <p className="text-gray-500 text-lg font-semibold">No {filterStatus} appointments found.</p>
              <button className="mt-6 px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-200">
                ➕ Book an Appointment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
