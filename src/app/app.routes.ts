import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './guards/auth.guards';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  {path: 'user' , component : UserComponent},
  { path: '**', redirectTo: 'home' }
];
