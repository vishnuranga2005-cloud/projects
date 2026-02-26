import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { initiateRazorpayPayment, getRazorpayKeyId } from '../../lib/razorpay'

const doctors = [
  { id: '1', name: 'Dr. Priya Sharma', specialty: 'Cardiologist', fee: 500, location: 'Mumbai' },
  { id: '2', name: 'Dr. Rajesh Kumar', specialty: 'Neurologist', fee: 550, location: 'Delhi' },
  { id: '3', name: 'Dr. Meera Reddy', specialty: 'Orthopedic', fee: 450, location: 'Bangalore' },
  { id: '4', name: 'Dr. Amit Patel', specialty: 'General Physician', fee: 350, location: 'Chennai' },
  { id: '5', name: 'Dr. Sunita Gupta', specialty: 'Dermatologist', fee: 400, location: 'Hyderabad' },
  { id: '6', name: 'Dr. Vikram Singh', specialty: 'Pediatrician', fee: 400, location: 'Mumbai' },
]

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export default function BookAppointment() {
  const { addAppointment, getActiveEmergencyDelay, currentPatient, getBookedSlots, appointments, selectedDoctor: contextSelectedDoctor, setSelectedDoctor: setContextSelectedDoctor } = useApp()
  const { t } = useLanguage()

  // Check if we have a pre-selected doctor from context (from FindDoctors page)
  const preSelectedDoctor = contextSelectedDoctor ? doctors.find(d => d.id === contextSelectedDoctor.id) : null

  const [step, setStep] = useState(preSelectedDoctor ? 2 : 1)
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(preSelectedDoctor)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [patientName, setPatientName] = useState(currentPatient?.name || '')
  const [patientPhone, setPatientPhone] = useState(currentPatient?.phone || '')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Payment flow states
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'complete' | 'error'>('select')
  const [paymentError, setPaymentError] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [upiId, setUpiId] = useState('')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })
  
  // Check if Razorpay is configured
  const isRazorpayConfigured = getRazorpayKeyId() && getRazorpayKeyId() !== 'rzp_test_XXXXXXXXXXXX'

  // Clear context selected doctor after using it
  useEffect(() => {
    if (contextSelectedDoctor) {
      setContextSelectedDoctor(null)
    }
  }, [])

  const delay = getActiveEmergencyDelay()

  // Update current time every second for real-time slot availability
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Helper function to check if a time slot has passed
  const isSlotPassed = (slotTime: string, date: string) => {
    if (!date) return false
    
    const today = new Date().toISOString().split('T')[0]
    
    // If selected date is in the future, slot hasn't passed
    if (date > today) return false
    
    // If selected date is in the past, slot has passed
    if (date < today) return true
    
    // If it's today, check the time
    const [time, period] = slotTime.split(' ')
    const [hours, minutes] = time.split(':').map(Number)
    let hour24 = hours
    
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0
    }
    
    const slotDate = new Date()
    slotDate.setHours(hour24, minutes, 0, 0)
    
    return currentTime > slotDate
  }

  // Get booked slots for selected doctor and date (updates in real-time)
  const bookedSlots = selectedDoctor && selectedDate 
    ? getBookedSlots(selectedDoctor.id, selectedDate) 
    : []

  // Reset selected time if it becomes booked or has passed
  useEffect(() => {
    if (selectedTime && (bookedSlots.includes(selectedTime) || isSlotPassed(selectedTime, selectedDate))) {
      setSelectedTime('')
    }
  }, [bookedSlots, selectedTime, appointments, currentTime, selectedDate])

  // Handle payment processing and booking
  const processPayment = () => {
    if (!selectedDoctor) return
    
    // If Razorpay is configured, use it
    if (isRazorpayConfigured) {
      initiateRazorpayPayment({
        amount: selectedDoctor.fee,
        patientName,
        patientPhone,
        doctorName: selectedDoctor.name,
        appointmentDetails: `${selectedDate} at ${selectedTime}`,
        onSuccess: (pId, orderId) => {
          setPaymentId(pId)
          setPaymentStep('complete')
          // After showing complete, proceed to booking
          setTimeout(() => {
            addAppointment({
              patientId: currentPatient?.id || `guest-${Date.now()}`,
              patientName,
              patientPhone,
              doctorId: selectedDoctor.id,
              doctorName: selectedDoctor.name,
              date: selectedDate,
              time: selectedTime,
              status: delay > 0 ? 'delayed' : 'pending',
              delayMinutes: delay > 0 ? delay : undefined,
              delayReason: delay > 0 ? 'Emergency cases in hospital' : undefined,
              paymentId: pId,
              paymentStatus: 'paid',
            })
            setBookingSuccess(true)
          }, 1500)
        },
        onFailure: (error) => {
          setPaymentError(error)
          setPaymentStep('error')
        },
        onDismiss: () => {
          setPaymentStep('select')
        },
      })
    } else {
      // Fallback: Simulate payment processing (for demo/development)
      setPaymentStep('processing')
      setTimeout(() => {
        setPaymentStep('complete')
        setTimeout(() => {
          if (selectedDoctor && selectedDate && selectedTime && patientName && patientPhone && paymentMethod) {
            addAppointment({
              patientId: currentPatient?.id || `guest-${Date.now()}`,
              patientName,
              patientPhone,
              doctorId: selectedDoctor.id,
              doctorName: selectedDoctor.name,
              date: selectedDate,
              time: selectedTime,
              status: delay > 0 ? 'delayed' : 'pending',
              delayMinutes: delay > 0 ? delay : undefined,
              delayReason: delay > 0 ? 'Emergency cases in hospital' : undefined,
            })
            setBookingSuccess(true)
          }
        }, 1500)
      }, 2500)
    }
  }
  
  // Open Razorpay checkout directly (for UPI/Card via Razorpay)
  const openRazorpayCheckout = () => {
    if (!selectedDoctor) return
    
    if (isRazorpayConfigured) {
      initiateRazorpayPayment({
        amount: selectedDoctor.fee,
        patientName,
        patientPhone,
        doctorName: selectedDoctor.name,
        appointmentDetails: `${selectedDate} at ${selectedTime}`,
        onSuccess: (pId, orderId) => {
          setPaymentId(pId)
          setPaymentStep('complete')
          setTimeout(() => {
            addAppointment({
              patientId: currentPatient?.id || `guest-${Date.now()}`,
              patientName,
              patientPhone,
              doctorId: selectedDoctor.id,
              doctorName: selectedDoctor.name,
              date: selectedDate,
              time: selectedTime,
              status: delay > 0 ? 'delayed' : 'pending',
              delayMinutes: delay > 0 ? delay : undefined,
              delayReason: delay > 0 ? 'Emergency cases in hospital' : undefined,
              paymentId: pId,
              paymentStatus: 'paid',
            })
            setBookingSuccess(true)
          }, 1500)
        },
        onFailure: (error) => {
          setPaymentError(error)
          setPaymentStep('error')
        },
        onDismiss: () => {
          setPaymentStep('select')
        },
      })
    } else {
      // If Razorpay not configured, show details form for demo
      setPaymentStep('details')
    }
  }

  const handleBooking = () => {
    if (selectedDoctor && selectedDate && selectedTime && patientName && patientPhone && paymentMethod) {
      // For cash payment, book directly
      if (paymentMethod === 'cash') {
        addAppointment({
          patientId: currentPatient?.id || `guest-${Date.now()}`,
          patientName,
          patientPhone,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          date: selectedDate,
          time: selectedTime,
          status: delay > 0 ? 'delayed' : 'pending',
          delayMinutes: delay > 0 ? delay : undefined,
          delayReason: delay > 0 ? 'Emergency cases in hospital' : undefined,
        })
        setBookingSuccess(true)
      } else if (paymentMethod === 'upi' || paymentMethod === 'card') {
        // For UPI and Card, open Razorpay checkout (or fallback form)
        openRazorpayCheckout()
      } else {
        // For Net Banking, show bank selection
        setPaymentStep('details')
      }
    }
  }

  // Validate UPI ID format
  const isValidUpi = (upi: string) => {
    return /^[\w.-]+@[\w]+$/.test(upi)
  }

  // Validate card details
  const isValidCard = () => {
    const { cardNumber, cardName, expiry, cvv } = cardDetails
    return cardNumber.replace(/\s/g, '').length === 16 &&
           cardName.trim().length >= 3 &&
           /^\d{2}\/\d{2}$/.test(expiry) &&
           cvv.length >= 3
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const resetForm = () => {
    setStep(1)
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedTime('')
    setPatientName('')
    setPatientPhone('')
    setPaymentMethod('')
    setBookingSuccess(false)
    setPaymentStep('select')
    setPaymentError('')
    setPaymentId('')
    setUpiId('')
    setCardDetails({
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: ''
    })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (bookingSuccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('bookAppointment.success') || 'Appointment Booked Successfully!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('bookAppointment.successMessage') ||
              'Your appointment has been scheduled. You will receive a confirmation shortly.'}
          </p>

          {delay > 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-yellow-700 text-sm">
                <span className="font-semibold">Note:</span> Due to emergency cases, there may be a delay of approximately {delay} minutes.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">{t('bookAppointment.bookingDetails') || 'Booking Details'}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.patient') || 'Patient'}:</span>
                <span className="font-medium text-gray-800">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.doctor') || 'Doctor'}:</span>
                <span className="font-medium text-gray-800">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.specialty') || 'Specialty'}:</span>
                <span className="font-medium text-gray-800">{selectedDoctor?.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.date') || 'Date'}:</span>
                <span className="font-medium text-gray-800">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.time') || 'Time'}:</span>
                <span className="font-medium text-gray-800">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('bookAppointment.consultationFee') || 'Consultation Fee'}:</span>
                <span className="font-medium text-teal-600">₹{selectedDoctor?.fee}</span>
              </div>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            {t('bookAppointment.bookAnother') || 'Book Another Appointment'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('bookAppointment.title') || 'Book an Appointment'}
          </h1>
          <p className="text-gray-600">
            {t('bookAppointment.subtitle') || 'Schedule your visit with our expert doctors'}
          </p>
        </div>

        {/* Emergency Alert */}
        {delay > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
              <p className="text-yellow-700">
                <span className="font-semibold">Notice:</span> Due to emergency cases, appointments may be delayed by approximately {delay} minutes.
              </p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 md:w-24 h-1 mx-2 ${
                    step > s ? 'bg-teal-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Doctor */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {t('bookAppointment.selectDoctor') || 'Select a Doctor'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {doctor.name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      <p className="text-sm text-gray-500">{doctor.location}</p>
                      <p className="text-sm font-medium text-teal-600 mt-1">₹{doctor.fee}</p>
                    </div>
                    {selectedDoctor?.id === doctor.id && (
                      <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDoctor}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedDoctor
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('bookAppointment.continue') || 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {t('bookAppointment.selectDateTime') || 'Select Date & Time'}
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookAppointment.selectDate') || 'Select Date'}</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">{t('bookAppointment.selectTimeSlot') || 'Select Time Slot'}</label>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {t('bookAppointment.liveUpdates') || 'Live updates'}
                </span>
              </div>
              {(bookedSlots.length > 0 || selectedDate === new Date().toISOString().split('T')[0]) && (
                <p className="text-sm text-amber-600 mb-3 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {t('bookAppointment.unavailableSlots') || 'Unavailable slots are shown in red (booked) or gray (time passed)'}
                </p>
              )}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time)
                  const isPassed = isSlotPassed(time, selectedDate)
                  const isUnavailable = isBooked || isPassed
                  return (
                    <button
                      key={time}
                      onClick={() => !isUnavailable && setSelectedTime(time)}
                      disabled={isUnavailable}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        isBooked
                          ? 'border-red-300 bg-red-50 text-red-400 cursor-not-allowed line-through'
                          : isPassed
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === time
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                      title={isBooked ? 'This slot is already booked' : isPassed ? 'This time has passed' : ''}
                    >
                      {time}
                      {isBooked && (
                        <span className="block text-xs mt-1">{t('bookAppointment.booked') || 'Booked'}</span>
                      )}
                      {isPassed && !isBooked && (
                        <span className="block text-xs mt-1">{t('bookAppointment.passed') || 'Passed'}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                {t('bookAppointment.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('bookAppointment.continue') || 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Details */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {t('bookAppointment.patientDetails') || 'Enter Your Details'}
            </h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookAppointment.fullName') || 'Full Name'}</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={t('bookAppointment.enterFullName') || 'Enter your full name'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookAppointment.phoneNumber') || 'Phone Number'}</label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">{t('bookAppointment.bookingSummary') || 'Booking Summary'}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{t('bookAppointment.doctor') || 'Doctor'}:</span>
                  <p className="font-medium text-gray-800">{selectedDoctor?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('bookAppointment.specialty') || 'Specialty'}:</span>
                  <p className="font-medium text-gray-800">{selectedDoctor?.specialty}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('bookAppointment.date') || 'Date'}:</span>
                  <p className="font-medium text-gray-800">{selectedDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('bookAppointment.time') || 'Time'}:</span>
                  <p className="font-medium text-gray-800">{selectedTime}</p>
                </div>
                <div>
                  <span className="text-gray-500">{t('bookAppointment.fee') || 'Fee'}:</span>
                  <p className="font-medium text-teal-600">₹{selectedDoctor?.fee}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
              >
                {t('bookAppointment.back') || 'Back'}
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!patientName || !patientPhone}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  patientName && patientPhone
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('bookAppointment.continueToPayment') || 'Continue to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment Method */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-6 shadow-lg relative">
            {/* Processing Payment Overlay */}
            {paymentStep === 'processing' && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-teal-200 rounded-full animate-spin">
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-teal-600 rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-6">Processing Payment</h3>
                <p className="text-gray-500 mt-2">Please wait while we process your payment...</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
                  </svg>
                  Do not close or refresh this page
                </div>
              </div>
            )}

            {/* Payment Complete Overlay */}
            {paymentStep === 'complete' && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600 mt-6">Payment Successful!</h3>
                <p className="text-gray-500 mt-2">Completing your booking...</p>
                {paymentId && (
                  <p className="text-xs text-gray-400 mt-2">Payment ID: {paymentId}</p>
                )}
              </div>
            )}

            {/* Payment Error Overlay */}
            {paymentStep === 'error' && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-10 p-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-600 mt-6">Payment Failed</h3>
                <p className="text-gray-500 mt-2 text-center max-w-sm">{paymentError || 'Something went wrong. Please try again.'}</p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setPaymentStep('select')
                      setPaymentError('')
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Change Method
                  </button>
                  <button
                    onClick={() => {
                      setPaymentStep('select')
                      setPaymentError('')
                      handleBooking()
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            {paymentStep === 'select' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {t('bookAppointment.paymentMethod') || 'Select Payment Method'}
                </h2>
                
                {/* Razorpay Badge */}
                {isRazorpayConfigured && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    Secured by Razorpay - PCI DSS Compliant
                  </div>
                )}
                
                {/* Demo Mode Notice */}
                {!isRazorpayConfigured && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    Demo Mode - Configure Razorpay keys for real payments
                  </div>
                )}
                
                {/* Payment Amount */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">{t('bookAppointment.consultationFee') || 'Consultation Fee'}</span>
                    <span className="text-2xl font-bold text-teal-600">₹{selectedDoctor?.fee}</span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  {[
                    { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay' },
                    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks supported' },
                    { id: 'cash', name: 'Pay at Hospital', icon: '💵', description: 'Pay cash at reception' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 border-2 rounded-xl text-left transition-all flex items-center gap-4 ${
                        paymentMethod === method.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Payment Summary */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">{t('bookAppointment.bookingSummary') || 'Booking Summary'}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('bookAppointment.doctor') || 'Doctor'}</span>
                      <span className="font-medium text-gray-800">{selectedDoctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('bookAppointment.dateTime') || 'Date & Time'}</span>
                      <span className="font-medium text-gray-800">{selectedDate} at {selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('bookAppointment.patient') || 'Patient'}</span>
                      <span className="font-medium text-gray-800">{patientName}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-gray-700">{t('bookAppointment.totalAmount') || 'Total Amount'}</span>
                      <span className="font-bold text-teal-600">₹{selectedDoctor?.fee}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    {t('bookAppointment.back') || 'Back'}
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!paymentMethod}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      paymentMethod
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {paymentMethod === 'cash' ? (t('bookAppointment.confirmBooking') || 'Confirm Booking') : (t('bookAppointment.proceed') || 'Proceed')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* UPI Payment Details */}
            {paymentStep === 'details' && paymentMethod === 'upi' && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">UPI Payment</h2>
                </div>

                {/* Payment Amount */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Amount to Pay</span>
                    <span className="text-2xl font-bold text-teal-600">₹{selectedDoctor?.fee}</span>
                  </div>
                </div>

                {/* UPI ID Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">Enter your UPI ID (e.g., 9876543210@paytm, user@okicici)</p>
                </div>

                {/* Supported UPI Apps */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-3">Supported UPI Apps:</p>
                  <div className="flex flex-wrap gap-3">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
                      <span key={app} className="px-3 py-1 bg-white border rounded-full text-sm text-gray-600">{app}</span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setPaymentStep('select')
                      setUpiId('')
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!isValidUpi(upiId)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isValidUpi(upiId)
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Pay ₹{selectedDoctor?.fee}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Card Payment Details */}
            {paymentStep === 'details' && paymentMethod === 'card' && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">Card Payment</h2>
                </div>

                {/* Payment Amount */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Amount to Pay</span>
                    <span className="text-2xl font-bold text-teal-600">₹{selectedDoctor?.fee}</span>
                  </div>
                </div>

                {/* Card Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({...cardDetails, cardNumber: formatCardNumber(e.target.value)})}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <svg className="w-8 h-5 text-gray-400" viewBox="0 0 48 32">
                          <rect fill="#1A1F71" width="48" height="32" rx="4"/>
                          <text fill="white" fontSize="10" fontWeight="bold" x="8" y="20">VISA</text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.cardName}
                      onChange={(e) => setCardDetails({...cardDetails, cardName: e.target.value.toUpperCase()})}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Payment Notice */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                  </svg>
                  Your payment information is secured with 256-bit encryption
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setPaymentStep('select')
                      setCardDetails({ cardNumber: '', cardName: '', expiry: '', cvv: '' })
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={!isValidCard()}
                    className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      isValidCard()
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Pay ₹{selectedDoctor?.fee}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Net Banking Payment */}
            {paymentStep === 'details' && paymentMethod === 'netbanking' && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800">Net Banking</h2>
                </div>

                {/* Payment Amount */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 mb-6 border border-teal-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Amount to Pay</span>
                    <span className="text-2xl font-bold text-teal-600">₹{selectedDoctor?.fee}</span>
                  </div>
                </div>

                {/* Bank Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Bank</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'PNB'].map(bank => (
                      <button
                        key={bank}
                        onClick={processPayment}
                        className="p-4 border-2 rounded-xl text-center hover:border-teal-500 hover:bg-teal-50 transition-all"
                      >
                        <span className="text-2xl mb-2 block">🏦</span>
                        <span className="text-sm font-medium text-gray-700">{bank}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => setPaymentStep('select')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
