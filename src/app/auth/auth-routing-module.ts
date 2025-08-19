import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register'; // Import RegisterComponent

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register', // Add route for registration
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
