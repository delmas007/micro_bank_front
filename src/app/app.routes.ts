import { Routes } from '@angular/router';
import {AccountsComponent} from './accounts/accounts';
import {CustomersComponent} from './customers/customers';

export const routes: Routes = [
  { path : "customers" , component : CustomersComponent},
  { path : "accounts", component : AccountsComponent}
];
