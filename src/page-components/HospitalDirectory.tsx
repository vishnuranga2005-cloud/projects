import { useState } from 'react'

export default function HospitalDirectory() {
  const [selectedHospital, setSelectedHospital] = useState(1)

  const hospitals = [
    {
      id: 1,
      name: 'City Medical Center',
      location: 'South Mumbai, Mumbai',
      bedsAvailable: 45,
      totalBeds: 200,
      specialties: ['Cardiology', 'Dentistry', 'General Practice', 'Neurology'],
      rating: 4.8,
      image: '🏥',
      emergencyActive: false,
      doctors: 12,
    },
    {
      id: 2,
      name: 'Sunrise Health Hospital',
      location: 'East Delhi, Delhi',
      bedsAvailable: 28,
      totalBeds: 150,
      specialties: ['Dermatology', 'Pediatrics', 'Cardiology'],
      rating: 4.6,
      image: '🏨',
      emergencyActive: true,
      doctors: 8,
    },
    {
      id: 3,
      name: 'Downtown Health Center',
      location: 'Indiranagar, Bangalore',
      bedsAvailable: 62,
      totalBeds: 300,
      specialties: ['General Practice', 'Cardiology', 'Neurology', 'Pediatrics', 'Dentistry'],
      rating: 4.9,
      image: '🏥',
      emergencyActive: false,
      doctors: 15,
    },
    {
      id: 4,
      name: 'Smile Dental Clinic',
      location: 'T. Nagar, Chennai',
      bedsAvailable: 12,
      totalBeds: 80,
      specialties: ['Dentistry', 'General Practice'],
      rating: 4.7,
      image: '🦷',
      emergencyActive: false,
      doctors: 5,
    },
    {
      id: 5,
      name: 'Children Health Center',
      location: 'Jubilee Hills, Hyderabad',
      bedsAvailable: 35,
      totalBeds: 120,
      specialties: ['Pediatrics', 'General Practice'],
      rating: 4.5,
      image: '👶',
      emergencyActive: false,
      doctors: 7,
    },
  ]

  const hospitalDoctors = {
    1: [
      { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', rating: 4.8, reviews: 245, fee: 600, available: true },
      { id: 2, name: 'Dr. James Wilson', specialization: 'Neurologist', rating: 4.8, reviews: 267, fee: 550, available: true },
      { id: 3, name: 'Dr. Emily Williams', specialization: 'General Practice', rating: 4.9, reviews: 312, fee: 350, available: false },
    ],
    2: [
      { id: 4, name: 'Dr. David Rodriguez', specialization: 'Dermatologist', rating: 4.7, reviews: 156, fee: 450, available: true },
      { id: 5, name: 'Dr. Lisa Anderson', specialization: 'Pediatrician', rating: 4.5, reviews: 178, fee: 400, available: true },
    ],
    3: [
      { id: 6, name: 'Dr. Michael Chen', specialization: 'Dentist', rating: 4.6, reviews: 189, fee: 500, available: true },
      { id: 7, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist', rating: 4.8, reviews: 245, fee: 600, available: true },
      { id: 8, name: 'Dr. James Wilson', specialization: 'Neurologist', rating: 4.8, reviews: 267, fee: 550, available: false },
    ],
    4: [
      { id: 9, name: 'Dr. Michael Chen', specialization: 'Dentist', rating: 4.6, reviews: 189, fee: 500, available: true },
      { id: 10, name: 'Dr. Emily Williams', specialization: 'General Practice', rating: 4.9, reviews: 312, fee: 350, available: true },
    ],
    5: [
      { id: 11, name: 'Dr. Lisa Anderson', specialization: 'Pediatrician', rating: 4.5, reviews: 178, fee: 400, available: true },
      { id: 12, name: 'Dr. Emily Williams', specialization: 'General Practice', rating: 4.9, reviews: 312, fee: 350, available: true },
    ],
  }

  const currentHospital = hospitals.find((h) => h.id === selectedHospital)!
  const currentDoctors = hospitalDoctors[selectedHospital as keyof typeof hospitalDoctors] || []

  // Check if any hospital has active emergency
  const hasActiveEmergency = hospitals.some((h) => h.emergencyActive)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Emergency Alert Banner */}
      {hasActiveEmergency && (
        <div className="mb-8 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white border-l-4 border-red-700 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🚨</span>
              <div>
                <h2 className="text-2xl font-bold">Emergency Alert!</h2>
                <p className="text-red-100 mt-1">
                  {hospitals.filter((h) => h.emergencyActive).map((h) => h.name).join(', ')} is currently handling emergency cases. 
                  Waiting time may be longer.
                </p>
              </div>
            </div>
            <button className="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900">🏥 Hospital Directory</h2>
        <p className="text-gray-600 mt-2">Find hospitals, doctors, and book appointments instantly</p>
      </div>

      {/* Main Layout - Hospital List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Hospital List - Left Side Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-6 border-t-4 border-teal-600 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏥</span> Hospitals
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {hospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-l-4 ${
                    selectedHospital === hospital.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white border-teal-700 shadow-lg'
                      : 'bg-white hover:bg-cyan-50 border-transparent hover:border-teal-300 text-gray-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{hospital.name}</p>
                      <p className={`text-xs mt-1 ${selectedHospital === hospital.id ? 'text-cyan-100' : 'text-gray-600'}`}>
                        📍 {hospital.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-semibold ${selectedHospital === hospital.id ? 'text-cyan-100' : 'text-gray-700'}`}>
                          ⭐ {hospital.rating}
                        </span>
                        <span className={`text-xs ${selectedHospital === hospital.id ? 'text-cyan-100' : 'text-gray-500'}`}>
                          • {hospital.doctors} doctors
                        </span>
                      </div>
                    </div>
                    {hospital.emergencyActive && (
                      <span className="text-2xl animate-pulse">🚨</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Details & Doctors - Right Side Panel */}
        <div className="lg:col-span-3 space-y-8">
          {/* Hospital Information Card */}
          <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-white rounded-2xl shadow-lg p-8 border-t-4 border-teal-600">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-5xl mb-4">{currentHospital.image}</div>
                <h2 className="text-3xl font-bold text-gray-900">{currentHospital.name}</h2>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  📍 {currentHospital.location}
                </p>
              </div>
              {currentHospital.emergencyActive && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 animate-pulse">
                  🚨 Emergency Active
                </div>
              )}
            </div>

            {/* Hospital Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b-2 border-teal-200">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 font-bold">Rating</p>
                <p className="text-2xl font-bold text-teal-600 mt-2">⭐ {currentHospital.rating}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 font-bold">Doctors</p>
                <p className="text-2xl font-bold text-teal-600 mt-2">👨‍⚕️ {currentHospital.doctors}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 font-bold">Beds Available</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{currentHospital.bedsAvailable}/{currentHospital.totalBeds}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-600 font-bold">Bed Occupancy</p>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full"
                      style={{
                        width: `${((currentHospital.totalBeds - currentHospital.bedsAvailable) / currentHospital.totalBeds) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round(((currentHospital.totalBeds - currentHospital.bedsAvailable) / currentHospital.totalBeds) * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-4">🎯 Specialties Available</p>
              <div className="flex flex-wrap gap-3">
                {currentHospital.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full text-sm font-semibold"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-teal-600 rounded"></span>
              👨‍⚕️ Available Doctors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-teal-600 transform hover:-translate-y-2"
                >
                  {/* Doctor Header */}
                  <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 p-8 pb-20 relative">
                    <div className="text-6xl mb-2">👨‍⚕️</div>
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
                        doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {doctor.available ? '✓ Available' : '✗ Busy'}
                    </div>
                  </div>

                  {/* Doctor Content */}
                  <div className="p-6 pt-8">
                    <h4 className="text-lg font-bold text-gray-900">{doctor.name}</h4>
                    <p className="text-teal-600 font-semibold mb-4">{doctor.specialization}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < Math.floor(doctor.rating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {doctor.rating} ({doctor.reviews})
                      </span>
                    </div>

                    {/* Details */}
                    <div className="bg-teal-50 rounded-lg p-4 mb-6 border-b-2 border-teal-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-600 font-bold">Consultation Fee</p>
                          <p className="text-lg font-bold text-teal-600">₹{doctor.fee}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600 font-bold">Per Visit</p>
                          <p className="text-sm font-semibold text-gray-700">30-45 mins</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {doctor.available ? (
                        <button className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-200">
                          ✓ Book Appointment
                        </button>
                      ) : (
                        <button disabled className="w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold">
                          ✗ Not Available
                        </button>
                      )}
                      <button className="w-full px-4 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-semibold transition-colors">
                        👁️ View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentDoctors.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-t-4 border-teal-600">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <p className="text-gray-500 text-lg font-semibold">No doctors available at this hospital.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
