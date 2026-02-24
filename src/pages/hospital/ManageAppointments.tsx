import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ManageAppointments() {
  const { appointments, updateAppointment } = useApp()
  const { t } = useLanguage()

  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delayed' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === 'all' || apt.status === filter
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    updateAppointment(id, { status: newStatus })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'delayed': return 'bg-red-100 text-red-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('manageAppointments.title') || 'Manage Appointments'}
          </h1>
          <p className="text-gray-600">
            {t('manageAppointments.subtitle') || 'View and manage all patient appointments'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Total:</span>
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">
            {appointments.length} appointments
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'confirmed', 'delayed', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-50 to-cyan-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Patient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                          {apt.patientName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{apt.patientName}</p>
                          <p className="text-sm text-gray-500">{apt.patientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700">{apt.doctorName}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{apt.date}</td>
                    <td className="px-6 py-4 text-gray-600">{apt.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                        {apt.delayMinutes && ` (+${apt.delayMinutes}m)`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {(apt.status === 'pending' || apt.status === 'confirmed' || apt.status === 'delayed') && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'cancelled')}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        {apt.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'completed')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'pending').length}
          </p>
          <p className="text-sm text-yellow-600 font-medium">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'confirmed').length}
          </p>
          <p className="text-sm text-green-600 font-medium">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'delayed').length}
          </p>
          <p className="text-sm text-red-600 font-medium">Delayed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'in-progress').length}
          </p>
          <p className="text-sm text-blue-600 font-medium">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600 font-medium">Completed</p>
        </div>
      </div>
    </div>
  )
}
