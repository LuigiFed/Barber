import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  createUserWithEmailAndPassword,
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

  private currentUser: User | null = null;

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
  register(email: string, password: string) {
    const auth = getAuth(app);
    return createUserWithEmailAndPassword(auth, email, password);
  }

getUser() {
  return this.currentUser;
}

logout() {
  const auth = getAuth(app);
  return auth.signOut();
}

}
