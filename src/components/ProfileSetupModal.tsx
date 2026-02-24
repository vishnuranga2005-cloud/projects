import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

interface ProfileSetupModalProps {
  role: 'patient' | 'hospital';
  onComplete: () => void;
}

interface PatientProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface HospitalStaffProfile {
  fullName: string;
  employeeId: string;
  department: string;
  designation: string;
  phone: string;
  specialization: string;
}

export default function ProfileSetupModal({ role, onComplete }: ProfileSetupModalProps) {
  const { user } = useAuth();
  const { setCurrentPatient } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Patient form state
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  // Hospital staff form state
  const [staffProfile, setStaffProfile] = useState<HospitalStaffProfile>({
    fullName: '',
    employeeId: '',
    department: '',
    designation: '',
    phone: '',
    specialization: '',
  });

  const handlePatientSubmit = async () => {
    if (!patientProfile.fullName || !patientProfile.phone) {
      setError('Please fill in required fields');
      return;
    }

    // Save patient data to context
    setCurrentPatient({
      id: user?.id || 'patient-' + Date.now(),
      name: patientProfile.fullName,
      phone: patientProfile.phone,
      email: user?.email,
      dateOfBirth: patientProfile.dateOfBirth || undefined,
      gender: patientProfile.gender || undefined,
      address: patientProfile.address || undefined,
      bloodGroup: patientProfile.bloodGroup || undefined,
      emergencyContact: patientProfile.emergencyContact || undefined,
      emergencyPhone: patientProfile.emergencyPhone || undefined,
    });

    // Skip database save for demo users
    if (user?.id?.startsWith('demo-')) {
      onComplete();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase.from('patients').insert({
        user_id: user?.id,
        email: user?.email,
        full_name: patientProfile.fullName,
        date_of_birth: patientProfile.dateOfBirth || null,
        gender: patientProfile.gender || null,
        phone: patientProfile.phone,
        address: patientProfile.address || null,
        blood_group: patientProfile.bloodGroup || null,
        emergency_contact_name: patientProfile.emergencyContact || null,
        emergency_contact_phone: patientProfile.emergencyPhone || null,
      });

      if (dbError) throw dbError;
      onComplete();
    } catch (err: any) {
      // If there's a DB error, still complete since we saved to context
      console.error('DB save error:', err);
      onComplete();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffSubmit = async () => {
    if (!staffProfile.fullName || !staffProfile.employeeId || !staffProfile.department) {
      setError('Please fill in required fields');
      return;
    }

    // Skip database save for demo users
    if (user?.id?.startsWith('demo-')) {
      onComplete();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase.from('hospital_staff').insert({
        user_id: user?.id,
        email: user?.email,
        full_name: staffProfile.fullName,
        employee_id: staffProfile.employeeId,
        department: staffProfile.department,
        designation: staffProfile.designation || null,
        phone: staffProfile.phone || null,
        specialization: staffProfile.specialization || null,
      });

      if (dbError) throw dbError;
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">
            {role === 'patient' ? 'Complete Your Profile' : 'Staff Registration'}
          </h2>
          <p className="text-teal-100 mt-1">
            {role === 'patient' 
              ? 'Please fill in your details for better healthcare service'
              : 'Enter your staff details to access the hospital portal'
            }
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {role === 'patient' ? (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={patientProfile.fullName}
                  onChange={(e) => setPatientProfile({ ...patientProfile, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={patientProfile.dateOfBirth}
                    onChange={(e) => setPatientProfile({ ...patientProfile, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={patientProfile.gender}
                    onChange={(e) => setPatientProfile({ ...patientProfile, gender: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={patientProfile.phone}
                  onChange={(e) => setPatientProfile({ ...patientProfile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={patientProfile.address}
                  onChange={(e) => setPatientProfile({ ...patientProfile, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={2}
                  placeholder="Enter your address"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={patientProfile.bloodGroup}
                  onChange={(e) => setPatientProfile({ ...patientProfile, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Emergency Contact */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={patientProfile.emergencyContact}
                      onChange={(e) => setPatientProfile({ ...patientProfile, emergencyContact: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={patientProfile.emergencyPhone}
                      onChange={(e) => setPatientProfile({ ...patientProfile, emergencyPhone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Phone"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePatientSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={staffProfile.fullName}
                  onChange={(e) => setStaffProfile({ ...staffProfile, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Employee ID & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={staffProfile.employeeId}
                    onChange={(e) => setStaffProfile({ ...staffProfile, employeeId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="EMP001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={staffProfile.department}
                    onChange={(e) => setStaffProfile({ ...staffProfile, department: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select</option>
                    <option value="reception">Reception</option>
                    <option value="emergency">Emergency</option>
                    <option value="opd">OPD</option>
                    <option value="ipd">IPD</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="lab">Laboratory</option>
                    <option value="radiology">Radiology</option>
                    <option value="admin">Administration</option>
                  </select>
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={staffProfile.designation}
                  onChange={(e) => setStaffProfile({ ...staffProfile, designation: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Receptionist, Nurse, Doctor"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={staffProfile.specialization}
                  onChange={(e) => setStaffProfile({ ...staffProfile, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Cardiology, General Medicine"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={staffProfile.phone}
                  onChange={(e) => setStaffProfile({ ...staffProfile, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleStaffSubmit}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
