import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';


import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor( private authService: AuthService, private router: Router) {}


 mode: 'login' | 'register' = 'login';
loginError: string | null = null;

async logIn(form: NgForm) {
  const { email, password } = form.value;
  try {
    await this.authService.login(email, password);
    console.log('Login riuscito');
    await this.router.navigate(['/home']);
  } catch (error: any) {
    console.error('Login fallito', error.message);
  }
}


async register(form: NgForm) {
  if (!form.valid) return;
  const { email, password, name, surname, phone } = form.value;
  try {
    await this.authService.register(email, password, name, surname, phone);
    console.log('Registrazione riuscita');
    this.mode = 'login';
  } catch (error: any) {
    console.error('Errore registrazione', error.message);
  }
}



}
