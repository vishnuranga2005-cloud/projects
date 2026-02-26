// Razorpay Payment Integration Utility

// Type definitions for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, callback: (response: any) => void) => void;
}

export interface CreateOrderPayload {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface OrderResponse {
  success: boolean;
  order?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  error?: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

// API Base URL - change in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get Razorpay Key ID
export const getRazorpayKeyId = (): string => {
  return import.meta.env.VITE_RAZORPAY_KEY_ID || '';
};

// Create Razorpay Order
export const createOrder = async (payload: CreateOrderPayload): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: 'Failed to create order. Please try again.',
    };
  }
};

// Verify Payment
export const verifyPayment = async (payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Failed to verify payment. Please contact support.',
    };
  }
};

// Initialize and open Razorpay checkout
export const initiateRazorpayPayment = async ({
  amount,
  patientName,
  patientPhone,
  patientEmail,
  doctorName,
  appointmentDetails,
  onSuccess,
  onFailure,
  onDismiss,
}: {
  amount: number;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorName: string;
  appointmentDetails: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onFailure: (error: string) => void;
  onDismiss?: () => void;
}): Promise<void> => {
  const keyId = getRazorpayKeyId();
  
  if (!keyId || keyId === 'rzp_test_XXXXXXXXXXXX') {
    onFailure('Razorpay is not configured. Please add your Razorpay Key ID to .env file.');
    return;
  }

  // Check if Razorpay is loaded
  if (!window.Razorpay) {
    onFailure('Payment system is not loaded. Please refresh the page.');
    return;
  }

  // Create order
  const orderResponse = await createOrder({
    amount,
    currency: 'INR',
    receipt: `appointment_${Date.now()}`,
    notes: {
      patientName,
      doctorName,
      appointmentDetails,
    },
  });

  if (!orderResponse.success || !orderResponse.order) {
    onFailure(orderResponse.error || 'Failed to create payment order');
    return;
  }

  const options: RazorpayOptions = {
    key: keyId,
    amount: orderResponse.order.amount,
    currency: orderResponse.order.currency,
    name: 'MediFlow Healthcare',
    description: `Appointment with ${doctorName}`,
    order_id: orderResponse.order.id,
    handler: async (response: RazorpayPaymentResponse) => {
      // Verify payment on server
      const verifyResponse = await verifyPayment({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verifyResponse.success) {
        onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
      } else {
        onFailure(verifyResponse.error || 'Payment verification failed');
      }
    },
    prefill: {
      name: patientName,
      contact: patientPhone,
      email: patientEmail,
    },
    notes: {
      doctor: doctorName,
      appointment: appointmentDetails,
    },
    theme: {
      color: '#0D9488', // Teal color matching the app theme
    },
    modal: {
      ondismiss: () => {
        onDismiss?.();
      },
      escape: true,
      animation: true,
    },
  };

  const rzp = new window.Razorpay(options);
  
  rzp.on('payment.failed', (response: any) => {
    onFailure(response.error?.description || 'Payment failed');
  });

  rzp.open();
};

// For demo/testing without backend - simulates payment flow
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
