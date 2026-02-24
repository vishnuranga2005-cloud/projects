import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'

export default function MedicalHistory() {
  const { 
    currentPatient, 
    medicalHistory, 
    addMedicalRecord, 
    medications
  } = useApp()

  const [activeTab, setActiveTab] = useState<'history' | 'medications'>('history')
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Form states for medical record
  const [recordForm, setRecordForm] = useState({
    condition: '',
    diagnosis: '',
    doctor: '',
    date: '',
    notes: ''
  })

  const handleAddRecord = () => {
    if (recordForm.condition && recordForm.diagnosis && recordForm.date) {
      addMedicalRecord({
        patientId: currentPatient?.id || '',
        condition: recordForm.condition,
        diagnosis: recordForm.diagnosis,
        doctor: recordForm.doctor,
        date: recordForm.date,
        notes: recordForm.notes
      })
      setRecordForm({ condition: '', diagnosis: '', doctor: '', date: '', notes: '' })
      setShowAddRecord(false)
    }
  }

  const patientMedicalHistory = medicalHistory.filter(r => r.patientId === currentPatient?.id)
  const patientMedications = medications.filter(m => m.patientId === currentPatient?.id)
  const activeMedications = patientMedications.filter(m => m.isActive)

  // Calculate next medication times
  const getNextDoseTime = (frequency: string) => {
    const now = currentTime
    const hours = now.getHours()
    
    switch (frequency) {
      case 'Once daily':
        return '8:00 AM tomorrow'
      case 'Twice daily':
        return hours < 8 ? '8:00 AM' : hours < 20 ? '8:00 PM' : '8:00 AM tomorrow'
      case 'Three times daily':
        return hours < 8 ? '8:00 AM' : hours < 14 ? '2:00 PM' : hours < 20 ? '8:00 PM' : '8:00 AM tomorrow'
      case 'Four times daily':
        return hours < 6 ? '6:00 AM' : hours < 12 ? '12:00 PM' : hours < 18 ? '6:00 PM' : hours < 22 ? '10:00 PM' : '6:00 AM tomorrow'
      case 'As needed':
        return 'As needed'
      default:
        return 'Check prescription'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medical History & Medications</h1>
          <p className="text-gray-600">Manage your health records and track medications</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Current Time</span>
          <span className="text-lg font-bold text-teal-600">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'history'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Medical History
        </button>
        <button
          onClick={() => setActiveTab('medications')}
          className={`px-6 py-3 font-medium transition-all relative ${
            activeTab === 'medications'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Medications
          {activeMedications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeMedications.length}
            </span>
          )}
        </button>
      </div>

      {/* Medical History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Add Record Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddRecord(true)}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Add Medical Record
            </button>
          </div>

          {/* Add Record Modal */}
          {showAddRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add Medical Record</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition/Illness *</label>
                    <input
                      type="text"
                      value={recordForm.condition}
                      onChange={(e) => setRecordForm({ ...recordForm, condition: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Diabetes, Hypertension"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                    <input
                      type="text"
                      value={recordForm.diagnosis}
                      onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Type 2 Diabetes Mellitus"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={recordForm.doctor}
                      onChange={(e) => setRecordForm({ ...recordForm, doctor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Dr. Priya Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={recordForm.date}
                      onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={recordForm.notes}
                      onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      rows={3}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowAddRecord(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRecord}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save Record
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Medical Records List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <h2 className="text-lg font-bold text-gray-800">Your Medical Records</h2>
            </div>
            {patientMedicalHistory.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-2 4h-2v2h2v2h-2v2h-2v-2H7v-2h2v-2H7v-2h2v-2h2v2h2v2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No medical records yet</p>
                <p className="text-sm text-gray-400 mt-1">Add your medical history to keep track</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {patientMedicalHistory.map((record) => (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{record.condition}</h3>
                        <p className="text-sm text-gray-600 mt-1">{record.diagnosis}</p>
                        {record.doctor && (
                          <p className="text-sm text-gray-500 mt-1">Treated by: {record.doctor}</p>
                        )}
                        {record.notes && (
                          <p className="text-sm text-gray-400 mt-2 italic">{record.notes}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {record.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          {/* Real-time Medication Reminder */}
          {activeMedications.length > 0 && (
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Medication Reminders</h3>
                  <p className="text-teal-100 text-sm">Real-time tracking of your medications</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMedications.map((med) => (
                  <div key={med.id} className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-teal-100">{med.dosage} - {med.frequency}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-sm">Next: {getNextDoseTime(med.frequency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Banner - Medications managed by hospital */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <p className="text-sm text-blue-700">
              Your medications are prescribed and managed by hospital staff. Contact your doctor to update prescriptions.
            </p>
          </div>

          {/* Medications List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <h2 className="text-lg font-bold text-gray-800">Your Medications</h2>
            </div>
            {patientMedications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 3h12v2H6V3zm6 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" />
                  </svg>
                </div>
                <p className="text-gray-500">No medications prescribed</p>
                <p className="text-sm text-gray-400 mt-1">Your doctor will add medications when needed</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {patientMedications.map((medication) => (
                  <div key={medication.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          medication.isActive ? 'bg-teal-100' : 'bg-gray-100'
                        }`}>
                          <svg className={`w-6 h-6 ${medication.isActive ? 'text-teal-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 3h12v2H6V3zm6 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{medication.name}</h3>
                          <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                          {medication.instructions && (
                            <p className="text-sm text-gray-500 mt-1">{medication.instructions}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            {medication.startDate && <span>Started: {medication.startDate}</span>}
                            {medication.endDate && <span>Ends: {medication.endDate}</span>}
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        medication.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {medication.isActive ? 'Active' : 'Completed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
