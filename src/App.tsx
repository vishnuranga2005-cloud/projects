import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import FindDoctors from './pages/FindDoctors'
import MyAppointments from './pages/MyAppointments'

type Page = 'dashboard' | 'find-doctors' | 'appointments'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'find-doctors':
        return <FindDoctors />
      case 'appointments':
        return <MyAppointments />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
