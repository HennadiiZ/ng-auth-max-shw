import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs"
export interface AuthResponseData{
    kind?: string;
    idToken: string;
    email: string;	
    refreshToken: string;	
    expiresIn: string;	
    localId: string;	
}

// 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]'
@Injectable({providedIn: 'root'})
export class AuthService{

    myUrlWithKey = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]'
    myUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
    apiKey = 'AIzaSyDV1YPhVjxwFIu9_Tzds1UJeheYrvyDISs'

    constructor(private http: HttpClient){

    }

    signup(email: string, password: string){
        return  this.http.post<AuthResponseData>(`${this.myUrl}${this.apiKey}` , 
        {
            email: email,
            password: password,
            returnSecureToken: true
        } 
      ).pipe(
          catchError((errResp) => {
            let errorMessage ='An unknown error occurred'
            if(!errResp.error || !errResp.error.error){
                return throwError( errorMessage);
            }
            switch(errResp.error.error.message){
                case 'EMAIL_EXISTS':
                errorMessage = 'this email already exists'
            }
            return throwError( errorMessage)
          })
      )
    }
}