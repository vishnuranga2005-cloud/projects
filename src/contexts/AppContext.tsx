'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type UserRole = 'patient' | 'hospital' | null

export interface Patient {
  id: string
  name: string
  phone: string
  email?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  bloodGroup?: string
  emergencyContact?: string
  emergencyPhone?: string
}

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
  patientId: string
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

export interface MedicalRecord {
  id: string
  patientId: string
  condition: string
  diagnosis: string
  doctor: string
  date: string
  notes: string
}

export interface Medication {
  id: string
  patientId: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  instructions: string
  isActive: boolean
}

export interface SelectedDoctor {
  id: string
  name: string
  specialization: string
  fee: number
  city: string
}

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  currentPatient: Patient | null
  setCurrentPatient: (patient: Patient | null) => void
  emergencies: Emergency[]
  addEmergency: (emergency: Omit<Emergency, 'id' | 'timestamp'>) => void
  resolveEmergency: (id: string) => void
  appointments: Appointment[]
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  getActiveEmergencyDelay: () => number
  getPatientAppointments: () => Appointment[]
  isSlotBooked: (doctorId: string, date: string, time: string) => boolean
  getBookedSlots: (doctorId: string, date: string) => string[]
  medicalHistory: MedicalRecord[]
  addMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void
  medications: Medication[]
  addMedication: (medication: Omit<Medication, 'id'>) => void
  removeMedication: (id: string) => void
  selectedDoctor: SelectedDoctor | null
  setSelectedDoctor: (doctor: SelectedDoctor | null) => void
  navigateTo: ((page: string) => void) | null
  setNavigateTo: (fn: (page: string) => void) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor | null>(null)
  const [navigateTo, setNavigateToState] = useState<((page: string) => void) | null>(null)
  
  const setNavigateTo = (fn: (page: string) => void) => {
    setNavigateToState(() => fn)
  }
  
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
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
      patientId: 'patient-1',
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
      patientId: 'patient-2',
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
      patientId: 'patient-3',
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
      patientId: 'patient-1',
      patientName: 'Rahul Sharma',
      patientPhone: '+91 98765 43210',
      doctorId: '1',
      doctorName: 'Dr. Priya Sharma',
      date: '2026-02-23',
      time: '09:00 AM',
      status: 'confirmed',
    },
  ])

  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([
    {
      id: '1',
      patientId: 'patient-1',
      condition: 'Hypertension',
      diagnosis: 'Essential Hypertension Stage 1',
      doctor: 'Dr. Priya Sharma',
      date: '2025-06-15',
      notes: 'Blood pressure regularly above 140/90. Started on medication.'
    },
    {
      id: '2',
      patientId: 'patient-1',
      condition: 'Type 2 Diabetes',
      diagnosis: 'Type 2 Diabetes Mellitus',
      doctor: 'Dr. Rajesh Kumar',
      date: '2025-08-20',
      notes: 'HbA1c at 7.2%. Diet and medication management recommended.'
    }
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      patientId: 'patient-1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2025-08-20',
      instructions: 'Take with meals',
      isActive: true
    },
    {
      id: '2',
      patientId: 'patient-1',
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      startDate: '2025-06-15',
      instructions: 'Take in the morning',
      isActive: true
    }
  ])

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString()
    }
    setMedicalHistory((prev) => [newRecord, ...prev])
  }

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString()
    }
    setMedications((prev) => [newMedication, ...prev])
  }

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }

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

  const getPatientAppointments = () => {
    if (!currentPatient) return []
    return appointments.filter((apt) => apt.patientId === currentPatient.id)
  }

  const isSlotBooked = (doctorId: string, date: string, time: string) => {
    return appointments.some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        apt.status !== 'cancelled'
    )
  }

  const getBookedSlots = (doctorId: string, date: string) => {
    return appointments
      .filter(
        (apt) =>
          apt.doctorId === doctorId &&
          apt.date === date &&
          apt.status !== 'cancelled'
      )
      .map((apt) => apt.time)
  }

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        currentPatient,
        setCurrentPatient,
        emergencies,
        addEmergency,
        resolveEmergency,
        appointments,
        addAppointment,
        updateAppointment,
        getActiveEmergencyDelay,
        getPatientAppointments,
        isSlotBooked,
        getBookedSlots,
        medicalHistory,
        addMedicalRecord,
        medications,
        addMedication,
        removeMedication,
        selectedDoctor,
        setSelectedDoctor,
        navigateTo,
        setNavigateTo,
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
