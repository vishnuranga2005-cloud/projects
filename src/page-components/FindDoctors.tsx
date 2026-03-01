import { useState } from 'react'
import { useApp, SelectedDoctor } from '../contexts/AppContext'

export default function FindDoctors() {
  const { setSelectedDoctor, navigateTo } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [viewingDoctor, setViewingDoctor] = useState<typeof doctors[0] | null>(null)

  const specializations = [
    'All',
    'Cardiologist',
    'Dermatologist',
    'General Physician',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
  ]

  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad']

  const doctors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialization: 'Cardiologist',
      city: 'Mumbai',
      rating: 4.8,
      reviews: 245,
      fee: 500,
      experience: '12 years',
      image: '👩‍⚕️',
      available: true,
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Neurologist',
      city: 'Delhi',
      rating: 4.6,
      reviews: 189,
      fee: 550,
      experience: '8 years',
      image: '👨‍⚕️',
      available: true,
    },
    {
      id: 3,
      name: 'Dr. Meera Reddy',
      specialization: 'Orthopedic',
      city: 'Bangalore',
      rating: 4.9,
      reviews: 312,
      fee: 450,
      experience: '15 years',
      image: '👩‍⚕️',
      available: true,
    },
    {
      id: 4,
      name: 'Dr. Amit Patel',
      specialization: 'General Physician',
      city: 'Chennai',
      rating: 4.7,
      reviews: 156,
      fee: 350,
      experience: '10 years',
      image: '👨‍⚕️',
      available: true,
    },
    {
      id: 5,
      name: 'Dr. Sunita Gupta',
      specialization: 'Dermatologist',
      city: 'Hyderabad',
      rating: 4.5,
      reviews: 178,
      fee: 400,
      experience: '9 years',
      image: '👩‍⚕️',
      available: true,
    },
    {
      id: 6,
      name: 'Dr. Vikram Singh',
      specialization: 'Pediatrician',
      city: 'Mumbai',
      rating: 4.8,
      reviews: 267,
      fee: 400,
      experience: '14 years',
      image: '👨‍⚕️',
      available: true,
    },
  ]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchQuery === '' ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialization =
      selectedSpecialization === '' ||
      selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization

    const matchesCity =
      selectedCity === '' ||
      selectedCity === 'All Cities' ||
      doctor.city === selectedCity

    return matchesSearch && matchesSpecialization && matchesCity
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900">👨‍⚕️ Find Doctors & Specialists</h2>
        <p className="text-gray-600 mt-2">Browse our network of qualified healthcare professionals</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg p-8 mb-10 border-t-4 border-teal-600">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🔍 Filter & Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Search Doctor or Clinic</label>
            <input
              type="text"
              placeholder="Dr. Smith, Cardiologist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec === 'All' ? '' : spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            >
              {cities.map((city) => (
                <option key={city} value={city === 'All Cities' ? '' : city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-300 hover:scale-105">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-gray-600 font-semibold">
          Found <span className="text-teal-600 text-2xl">{filteredDoctors.length}</span> doctors
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-t-4 border-teal-600">
            {/* Header with Avatar */}
            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 p-8 pb-20 relative">
              <div className="text-7xl mb-2">{doctor.image}</div>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {doctor.available ? '✓ Available' : '✗ Busy'}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
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
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm mb-6 pb-6 border-b-2 border-teal-200">
                <div className="flex items-center gap-3 bg-teal-50 rounded-lg p-2">
                  <span className="text-lg">📍</span>
                  <span className="text-gray-700 font-medium">{doctor.city}</span>
                </div>
                <div className="flex items-center gap-3 bg-teal-50 rounded-lg p-2">
                  <span className="text-lg">📅</span>
                  <span className="text-gray-700 font-medium">{doctor.experience}</span>
                </div>
                <div className="flex items-center gap-3 bg-teal-50 rounded-lg p-2">
                  <span className="text-lg">💵</span>
                  <span className="text-gray-700 font-bold">₹{doctor.fee} <span className="text-xs text-gray-500">per visit</span></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {doctor.available ? (
                  <button 
                    onClick={() => {
                      const selectedDoc: SelectedDoctor = {
                        id: String(doctor.id),
                        name: doctor.name,
                        specialization: doctor.specialization,
                        fee: doctor.fee,
                        city: doctor.city,
                      };
                      setSelectedDoctor(selectedDoc);
                      if (navigateTo) {
                        navigateTo('book-appointment');
                      }
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all duration-200"
                  >
                    ✓ Book Appointment
                  </button>
                ) : (
                  <button disabled className="w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-semibold">
                    ✗ Not Available
                  </button>
                )}
                <button 
                  onClick={() => setViewingDoctor(doctor)}
                  className="w-full px-4 py-3 border-2 border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 font-semibold transition-colors"
                >
                  👁️ View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-semibold">No doctors found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      )}

      {/* Doctor Profile Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white relative">
              <button 
                onClick={() => setViewingDoctor(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
              <div className="text-6xl mb-4">{viewingDoctor.image}</div>
              <h2 className="text-2xl font-bold">{viewingDoctor.name}</h2>
              <p className="text-teal-100">{viewingDoctor.specialization}</p>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">
                      {i < Math.floor(viewingDoctor.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 font-semibold">
                  {viewingDoctor.rating} ({viewingDoctor.reviews} reviews)
                </span>
              </div>
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Location</p>
                  <p className="font-semibold text-gray-800">📍 {viewingDoctor.city}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Experience</p>
                  <p className="font-semibold text-gray-800">📅 {viewingDoctor.experience}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Consultation Fee</p>
                  <p className="font-semibold text-green-600">💵 ₹{viewingDoctor.fee}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">Availability</p>
                  <p className={`font-semibold ${viewingDoctor.available ? 'text-green-600' : 'text-red-500'}`}>
                    {viewingDoctor.available ? '✓ Available' : '✗ Not Available'}
                  </p>
                </div>
              </div>
              
              {/* About Section */}
              <div className="bg-teal-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600 text-sm">
                  {viewingDoctor.name} is a highly experienced {viewingDoctor.specialization} 
                  with {viewingDoctor.experience} of practice in {viewingDoctor.city}. 
                  Known for providing excellent patient care and comprehensive medical consultations.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setViewingDoctor(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Close
                </button>
                {viewingDoctor.available && (
                  <button 
                    onClick={() => {
                      const selectedDoc: SelectedDoctor = {
                        id: String(viewingDoctor.id),
                        name: viewingDoctor.name,
                        specialization: viewingDoctor.specialization,
                        fee: viewingDoctor.fee,
                        city: viewingDoctor.city,
                      };
                      setSelectedDoctor(selectedDoc);
                      setViewingDoctor(null);
                      if (navigateTo) {
                        navigateTo('book-appointment');
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                  >
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
