import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'

export default function PatientMedications() {
  const { appointments, medications, addMedication, removeMedication, medicalHistory, addMedicalRecord } = useApp()

  const [selectedPatientId, setSelectedPatientId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'medications' | 'history'>('medications')
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [showAddRecord, setShowAddRecord] = useState(false)

  // Get unique patients from appointments
  const uniquePatients = Array.from(
    new Map(appointments.map((apt) => [apt.patientId, { id: apt.patientId, name: apt.patientName, phone: apt.patientPhone }])).values()
  )

  const selectedPatient = uniquePatients.find((p) => p.id === selectedPatientId)
  const patientMedications = medications.filter((m) => m.patientId === selectedPatientId)
  const patientMedicalHistory = medicalHistory.filter((r) => r.patientId === selectedPatientId)

  // Form states for medication
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: ''
  })

  // Form states for medical record
  const [recordForm, setRecordForm] = useState({
    condition: '',
    diagnosis: '',
    doctor: '',
    date: '',
    notes: ''
  })

  const handleAddMedication = () => {
    if (selectedPatientId && medicationForm.name && medicationForm.dosage && medicationForm.frequency) {
      addMedication({
        patientId: selectedPatientId,
        name: medicationForm.name,
        dosage: medicationForm.dosage,
        frequency: medicationForm.frequency,
        startDate: medicationForm.startDate || new Date().toISOString().split('T')[0],
        endDate: medicationForm.endDate || undefined,
        instructions: medicationForm.instructions,
        isActive: true
      })
      setMedicationForm({ name: '', dosage: '', frequency: '', startDate: '', endDate: '', instructions: '' })
      setShowAddMedication(false)
    }
  }

  const handleAddRecord = () => {
    if (selectedPatientId && recordForm.condition && recordForm.diagnosis && recordForm.date) {
      addMedicalRecord({
        patientId: selectedPatientId,
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Patient Medications & History</h1>
        <p className="text-gray-600">Manage medications and medical records for patients</p>
      </div>

      {/* Patient Selector */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">-- Select a patient --</option>
          {uniquePatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.phone})
            </option>
          ))}
        </select>
      </div>

      {selectedPatientId && (
        <>
          {/* Patient Info */}
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {selectedPatient?.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedPatient?.name}</h2>
                <p className="text-cyan-100">{selectedPatient?.phone}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('medications')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'medications'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Medications ({patientMedications.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'history'
                  ? 'text-cyan-600 border-b-2 border-cyan-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Medical History ({patientMedicalHistory.length})
            </button>
          </div>

          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="space-y-4">
              {/* Add Medication Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddMedication(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  Prescribe Medication
                </button>
              </div>

              {/* Add Medication Modal */}
              {showAddMedication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Prescribe Medication for {selectedPatient?.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name *</label>
                        <input
                          type="text"
                          value={medicationForm.name}
                          onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Metformin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                        <input
                          type="text"
                          value={medicationForm.dosage}
                          onChange={(e) => setMedicationForm({ ...medicationForm, dosage: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                        <select
                          value={medicationForm.frequency}
                          onChange={(e) => setMedicationForm({ ...medicationForm, frequency: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="">Select frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={medicationForm.startDate}
                            onChange={(e) => setMedicationForm({ ...medicationForm, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={medicationForm.endDate}
                            onChange={(e) => setMedicationForm({ ...medicationForm, endDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                        <textarea
                          value={medicationForm.instructions}
                          onChange={(e) => setMedicationForm({ ...medicationForm, instructions: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          rows={2}
                          placeholder="e.g., Take with food"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowAddMedication(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMedication}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                      >
                        Prescribe
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Medications List */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
                  <h2 className="text-lg font-bold text-gray-800">Current Medications</h2>
                </div>
                {patientMedications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 3h12v2H6V3zm6 4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No medications prescribed</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {patientMedications.map((medication) => (
                      <div key={medication.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              medication.isActive ? 'bg-cyan-100' : 'bg-gray-100'
                            }`}>
                              <svg className={`w-6 h-6 ${medication.isActive ? 'text-cyan-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
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
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              medication.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {medication.isActive ? 'Active' : 'Completed'}
                            </span>
                            <button
                              onClick={() => removeMedication(medication.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove medication"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Add Record Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddRecord(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
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
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add Medical Record for {selectedPatient?.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition/Illness *</label>
                        <input
                          type="text"
                          value={recordForm.condition}
                          onChange={(e) => setRecordForm({ ...recordForm, condition: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Diabetes, Hypertension"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis *</label>
                        <input
                          type="text"
                          value={recordForm.diagnosis}
                          onChange={(e) => setRecordForm({ ...recordForm, diagnosis: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Type 2 Diabetes Mellitus"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input
                          type="text"
                          value={recordForm.doctor}
                          onChange={(e) => setRecordForm({ ...recordForm, doctor: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., Dr. Priya Sharma"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input
                          type="date"
                          value={recordForm.date}
                          onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={recordForm.notes}
                          onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                      >
                        Save Record
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History List */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-teal-50">
                  <h2 className="text-lg font-bold text-gray-800">Medical History</h2>
                </div>
                {patientMedicalHistory.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No medical records</p>
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
        </>
      )}
    </div>
  )
}
