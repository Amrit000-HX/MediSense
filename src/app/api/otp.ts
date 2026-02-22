import emailjs from "@emailjs/browser";

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
}

// Initialize EmailJS (should be called once in your app initialization)
export function initEmailJS() {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  
  if (serviceId && publicKey) {
    emailjs.init(publicKey);
  }
}

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Send OTP via EmailJS
export async function sendOTP(email: string): Promise<SendOTPResponse> {
  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (!serviceId || !templateId || !publicKey) {
      throw new Error("EmailJS configuration missing. Please check environment variables.");
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP for verification
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
    
    // Send OTP via EmailJS
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        otp_code: otp,
        from_name: "MediSense",
      },
      {
        publicKey,
      }
    );
    
    console.log("OTP sent successfully via EmailJS:", response);
    
    return {
      success: true,
      message: "OTP sent to your email",
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
}

// Verify OTP
export function verifyOTP(email: string, otp: string): VerifyOTPResponse {
  console.log("Verifying OTP for:", email, "OTP:", otp);
  const stored = otpStore.get(email.toLowerCase());
  console.log("Stored OTP data:", stored);
  
  if (!stored) {
    console.log("No OTP found for email:", email);
    return {
      success: false,
      message: "OTP not found or expired. Please request a new OTP.",
    };
  }

  if (Date.now() > stored.expiresAt) {
    console.log("OTP expired for email:", email);
    otpStore.delete(email.toLowerCase());
    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  console.log("Comparing OTPs - Stored:", stored.otp, "Provided:", otp);
  if (stored.otp !== otp) {
    console.log("OTP mismatch for email:", email);
    return {
      success: false,
      message: "Invalid OTP. Please try again.",
    };
  }

  console.log("OTP verified successfully for email:", email);
  // OTP verified successfully, remove it
  otpStore.delete(email.toLowerCase());
  return {
    success: true,
  };
}

// Clear expired OTPs (call periodically)
export function clearExpiredOTPs() {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
}
