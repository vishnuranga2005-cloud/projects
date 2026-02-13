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
    const statusColors = {
      upcoming: 'bg-blue-50 border-blue-200 text-blue-700',
      completed: 'bg-green-50 border-green-200 text-green-700',
      cancelled: 'bg-red-50 border-red-200 text-red-700',
    }

    const statusBadgeColors = {
      upcoming: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }

    return (
      <div className={`rounded-lg border-2 p-6 ${statusColors[appointment.status as keyof typeof statusColors]}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
            <p className="text-sm text-gray-600">{appointment.specialization}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
              statusBadgeColors[appointment.status as keyof typeof statusBadgeColors]
            }`}
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>

        <div className="space-y-2 mb-4 pb-4 border-b border-current border-opacity-20">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>🏥</span>
              <span className="text-gray-700">{appointment.clinic}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-gray-700">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span className="text-gray-700">{appointment.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏷️</span>
              <span className="text-gray-700">{appointment.type}</span>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Notes:</span> {appointment.notes}
          </p>
        </div>

        <div className="flex gap-2">
          {appointment.status === 'upcoming' && (
            <>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm">
                View Details
              </button>
              <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors text-sm">
                Reschedule
              </button>
              <button className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors text-sm">
                Cancel
              </button>
            </>
          )}
          {appointment.status === 'completed' && (
            <>
              <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors text-sm">
                View Records
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm">
                Leave Review
              </button>
            </>
          )}
          {appointment.status === 'cancelled' && (
            <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors text-sm">
              Rebook Appointment
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Appointments</h2>
        <p className="text-gray-600 mt-2">Manage and track all your medical appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-8 p-4 flex gap-2 overflow-x-auto">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((status) => {
          const counts = {
            all: allAppointments.length,
            upcoming: groupedAppointments.upcoming.length,
            completed: groupedAppointments.completed.length,
            cancelled: groupedAppointments.cancelled.length,
          }

          const labels = {
            all: 'All Appointments',
            upcoming: 'Upcoming',
            completed: 'Completed',
            cancelled: 'Cancelled',
          }

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {labels[status]} ({counts[status]})
            </button>
          )
        })}
      </div>

      {/* Appointments List */}
      {filterStatus === 'all' ? (
        <div className="space-y-6">
          {/* Upcoming Section */}
          {groupedAppointments.upcoming.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded"></span>
                Upcoming Appointments
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
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded"></span>
                Completed Appointments
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
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded"></span>
                Cancelled Appointments
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
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No {filterStatus} appointments found.</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                Book an Appointment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
