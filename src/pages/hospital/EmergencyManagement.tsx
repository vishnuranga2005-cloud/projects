import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function EmergencyManagement() {
  const { emergencies, addEmergency, resolveEmergency, appointments } = useApp()
  const { t } = useLanguage()

  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmergency, setNewEmergency] = useState({
    type: '',
    severity: 'medium' as 'critical' | 'high' | 'medium',
    description: '',
    estimatedDelay: 15,
    status: 'active' as const,
  })

  const activeEmergencies = emergencies.filter((e) => e.status === 'active')
  const resolvedEmergencies = emergencies.filter((e) => e.status === 'resolved')
  const delayedAppointments = appointments.filter((apt) => apt.status === 'delayed')

  const handleAddEmergency = () => {
    if (newEmergency.type && newEmergency.description) {
      addEmergency(newEmergency)
      setNewEmergency({
        type: '',
        severity: 'medium',
        description: '',
        estimatedDelay: 15,
        status: 'active',
      })
      setShowAddForm(false)
    }
  }

  const emergencyTypes = [
    'Cardiac Emergency',
    'Accident/Trauma',
    'Stroke',
    'Respiratory Emergency',
    'Pediatric Emergency',
    'Burns',
    'Poisoning',
    'Other',
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('emergencyManagement.title') || 'Emergency Management'}
          </h1>
          <p className="text-gray-600">
            {t('emergencyManagement.subtitle') || 'Handle emergency cases and patient notifications'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Emergency Case
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Emergencies</p>
              <p className="text-3xl font-bold text-red-600">{activeEmergencies.length}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeEmergencies.length > 0 ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
              <svg className={`w-6 h-6 ${activeEmergencies.length > 0 ? 'text-red-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delayed Appointments</p>
              <p className="text-3xl font-bold text-yellow-600">{delayedAppointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolved Today</p>
              <p className="text-3xl font-bold text-green-600">{resolvedEmergencies.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add Emergency Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add Emergency Case</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Type</label>
                <select
                  value={newEmergency.type}
                  onChange={(e) => setNewEmergency({ ...newEmergency, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select type...</option>
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <div className="flex gap-3">
                  {(['critical', 'high', 'medium'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setNewEmergency({ ...newEmergency, severity: sev })}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        newEmergency.severity === sev
                          ? sev === 'critical'
                            ? 'bg-red-500 text-white'
                            : sev === 'high'
                            ? 'bg-orange-500 text-white'
                            : 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newEmergency.description}
                  onChange={(e) => setNewEmergency({ ...newEmergency, description: e.target.value })}
                  placeholder="Brief description of the emergency..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delay: {newEmergency.estimatedDelay} minutes
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={newEmergency.estimatedDelay}
                  onChange={(e) => setNewEmergency({ ...newEmergency, estimatedDelay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-sm text-yellow-700">
                  <span className="font-semibold">Note:</span> Adding this emergency will automatically notify all patients with upcoming appointments about potential delays.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEmergency}
                  disabled={!newEmergency.type || !newEmergency.description}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    newEmergency.type && newEmergency.description
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Emergencies */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Active Emergencies
          </h2>
        </div>

        {activeEmergencies.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No active emergencies</p>
            <p className="text-sm text-gray-400">All systems operating normally</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeEmergencies.map((emergency) => (
              <div key={emergency.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse ${
                      emergency.severity === 'critical' ? 'bg-red-500' :
                      emergency.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-800 text-lg">{emergency.type}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          emergency.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          emergency.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {emergency.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600">{emergency.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                          </svg>
                          Delay: {emergency.estimatedDelay} mins
                        </span>
                        <span>Started: {emergency.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => resolveEmergency(emergency.id)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Emergencies */}
      {resolvedEmergencies.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Resolved Emergencies</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {resolvedEmergencies.map((emergency) => (
              <div key={emergency.id} className="p-6 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">{emergency.type}</h3>
                    <p className="text-sm text-gray-500">{emergency.description}</p>
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
