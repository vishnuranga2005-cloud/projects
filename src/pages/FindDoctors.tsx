import { useState } from 'react'

export default function FindDoctors() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const specializations = [
    'All',
    'Cardiologist',
    'Dentist',
    'Dermatologist',
    'General Practice',
    'Neurologist',
    'Pediatrician',
  ]

  const cities = ['All Cities', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      city: 'New York',
      rating: 4.8,
      reviews: 245,
      fee: 150,
      experience: '12 years',
      image: '👩‍⚕️',
      available: true,
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Dentist',
      city: 'Los Angeles',
      rating: 4.6,
      reviews: 189,
      fee: 100,
      experience: '8 years',
      image: '👨‍⚕️',
      available: true,
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialization: 'General Practice',
      city: 'Chicago',
      rating: 4.9,
      reviews: 312,
      fee: 80,
      experience: '15 years',
      image: '👩‍⚕️',
      available: false,
    },
    {
      id: 4,
      name: 'Dr. David Rodriguez',
      specialization: 'Dermatologist',
      city: 'Houston',
      rating: 4.7,
      reviews: 156,
      fee: 120,
      experience: '10 years',
      image: '👨‍⚕️',
      available: true,
    },
    {
      id: 5,
      name: 'Dr. Lisa Anderson',
      specialization: 'Pediatrician',
      city: 'Phoenix',
      rating: 4.5,
      reviews: 178,
      fee: 90,
      experience: '9 years',
      image: '👩‍⚕️',
      available: true,
    },
    {
      id: 6,
      name: 'Dr. James Wilson',
      specialization: 'Neurologist',
      city: 'New York',
      rating: 4.8,
      reviews: 267,
      fee: 180,
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Find Doctors & Clinics</h2>
        <p className="text-gray-600 mt-2">Search and book appointments with healthcare professionals</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Doctor or Clinic</label>
            <input
              type="text"
              placeholder="Enter name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found <span className="font-bold text-gray-900">{filteredDoctors.length}</span> doctors
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
            {/* Header with Avatar */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 pb-12 relative">
              <div className="text-6xl">{doctor.image}</div>
            </div>

            {/* Content */}
            <div className="p-6 pt-10">
              <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-blue-600 font-semibold">{doctor.specialization}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(doctor.rating) ? '★' : '☆'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{doctor.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏳</span>
                  <span>{doctor.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>${doctor.fee} per consultation</span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="space-y-2">
                {doctor.available ? (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Book Appointment
                  </button>
                ) : (
                  <button disabled className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
                    Not Available
                  </button>
                )}
                <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
