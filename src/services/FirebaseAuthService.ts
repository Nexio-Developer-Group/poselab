import { auth } from '../firebase'
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    getRedirectResult,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    UserCredential,
    ConfirmationResult,
} from 'firebase/auth'

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
    prompt: 'select_account'
})
// GitHub provider with custom parameters

export const githubProvider = new GithubAuthProvider()
githubProvider.setCustomParameters({
    allow_signup: 'true',
    prompt: 'consent'  // Force consent screen for GitHub
})

export async function signInWithGoogle(): Promise<UserCredential> {
    try {
        const result = await signInWithPopup(auth, googleProvider)
        return result
    } catch (error: any) {
        console.error('Google sign-in error:', error)
        throw new Error(error.message || 'Google sign-in failed')
    }
}

export async function signInWithGithub(): Promise<UserCredential> {
    try {
        console.log('Opening GitHub sign-in popup...')
        const result = await signInWithPopup(auth, githubProvider)
        console.log('GitHub sign-in successful:', result.user.email)
        return result
    } catch (error: any) {
        console.error('GitHub sign-in error:', error)
        throw new Error(error.message || 'GitHub sign-in failed')
    }
}

export async function getRedirectresult(): Promise<UserCredential | null> {
    try {
        const result = await getRedirectResult(auth)
        return result
    } catch (error: any) {
        console.error('Redirect result error:', error)
        throw new Error(error.message || 'Authentication failed')
    }
}

let recaptchaVerifier: RecaptchaVerifier | null = null;

export async function sendPhoneOTP(phoneNumber: string): Promise<ConfirmationResult> {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved");
        },
      }
    );
  }

  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifyPhoneOTP(
  confirmationResult: ConfirmationResult,
  otp: string
) {
  return await confirmationResult.confirm(otp);
}

export async function getIdToken(userCredential: UserCredential): Promise<string> {
    const idToken = await userCredential.user.getIdToken()
    return idToken
}