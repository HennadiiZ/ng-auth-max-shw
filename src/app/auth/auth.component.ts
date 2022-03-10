import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;

  constructor(private authService: AuthService){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    if(this.isLoginMode){

    }else{
      this.authService.signup(form.value.email, form.value.password).subscribe(resData=>{
        console.log(resData);
       }, err=>{
         console.log(err);
       });
       console.log(form.value);
    }
     form.reset();
  }
}
