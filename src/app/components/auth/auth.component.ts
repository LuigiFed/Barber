import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-auth',
  imports: [CommonModule, RouterModule, HttpClientModule, NavComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor( private authService: AuthService) {}

   async logIn() {
    try {
      const userCredential = await this.authService.login('user@example.com', 'password');
      console.log('Login successful', userCredential);
    } catch (error) {
      console.log('Login failed', error);
    }
  }

}
