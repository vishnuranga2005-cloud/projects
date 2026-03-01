'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'

// Lazy load components to avoid hydration issues
import dynamicLoader from 'next/dynamic'

const Navbar = dynamicLoader(() => import('@/components/Navbar'), { loading: () => <div /> })
const Sidebar = dynamicLoader(() => import('@/components/Sidebar'), { loading: () => <div /> })
const ProfileSetupModal = dynamicLoader(() => import('@/components/ProfileSetupModal'), { loading: () => <div /> })

// Patient Pages
const PatientDashboard = dynamicLoader(() => import('@/page-components/patient/PatientDashboard'), { loading: () => <LoadingPage /> })
const BookAppointment = dynamicLoader(() => import('@/page-components/patient/BookAppointment'), { loading: () => <LoadingPage /> })
const PatientAppointments = dynamicLoader(() => import('@/page-components/patient/PatientAppointments'), { loading: () => <LoadingPage /> })
const MedicalHistory = dynamicLoader(() => import('@/page-components/patient/MedicalHistory'), { loading: () => <LoadingPage /> })
const Settings = dynamicLoader(() => import('@/page-components/patient/Settings'), { loading: () => <LoadingPage /> })

// Hospital Pages
const HospitalDashboard = dynamicLoader(() => import('@/page-components/hospital/HospitalDashboard'), { loading: () => <LoadingPage /> })
const ManageAppointments = dynamicLoader(() => import('@/page-components/hospital/ManageAppointments'), { loading: () => <LoadingPage /> })
const EmergencyManagement = dynamicLoader(() => import('@/page-components/hospital/EmergencyManagement'), { loading: () => <LoadingPage /> })
const PatientMedications = dynamicLoader(() => import('@/page-components/hospital/PatientMedications'), { loading: () => <LoadingPage /> })

// Shared
const RoleSelection = dynamicLoader(() => import('@/page-components/RoleSelection'), { loading: () => <LoadingPage /> })
const FindDoctors = dynamicLoader(() => import('@/page-components/FindDoctors'), { loading: () => <LoadingPage /> })
const Login = dynamicLoader(() => import('@/page-components/Login'), { loading: () => <LoadingPage /> })

type PatientPage = 'patient-dashboard' | 'book-appointment' | 'patient-appointments' | 'find-doctors' | 'medical-history' | 'settings'
type HospitalPage = 'hospital-dashboard' | 'manage-appointments' | 'emergency-management' | 'patient-medications'
type Page = PatientPage | HospitalPage

function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

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
        const { supabase } = await import('@/lib/supabase');
        if (userRole === 'patient') {
          const { data } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
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
    return <LoadingPage />;
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
