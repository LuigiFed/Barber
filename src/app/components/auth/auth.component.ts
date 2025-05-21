import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from "../nav/nav.component";


import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterModule, HttpClientModule, NavComponent, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor( private authService: AuthService, private router: Router) {}



async logIn(form: NgForm) {

    console.log('Form values:', form.value);
const { email, password } = form.value;
  try {
    await this.authService.login(email, password);
    console.log('Login riuscito');
    this.router.navigate(['/home']);
  } catch (error: any) {
    console.error('Login fallito', error.message);

  }
}
}
