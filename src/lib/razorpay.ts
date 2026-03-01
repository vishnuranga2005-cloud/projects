// Payment Demo Mode - Simulated Payment Processing
// Backend Razorpay integration has been removed for security

export interface PaymentSimulationOptions {
  amount: number;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorName: string;
  appointmentDetails: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}

// Get Razorpay Key ID (returns empty for demo mode)
export const getRazorpayKeyId = (): string => {
  return '';
};

// Simulate Payment Processing in Demo Mode
export const initiateRazorpayPayment = async ({
  onSuccess,
}: PaymentSimulationOptions): Promise<void> => {
  try {
    // Simulate payment processing
    onSuccess(
      `mock_payment_${Date.now()}`,
      `mock_order_${Date.now()}`
    );
  } catch (error) {
    console.error('Payment processing failed in demo mode:', error);
  }
};

// Demo simulation with loading state
export const simulatePayment = async ({
  onSuccess,
  onProcessing,
}: {
  amount?: number;
  onSuccess: () => void;
  onProcessing: () => void;
}): Promise<void> => {
  onProcessing();

  // Simulate payment processing time
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Simulate success
  onSuccess();
};
