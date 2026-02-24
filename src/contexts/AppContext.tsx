import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'patient' | 'hospital' | null

export interface Emergency {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium'
  description: string
  estimatedDelay: number // in minutes
  timestamp: Date
  status: 'active' | 'resolved'
}

export interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'delayed'
  delayMinutes?: number
  delayReason?: string
}

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  emergencies: Emergency[]
  addEmergency: (emergency: Omit<Emergency, 'id' | 'timestamp'>) => void
  resolveEmergency: (id: string) => void
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  getActiveEmergencyDelay: () => number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [emergencies, setEmergencies] = useState<Emergency[]>([
    {
      id: '1',
      type: 'Cardiac Emergency',
      severity: 'critical',
      description: 'Multiple cardiac cases in ER',
      estimatedDelay: 30,
      timestamp: new Date(),
      status: 'active',
    },
  ])

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Rahul Sharma',
      patientPhone: '+91 98765 43210',
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      date: '2026-02-22',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      patientName: 'Anita Patel',
      patientPhone: '+91 87654 32109',
      doctorId: '2',
      doctorName: 'Dr. Rajesh Kumar',
      date: '2026-02-22',
      time: '11:30 AM',
      status: 'pending',
    },
    {
      id: '3',
      patientName: 'Vikram Singh',
      patientPhone: '+91 76543 21098',
      doctorId: '3',
      doctorName: 'Dr. Meera Reddy',
      date: '2026-02-22',
      time: '02:00 PM',
      status: 'in-progress',
    },
    {
      id: '4',
      patientName: 'Deepika Gupta',
      patientPhone: '+91 65432 10987',
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      date: '2026-02-23',
      time: '09:00 AM',
      status: 'confirmed',
    },
  ])

  const addEmergency = (emergency: Omit<Emergency, 'id' | 'timestamp'>) => {
    const newEmergency: Emergency = {
      ...emergency,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    setEmergencies((prev) => [newEmergency, ...prev])

    // Auto-delay pending/confirmed appointments
    if (emergency.severity === 'critical' || emergency.severity === 'high') {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.status === 'pending' || apt.status === 'confirmed'
            ? {
                ...apt,
                status: 'delayed' as const,
                delayMinutes: emergency.estimatedDelay,
                delayReason: `Emergency: ${emergency.type}`,
              }
            : apt
        )
      )
    }
  }

  const resolveEmergency = (id: string) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'resolved' } : e))
    )
    // Clear delays when emergency is resolved
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.status === 'delayed'
          ? { ...apt, status: 'confirmed' as const, delayMinutes: undefined, delayReason: undefined }
          : apt
      )
    )
  }

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    }
    setAppointments((prev) => [...prev, newAppointment])
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    )
  }

  const getActiveEmergencyDelay = () => {
    const activeEmergencies = emergencies.filter((e) => e.status === 'active')
    if (activeEmergencies.length === 0) return 0
    return Math.max(...activeEmergencies.map((e) => e.estimatedDelay))
  }

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        emergencies,
        addEmergency,
        resolveEmergency,
        appointments,
        addAppointment,
        updateAppointment,
        getActiveEmergencyDelay,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
