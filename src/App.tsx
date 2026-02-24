import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { LanguageProvider } from './contexts/LanguageContext'
import { AppProvider, useApp } from './contexts/AppContext'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import BookAppointment from './pages/patient/BookAppointment'
import PatientAppointments from './pages/patient/PatientAppointments'
import MedicalHistory from './pages/patient/MedicalHistory'

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard'
import ManageAppointments from './pages/hospital/ManageAppointments'
import EmergencyManagement from './pages/hospital/EmergencyManagement'
import PatientMedications from './pages/hospital/PatientMedications'

// Shared
import RoleSelection from './pages/RoleSelection'
import FindDoctors from './pages/FindDoctors'

type PatientPage = 'patient-dashboard' | 'book-appointment' | 'patient-appointments' | 'find-doctors' | 'medical-history'
type HospitalPage = 'hospital-dashboard' | 'manage-appointments' | 'emergency-management' | 'patient-medications'
type Page = PatientPage | HospitalPage

function AppContent() {
  const { userRole, setUserRole } = useApp()
  const [currentPage, setCurrentPage] = useState<Page>('patient-dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Reset page when switching roles
  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page)
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

  // Show role selection if no role selected
  if (!userRole) {
    return <RoleSelection />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        userRole={userRole}
        onLogout={() => setUserRole(null)}
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
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  )
}

export default App
