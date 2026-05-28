import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

const googleProvider = new GoogleAuthProvider();

/**
 * Registers a new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {string} displayName 
 * @returns {Promise<UserCredential>}
 */
export async function signUpUser(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
}

/**
 * Signs in an existing user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Authenticates user using Google Auth Popup
 * @returns {Promise<UserCredential>}
 */
export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Logs out the currently authenticated user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  return signOut(auth);
}
