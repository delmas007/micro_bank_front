import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts';
import { CustomersComponent } from './customers/customers';
import { AuthGuard } from './auth/guards/auth-guard';
import { LoginComponent } from './auth/components/login/login';
import {RegisterComponent} from './auth/components/register/register';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/customers', pathMatch: 'full' }
];
