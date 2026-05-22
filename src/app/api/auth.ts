import { request, isBackendConfigured } from './client'

/* =========================================================
   Interfaces
========================================================= */

export interface LoginPayload {
    email: string
    password: string
}

export interface SignUpPayload {
    name: string
    email: string
    password: string
}

export interface AuthUser {
    id: string
    name: string
    email: string
}

export interface AuthResponse {
    token: string
    user: AuthUser
}

export interface OTPResponse {
    success: boolean
    message: string
}

/* =========================================================
   Storage Keys
========================================================= */

const STORAGE_TOKEN = 'medisense_token'
const STORAGE_USER = 'medisense_user'

/* =========================================================
   Storage Helpers
========================================================= */

export function getStoredToken(): string | null {
    if (typeof window === 'undefined') {
        return null
    }

    const token = localStorage.getItem(STORAGE_TOKEN)

    console.log(
        'getStoredToken:',
        token ? '[TOKEN_PRESENT]' : '[TOKEN_MISSING]'
    )

    return token
}

export function getStoredUser(): AuthUser | null {
    try {
        if (typeof window === 'undefined') {
            return null
        }

        const rawUser = localStorage.getItem(STORAGE_USER)

        const parsedUser = rawUser
            ? JSON.parse(rawUser)
            : null

        console.log(
            'getStoredUser:',
            parsedUser ? '[USER_PRESENT]' : '[USER_MISSING]',
            parsedUser
        )

        return parsedUser
    } catch (error) {
        console.error(
            'Failed to parse stored user:',
            error
        )

        return null
    }
}

function setStoredAuth(
    token: string,
    user: AuthUser
): void {
    if (typeof window === 'undefined') {
        return
    }

    console.log('setStoredAuth:', {
        token: token
            ? '[TOKEN_PRESENT]'
            : '[TOKEN_MISSING]',
        user,
    })

    localStorage.setItem(STORAGE_TOKEN, token)

    localStorage.setItem(
        STORAGE_USER,
        JSON.stringify(user)
    )

    console.log(
        'Authentication data stored successfully'
    )
}

export function clearAuth(): void {
    if (typeof window === 'undefined') {
        return
    }

    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_USER)

    console.log('Authentication storage cleared')
}

/* =========================================================
   OTP Services
========================================================= */

export async function sendLoginOTP(
    email: string
): Promise<OTPResponse> {
    console.log(
        'Sending login OTP for:',
        email
    )

    if (!isBackendConfigured()) {
        console.log(
            'Backend not configured'
        )

        return {
            success: false,
            message:
                'Backend not configured. Please set up server connection.',
        }
    }

    try {
        const response =
            await request<OTPResponse>(
                '/api/auth/send-login-otp',
                {
                    method: 'POST',
                    body: { email },
                }
            )

        console.log(
            'Login OTP response:',
            response
        )

        return response
    } catch (error) {
        console.error(
            'Login OTP request failed:',
            error
        )

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to connect to backend',
        }
    }
}

export async function verifyLoginOTP(
    email: string,
    otp: string,
    password: string
): Promise<AuthResponse> {
    console.log(
        'Verifying login OTP for:',
        email
    )

    if (!isBackendConfigured()) {
        throw new Error(
            'Backend not configured. Please set up server connection.'
        )
    }

    try {
        const authData =
            await request<AuthResponse>(
                '/api/auth/verify-otp-login',
                {
                    method: 'POST',
                    body: {
                        email,
                        otp,
                        password,
                    },
                }
            )

        setStoredAuth(
            authData.token,
            authData.user
        )

        return authData
    } catch (error) {
        console.error(
            'Login OTP verification failed:',
            error
        )

        throw error
    }
}

export async function sendSignupOTP(
    email: string
): Promise<OTPResponse> {
    console.log(
        'Sending signup OTP for:',
        email
    )

    if (!isBackendConfigured()) {
        return {
            success: false,
            message:
                'Backend not configured. Please set up server connection.',
        }
    }

    try {
        const response =
            await request<OTPResponse>(
                '/api/auth/send-signup-otp',
                {
                    method: 'POST',
                    body: { email },
                }
            )

        console.log(
            'Signup OTP response:',
            response
        )

        return response
    } catch (error) {
        console.error(
            'Signup OTP request failed:',
            error
        )

        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to connect to backend',
        }
    }
}

export async function verifySignupOTP(
    name: string,
    email: string,
    otp: string,
    password: string
): Promise<AuthResponse> {
    console.log(
        'Verifying signup OTP for:',
        email
    )

    if (!isBackendConfigured()) {
        throw new Error(
            'Backend not configured. Please set up server connection.'
        )
    }

    try {
        const authData =
            await request<AuthResponse>(
                '/api/auth/verify-otp-signup',
                {
                    method: 'POST',
                    body: {
                        name,
                        email,
                        otp,
                        password,
                    },
                }
            )

        setStoredAuth(
            authData.token,
            authData.user
        )

        return authData
    } catch (error) {
        console.error(
            'Signup OTP verification failed:',
            error
        )

        throw error
    }
}

/* =========================================================
   Authentication Services
========================================================= */

export async function login(
    payload: LoginPayload
): Promise<AuthResponse> {
    if (!isBackendConfigured()) {
        throw new Error(
            'Backend not configured. Please set up server connection.'
        )
    }

    const authData =
        await request<AuthResponse>(
            '/api/auth/login',
            {
                method: 'POST',
                body: payload,
            }
        )

    setStoredAuth(
        authData.token,
        authData.user
    )

    return authData
}

export async function signup(
    payload: SignUpPayload
): Promise<AuthResponse> {
    if (!isBackendConfigured()) {
        return mockSignup(payload)
    }

    const authData =
        await request<AuthResponse>(
            '/api/auth/signup',
            {
                method: 'POST',
                body: payload,
            }
        )

    setStoredAuth(
        authData.token,
        authData.user
    )

    return authData
}

export function logout(): void {
    clearAuth()
}

/* =========================================================
   Mock Services
========================================================= */

function mockLogin(
    payload: LoginPayload
): Promise<AuthResponse> {
    const authData: AuthResponse = {
        token: `mock-token-${Date.now()}`,
        user: {
            id: '1',
            name: 'User',
            email: payload.email,
        },
    }

    setStoredAuth(
        authData.token,
        authData.user
    )

    return Promise.resolve(authData)
}

function mockSignup(
    payload: SignUpPayload
): Promise<AuthResponse> {
    const authData: AuthResponse = {
        token: `mock-token-${Date.now()}`,
        user: {
            id: '1',
            name: payload.name,
            email: payload.email,
        },
    }

    setStoredAuth(
        authData.token,
        authData.user
    )

    return Promise.resolve(authData)
}