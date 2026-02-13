export default function Dashboard() {
  const upcomingAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      date: '2026-02-15',
      time: '10:00 AM',
      clinic: 'City Medical Center',
      status: 'Confirmed',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dentist',
      date: '2026-02-18',
      time: '2:30 PM',
      clinic: 'Smile Dental Clinic',
      status: 'Pending',
    },
  ]

  const stats = [
    { label: 'Total Appointments', value: '12', icon: '📅', color: 'blue' },
    { label: 'Completed', value: '8', icon: '✓', color: 'green' },
    { label: 'Upcoming', value: '2', icon: '⏰', color: 'orange' },
    { label: 'Cancelled', value: '2', icon: '✕', color: 'red' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Vineet! 👋</h2>
        <p className="text-gray-600 mt-2">Here's your health management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const colorClasses = {
            blue: 'bg-blue-50 border-blue-200 text-blue-600',
            green: 'bg-green-50 border-green-200 text-green-600',
            orange: 'bg-orange-50 border-orange-200 text-orange-600',
            red: 'bg-red-50 border-red-200 text-red-600',
          }

          return (
            <div
              key={index}
              className={`rounded-lg border-2 p-6 ${
                colorClasses[stat.color as keyof typeof colorClasses]
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Upcoming Appointments</h3>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All →
              </a>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{apt.doctorName}</h4>
                      <p className="text-sm text-gray-600">{apt.specialization}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        apt.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🕐</span>
                      <span>{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🏥</span>
                      <span>{apt.clinic}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2">
                <span>+</span> Book an Appointment
              </button>
              <button className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
                📋 Medical Records
              </button>
              <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                💬 Chat with Doctor
              </button>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Health Tip</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Remember to stay hydrated! Drinking 8 glasses of water daily helps maintain optimal health and boosts immunity.
            </p>
            <button className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Read More Tips →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
