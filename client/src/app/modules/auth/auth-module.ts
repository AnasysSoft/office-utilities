import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Signin } from './signin/signin';
import { ForgotPassword } from './forgot-password/forgot-password';

const routes: Routes = [
  {path: '', component: Signin},
  { path: 'forgot-password', component: ForgotPassword },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AuthModule { }
