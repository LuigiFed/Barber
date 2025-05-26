import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nav',
  imports: [RouterModule,CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  userName: string | null = null;

  constructor(private authService: AuthService) {}
logged = false;

 async ngOnInit() {
    this.logged = this.authService.isLoggedIn();

    if (this.logged) {
      this.userName = localStorage.getItem('userName');
      if (!this.userName) {
        this.userName = await this.authService.getUserName();
        if (this.userName) {
          localStorage.setItem('userName', this.userName);
        }
      }
    }

    console.log('logged:', this.logged);
    console.log('userName:', this.userName);
  }


  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout().then(() => {
      window.location.reload();
    });
  }
}
