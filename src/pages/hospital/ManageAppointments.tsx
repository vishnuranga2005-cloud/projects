import { useState, useEffect } from 'react'
import { useApp, Appointment } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'

export default function ManageAppointments() {
  const { appointments, updateAppointment, addMedication, addMedicalRecord } = useApp()
  const { t } = useLanguage()

  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delayed' | 'in-progress' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null)
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  
  // Prescription form state
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    notes: '',
    medications: [{ name: '', dosage: '', frequency: '', instructions: '' }]
  })

  // Update current time every second for real-time status
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === 'all' || apt.status === filter
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'in-progress') => {
    updateAppointment(id, { status: newStatus })
  }

  // Check if appointment is happening now (within 30 mins of scheduled time)
  const isAppointmentNow = (date: string, time: string) => {
    const today = currentTime.toISOString().split('T')[0]
    if (date !== today) return false

    const [timeStr, period] = time.split(' ')
    const [hours, minutes] = timeStr.split(':').map(Number)
    let hour24 = hours
    if (period === 'PM' && hours !== 12) hour24 = hours + 12
    else if (period === 'AM' && hours === 12) hour24 = 0

    const appointmentTime = new Date()
    appointmentTime.setHours(hour24, minutes, 0, 0)

    const diffMs = currentTime.getTime() - appointmentTime.getTime()
    const diffMins = diffMs / (1000 * 60)

    // Appointment is "now" if it started within last 30 mins
    return diffMins >= -5 && diffMins <= 30
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'delayed': return 'bg-orange-100 text-orange-700'
      case 'in-progress': return 'bg-blue-500 text-white'
      case 'completed': return 'bg-gray-100 text-gray-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleViewAppointment = (apt: Appointment) => {
    setViewingAppointment(apt)
    setPrescription({
      diagnosis: '',
      notes: '',
      medications: [{ name: '', dosage: '', frequency: '', instructions: '' }]
    })
    setShowPrescriptionForm(false)
  }

  const addMedicationField = () => {
    setPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', instructions: '' }]
    }))
  }

  const removeMedicationField = (index: number) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedicationField = (index: number, field: string, value: string) => {
    setPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const handleSavePrescription = () => {
    if (!viewingAppointment) return

    const today = new Date().toISOString().split('T')[0]

    // Add medical record
    if (prescription.diagnosis) {
      addMedicalRecord({
        patientId: viewingAppointment.patientId,
        condition: prescription.diagnosis,
        diagnosis: prescription.diagnosis,
        doctor: viewingAppointment.doctorName,
        date: today,
        notes: prescription.notes
      })
    }

    // Add medications
    prescription.medications.forEach(med => {
      if (med.name) {
        addMedication({
          patientId: viewingAppointment.patientId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: today,
          instructions: med.instructions,
          isActive: true
        })
      }
    })

    // Close modal
    setViewingAppointment(null)
    setShowPrescriptionForm(false)
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
            {(['all', 'pending', 'confirmed', 'in-progress', 'delayed', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'in-progress' ? 'Ongoing' : f.charAt(0).toUpperCase() + f.slice(1)}
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
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apt.status)} ${apt.status === 'in-progress' ? 'animate-pulse' : ''}`}>
                        {apt.status === 'in-progress' ? 'Ongoing' : apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        {apt.delayMinutes && ` (+${apt.delayMinutes}m)`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {(apt.status === 'confirmed' || apt.status === 'delayed') && isAppointmentNow(apt.date, apt.time) && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'in-progress')}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors animate-pulse"
                          >
                            Start Now
                          </button>
                        )}
                        {(apt.status === 'confirmed' || apt.status === 'delayed') && !isAppointmentNow(apt.date, apt.time) && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'in-progress')}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {apt.status === 'in-progress' && (
                          <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium animate-pulse flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                            Ongoing
                          </span>
                        )}
                        {apt.status === 'in-progress' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'completed')}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            Complete
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
                        <button 
                          onClick={() => handleViewAppointment(apt)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            apt.status === 'completed' 
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {apt.status === 'completed' ? 'View/Prescribe' : 'View'}
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
          <p className="text-sm text-blue-600 font-medium">Ongoing</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-lg text-center">
          <p className="text-2xl font-bold text-gray-800">
            {appointments.filter((a) => a.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600 font-medium">Completed</p>
        </div>
      </div>

      {/* View Appointment / Prescription Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white relative rounded-t-2xl">
              <button 
                onClick={() => setViewingAppointment(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <p className="text-teal-100">{viewingAppointment.date} at {viewingAppointment.time}</p>
            </div>
            
            {/* Appointment Info */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Patient</p>
                  <p className="font-semibold text-gray-800">{viewingAppointment.patientName}</p>
                  <p className="text-sm text-gray-600">{viewingAppointment.patientPhone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Doctor</p>
                  <p className="font-semibold text-gray-800">{viewingAppointment.doctorName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingAppointment.status)}`}>
                  {viewingAppointment.status === 'in-progress' ? 'Ongoing' : viewingAppointment.status.charAt(0).toUpperCase() + viewingAppointment.status.slice(1)}
                </span>
              </div>

              {/* Prescription Section (only for completed appointments) */}
              {viewingAppointment.status === 'completed' && (
                <div className="border-t pt-4 mt-4">
                  {!showPrescriptionForm ? (
                    <button
                      onClick={() => setShowPrescriptionForm(true)}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
                      </svg>
                      Add Prescription & Medication
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800 text-lg">Add Prescription</h3>
                      
                      {/* Diagnosis */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <input
                          type="text"
                          value={prescription.diagnosis}
                          onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter diagnosis"
                        />
                      </div>
                      
                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={prescription.notes}
                          onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={2}
                          placeholder="Additional notes..."
                        />
                      </div>
                      
                      {/* Medications */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Medications</label>
                          <button
                            onClick={addMedicationField}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                          >
                            + Add Another
                          </button>
                        </div>
                        
                        {prescription.medications.map((med, index) => (
                          <div key={index} className="bg-purple-50 rounded-lg p-4 mb-3 relative">
                            {prescription.medications.length > 1 && (
                              <button
                                onClick={() => removeMedicationField(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={med.name}
                                onChange={(e) => updateMedicationField(index, 'name', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Medicine name"
                              />
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => updateMedicationField(index, 'dosage', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Dosage (e.g., 500mg)"
                              />
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => updateMedicationField(index, 'frequency', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Frequency (e.g., Twice daily)"
                              />
                              <input
                                type="text"
                                value={med.instructions}
                                onChange={(e) => updateMedicationField(index, 'instructions', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                placeholder="Instructions"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setShowPrescriptionForm(false)}
                          className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePrescription}
                          className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg"
                        >
                          Save Prescription
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            {!showPrescriptionForm && (
              <div className="p-4 border-t">
                <button 
                  onClick={() => setViewingAppointment(null)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
