import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false; // LoadingSpinnerComponent
  error: string | null = null;

  constructor(private authService: AuthService){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    if(this.isLoginMode){
      this.authService.login(form.value.email, form.value.password).subscribe(resData=>{
        console.log(resData);
        this.isLoading = false;
       }, errorMessage =>{
         console.log(errorMessage);
         this.isLoading = false;
         this.error = errorMessage 
       })
    }else{
      this.authService.signup(form.value.email, form.value.password).subscribe(resData=>{
        console.log(resData);
        this.isLoading = false;
       }, errorMessage =>{
         console.log(errorMessage);
         this.isLoading = false;
         this.error = errorMessage 
       });
      //  console.log(form.value);
    }
    form.reset();
     
  }
}
