import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { app } from '../../firebase-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private currentUser: User | null = null;

  login(email: string, password: string) {
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password);
  }

 subscribeAuthState(callback: (user: User | null) => void) {
  const auth = getAuth(app);
  return onAuthStateChanged(auth, callback);
}

getUser() {
  return this.currentUser;
}

logout() {
  const auth = getAuth(app);
  return auth.signOut();
}

}
