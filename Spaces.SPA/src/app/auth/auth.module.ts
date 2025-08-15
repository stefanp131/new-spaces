import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [SharedModule],
  exports: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
