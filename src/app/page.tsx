'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import ProfileSetupModal from '@/components/ProfileSetupModal'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

// Patient Pages
import PatientDashboard from '@/page-components/patient/PatientDashboard'
import BookAppointment from '@/page-components/patient/BookAppointment'
import PatientAppointments from '@/page-components/patient/PatientAppointments'
import MedicalHistory from '@/page-components/patient/MedicalHistory'
import Settings from '@/page-components/patient/Settings'

// Hospital Pages
import HospitalDashboard from '@/page-components/hospital/HospitalDashboard'
import ManageAppointments from '@/page-components/hospital/ManageAppointments'
import EmergencyManagement from '@/page-components/hospital/EmergencyManagement'
import PatientMedications from '@/page-components/hospital/PatientMedications'

// Shared
import RoleSelection from '@/page-components/RoleSelection'
import FindDoctors from '@/page-components/FindDoctors'
import Login from '@/page-components/Login'

type PatientPage = 'patient-dashboard' | 'book-appointment' | 'patient-appointments' | 'find-doctors' | 'medical-history' | 'settings'
type HospitalPage = 'hospital-dashboard' | 'manage-appointments' | 'emergency-management' | 'patient-medications'
type Page = PatientPage | HospitalPage

function PageContent() {
  const { userRole, setNavigateTo, setCurrentPatient } = useApp()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('patient-dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [checkingProfile, setCheckingProfile] = useState(false)

  // Reset page when switching roles
  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page)
  }

  // Register navigation function with context
  useEffect(() => {
    setNavigateTo(handlePageChange);
  }, []);

  // Check if user has profile when role is selected
  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id || !userRole) return;
      
      // Skip profile check for demo users
      if (user.id.startsWith('demo-')) {
        setShowProfileSetup(false);
        return;
      }
      
      setCheckingProfile(true);
      
      try {
        if (userRole === 'patient') {
          const { data } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
            // Load existing profile into context
            setCurrentPatient({
              id: data.user_id,
              name: data.full_name,
              phone: data.phone,
              email: data.email,
              dateOfBirth: data.date_of_birth || undefined,
              gender: data.gender || undefined,
              address: data.address || undefined,
              bloodGroup: data.blood_group || undefined,
              emergencyContact: data.emergency_contact_name || undefined,
              emergencyPhone: data.emergency_contact_phone || undefined,
            });
            setShowProfileSetup(false);
          } else {
            setShowProfileSetup(true);
          }
        } else {
          const { data } = await supabase
            .from('hospital_staff')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (!data) {
            setShowProfileSetup(true);
          }
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [user, userRole]);

  // Show loading state
  if (isLoading || checkingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => {}} />;
  }

  // Show role selection if no role selected
  if (!userRole) {
    return <RoleSelection />;
  }

  // Show profile setup modal if needed
  if (showProfileSetup) {
    return (
      <ProfileSetupModal 
        role={userRole}
        onComplete={() => setShowProfileSetup(false)}
      />
    );
  }

  // Main app layout
  const renderPage = () => {
    // Patient Pages
    if (currentPage === 'patient-dashboard') return <PatientDashboard />;
    if (currentPage === 'book-appointment') return <BookAppointment />;
    if (currentPage === 'patient-appointments') return <PatientAppointments />;
    if (currentPage === 'find-doctors') return <FindDoctors />;
    if (currentPage === 'medical-history') return <MedicalHistory />;
    if (currentPage === 'settings') return <Settings onLogout={logout} />;

    // Hospital Pages
    if (currentPage === 'hospital-dashboard') return <HospitalDashboard />;
    if (currentPage === 'manage-appointments') return <ManageAppointments />;
    if (currentPage === 'emergency-management') return <EmergencyManagement />;
    if (currentPage === 'patient-medications') return <PatientMedications />;

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        currentPage={currentPage}
        onNavigate={handlePageChange}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          onLogout={logout}
        />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return <PageContent />;
}

export const dynamic = 'force-dynamic';
