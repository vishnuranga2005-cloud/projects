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
      patientName: 'John Doe',
      patientPhone: '+1-555-0123',
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dentist',
      date: '2026-02-18',
      time: '2:30 PM',
      clinic: 'Smile Dental Clinic',
      status: 'Pending',
      patientName: 'Jane Smith',
      patientPhone: '+1-555-0456',
    },
  ]

  const stats = [
    { label: 'Total Appointments', value: '24', icon: '📅', color: 'teal', bg: 'from-teal-500 to-teal-600' },
    { label: 'Completed', value: '18', icon: '✅', color: 'green', bg: 'from-green-500 to-green-600' },
    { label: 'In Progress', value: '4', icon: '👥', color: 'blue', bg: 'from-blue-500 to-blue-600' },
    { label: 'Emergency', value: '2', icon: '🚨', color: 'red', bg: 'from-red-500 to-red-600' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Dashboard 🏥</h2>
        <p className="text-gray-600 mt-2">Hospital Management & Patient Operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl bg-gradient-to-br ${stat.bg} text-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.label}</p>
                <p className="text-4xl font-bold mt-3">{stat.value}</p>
              </div>
              <span className="text-4xl opacity-80">{stat.icon}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <p className="text-xs opacity-80">Updated today</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-8 border-t-4 border-teal-600">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">📋 Patient Queue</h3>
                <p className="text-sm text-gray-500 mt-1">{upcomingAppointments.length} patients scheduled today</p>
              </div>
              <a href="#" className="text-teal-600 hover:text-teal-700 text-sm font-semibold bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors border-2 border-teal-200">
                View All →
              </a>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="border-l-4 border-teal-600 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-teal-700 shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{apt.doctorName}</h4>
                      <p className="text-sm text-gray-600 font-medium">{apt.specialization}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        apt.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                      }`}
                    >
                      {apt.status === 'Confirmed' ? '✓' : '⏳'} {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-teal-200">
                    <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Patient</p>
                        <p className="text-sm font-bold text-gray-900">{apt.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <span className="text-lg">📅</span>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Date</p>
                        <p className="text-sm font-bold text-gray-900">{apt.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <span className="text-lg">🕐</span>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Time</p>
                        <p className="text-sm font-bold text-gray-900">{apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <span className="text-lg">🏥</span>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Clinic</p>
                        <p className="text-sm font-bold text-gray-900">{apt.clinic}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all text-sm shadow-md">
                      ✓ Check In
                    </button>
                    <button className="flex-1 px-4 py-2 border-2 border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 font-semibold transition-colors text-sm bg-white">
                      📝 Details
                    </button>
                    <button className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition-colors text-sm">
                      ⏭️ Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-8 border-t-4 border-teal-600">
            <h3 className="text-xl font-bold text-gray-900 mb-6">🚀 Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md">
                <span>➕</span> New Patient
              </button>
              <button className="w-full px-4 py-3 border-2 border-teal-600 text-teal-700 rounded-lg hover:bg-teal-50 font-semibold transition-colors bg-white">
                🔍 Search Patient
              </button>
              <button className="w-full px-4 py-3 border-2 border-teal-300 text-teal-700 rounded-lg hover:bg-teal-50 font-semibold transition-colors">
                📊 Analytics
              </button>
            </div>
          </div>

          {/* Hospital Status */}
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-8 text-white border-4 border-teal-700">
            <h3 className="font-bold text-lg mb-4">🏥 Hospital Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm font-medium">Emergency Ward</p>
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm font-medium">ICU Status</p>
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm font-medium">OT Available</p>
                <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
              </div>
              <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm font-medium">⏱️ Avg. Waiting Time</p>
                <span className="text-sm font-bold">15 mins <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse ml-2"></span></span>
              </div>
              <p className="text-xs opacity-80 mt-4 pt-4 border-t border-white border-opacity-30">✅ All critical systems operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
