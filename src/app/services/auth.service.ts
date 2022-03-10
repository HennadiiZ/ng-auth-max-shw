import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs"
import { User } from "../models/user.model";
export interface AuthResponseData{
    kind?: string;
    idToken: string;
    email: string;	
    refreshToken: string;	
    expiresIn: string;	
    localId: string;	
    registered?: boolean;
}

// 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]'
@Injectable({providedIn: 'root'})
export class AuthService{

    myUrlWithKey = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]'
    myUrlSignUp = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
    myUrlSignIn = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
    apiKey = 'AIzaSyDV1YPhVjxwFIu9_Tzds1UJeheYrvyDISs'
  
    user = new Subject<User>();

    constructor(private http: HttpClient){}

    signup(email: string, password: string){
        return  this.http.post<AuthResponseData>(`${this.myUrlSignUp}${this.apiKey}` , 
        {
            email: email,
            password: password,
            returnSecureToken: true
        } 
      ).pipe(catchError(this.handleError),tap(response=>{
        const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
        const user = new User(response.email, response.localId, response.idToken, expDate);
        this.user.next(user);
      }));
    }

    login(email: string, password: string){
        return  this.http.post<AuthResponseData>(`${this.myUrlSignIn}${this.apiKey}` , 
        {
            email,
            password,
            returnSecureToken: true
        } 
      ).pipe(catchError(this.handleError))
    }

    //private handleAuthentication(email: string, token: string, expiresIn: number){}

    private handleError(errResp: HttpErrorResponse){
        let errorMessage ='An unknown error occurred'
        if(!errResp.error || !errResp.error.error){
            return throwError( errorMessage);
        }
        switch(errResp.error.error.message){
            case 'EMAIL_EXISTS':
            errorMessage = 'this email already exists'
            break;
            case 'EMAIL_NOT_FOUND':
            errorMessage = 'EMAIL_NOT_FOUND'
            break;
            case 'INVALID_PASSWORD':
            errorMessage = 'INVALID_PASSWORD'
            break;
            case 'USER_DISABLED':
            errorMessage = 'USER_DISABLED'
            break;
        }
        return throwError( errorMessage)
    }
}