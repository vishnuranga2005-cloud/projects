import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ProfileSetupModal from './components/ProfileSetupModal'
import { LanguageProvider } from './contexts/LanguageContext'
import { AppProvider, useApp } from './contexts/AppContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import PatientAppointments from './pages/patient/PatientAppointments'
import MedicalHistory from './pages/patient/MedicalHistory'
import Settings from './pages/patient/Settings'

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import ManageAppointments from './pages/hospital/ManageAppointments'
import EmergencyManagement from './pages/hospital/EmergencyManagement'
import PatientMedications from './pages/hospital/PatientMedications'

// Shared
import RoleSelection from './pages/RoleSelection'
import FindDoctors from './pages/FindDoctors'
import Login from './pages/Login'

type PatientPage = 'patient-dashboard' | 'book-appointment' | 'patient-appointments' | 'find-doctors' | 'medical-history' | 'settings'
type HospitalPage = 'hospital-dashboard' | 'manage-appointments' | 'emergency-management' | 'patient-medications'
type Page = PatientPage | HospitalPage

function AppContent() {
  const { userRole, setUserRole, setNavigateTo, setCurrentPatient } = useApp()
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
      } catch {
        // If table doesn't exist yet, show profile setup
        setShowProfileSetup(true);
      }
      
      setCheckingProfile(false);
    };

    checkProfile();
  }, [user?.id, userRole]);

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  const handleLogout = async () => {
    await logout()
    setUserRole(null)
  }

  const renderPatientPage = () => {
    switch (currentPage) {
      case 'patient-dashboard':
        return <PatientDashboard />
      case 'book-appointment':
        return <BookAppointment />
      case 'patient-appointments':
        return <PatientAppointments />
      case 'find-doctors':
        return <FindDoctors />
      case 'medical-history':
        return <MedicalHistory />
      case 'settings':
        return <Settings onLogout={handleLogout} />
      default:
        return <PatientDashboard />
    }
  }

  const renderHospitalPage = () => {
    switch (currentPage) {
      case 'hospital-dashboard':
        return <HospitalDashboard />
      case 'manage-appointments':
        return <ManageAppointments />
      case 'emergency-management':
        return <EmergencyManagement />
      case 'patient-medications':
        return <PatientMedications />
      default:
        return <HospitalDashboard />
    }
  }

  // Show loading spinner while checking auth
  if (isLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => {}} />
  }

  // Show role selection if no role selected
  if (!userRole) {
    return <RoleSelection />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetupModal 
          role={userRole} 
          onComplete={handleProfileComplete} 
        />
      )}
      
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        userRole={userRole}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage}
          onNavigate={handlePageChange}
          userRole={userRole}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {userRole === 'patient' ? renderPatientPage() : renderHospitalPage()}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
