import emailjs from "@emailjs/browser";

/* =========================================================
   Interfaces
========================================================= */

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message?: string;
}

interface OTPStoreData {
  otp: string;
  expiresAt: number;
}

/* =========================================================
   Constants
========================================================= */

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 Minutes
const OTP_LENGTH = 6;

/* =========================================================
   In-Memory OTP Store
   NOTE:
   Use Redis or Database in production systems.
========================================================= */

const otpStore = new Map<string, OTPStoreData>();

/* =========================================================
   EmailJS Initialization
========================================================= */

export function initEmailJS(): void {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;

  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && publicKey) {
    emailjs.init(publicKey);

    console.log("EmailJS initialized successfully");
  } else {
    console.warn("EmailJS configuration variables are missing");
  }
}

/* =========================================================
   OTP Generator
========================================================= */

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* =========================================================
   Send OTP Service
========================================================= */

export async function sendOTP(email: string): Promise<SendOTPResponse> {
  try {
    console.log("Initiating OTP send process for:", email);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;

    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    /* =============================================
           Validate Environment Variables
        ============================================= */

    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        "EmailJS configuration missing. Please verify environment variables.",
      );
    }

    /* =============================================
           Generate OTP
        ============================================= */

    const otp = generateOTP();

    console.log("Generated OTP successfully");

    /* =============================================
           Store OTP Temporarily
        ============================================= */

    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + OTP_EXPIRY_TIME,
    });

    console.log("OTP stored temporarily for verification");

    /* =============================================
           Send OTP via EmailJS
        ============================================= */

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
      },
    );

    console.log("OTP email sent successfully:", response);

    return {
      success: true,
      message: "OTP sent successfully to your email address.",
    };
  } catch (error) {
    console.error("Failed to send OTP:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    };
  }
}

/* =========================================================
   Verify OTP Service
========================================================= */

export function verifyOTP(email: string, otp: string): VerifyOTPResponse {
  console.log("Verifying OTP for:", email);

  const normalizedEmail = email.toLowerCase();

  const storedOTPData = otpStore.get(normalizedEmail);

  console.log("Stored OTP data:", storedOTPData);

  /* =============================================
       Validate OTP Existence
    ============================================= */

  if (!storedOTPData) {
    console.warn("OTP not found or expired for:", email);

    return {
      success: false,
      message: "OTP not found or expired. Please request a new OTP.",
    };
  }

  /* =============================================
       Check OTP Expiry
    ============================================= */

  if (Date.now() > storedOTPData.expiresAt) {
    console.warn("OTP expired for:", email);

    otpStore.delete(normalizedEmail);

    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  /* =============================================
       Compare OTP Values
    ============================================= */

  console.log("Comparing OTP values");

  if (storedOTPData.otp !== otp) {
    console.warn("OTP mismatch detected for:", email);

    return {
      success: false,
      message: "Invalid OTP. Please try again.",
    };
  }

  /* =============================================
       OTP Verified Successfully
    ============================================= */

  console.log("OTP verified successfully for:", email);

  otpStore.delete(normalizedEmail);

  return {
    success: true,
  };
}

/* =========================================================
   Cleanup Expired OTPs
========================================================= */

export function clearExpiredOTPs(): void {
  const currentTime = Date.now();

  let removedCount = 0;

  for (const [email, otpData] of otpStore.entries()) {
    if (currentTime > otpData.expiresAt) {
      otpStore.delete(email);
      removedCount++;
    }
  }

  console.log(
    `Expired OTP cleanup completed. Removed ${removedCount} expired entries.`,
  );
}
