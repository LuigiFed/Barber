import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  updateProfile
} from 'firebase/auth';
import { app } from '../../firebase-config';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        localStorage.setItem('userToken', user.uid);
      } else {
        localStorage.removeItem('userToken');
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  login(email: string, password: string) {
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password);
  }

  subscribeAuthState(callback: (user: User | null) => void) {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, callback);
  }

async register(email: string, password: string, name: string, surname: string, phone: string) {
  const auth = getAuth(app);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const uid = userCredential.user.uid;


  const db = getFirestore(app);
  await setDoc(doc(db, 'users', uid), {
    name,
    surname,
    phone,
    email
  });

  return userCredential;
}

  getUser() {
    return this.currentUser;
  }

  async getUserName(): Promise<string | null> {
  if (this.currentUser) {
    const userData = await this.getUserData(this.currentUser.uid);
    if (userData && userData['name']) {
      return userData['name'];
    }
  }
  return null;
}


  async getUserData(uid: string) {
  const db = getFirestore(app);
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
}

  logout() {
    const auth = getAuth(app);
    return auth.signOut();
  }
}
