import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs"
import { User } from "../models/user.model";
import { RecipeService } from "../recipes/recipe.service";
import { Router } from "@angular/router";
export interface AuthResponseData{
    kind?: string;
    idToken: string;
    email: string;	
    refreshToken: string;	
    expiresIn: string;	
    localId: string;	
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{

    myUrlWithKey = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]'
    myUrlSignUp = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
    myUrlSignIn = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
    apiKey = 'AIzaSyDV1YPhVjxwFIu9_Tzds1UJeheYrvyDISs'
  
    // user = new Subject<User>();
    // user = new BehaviorSubject<User>(null);
    user = new BehaviorSubject<User | any >(null);


    constructor(
        private http: HttpClient, 
        private recipeService: RecipeService,
        private router: Router
    ){}

    signup(email: string, password: string){
        return  this.http.post<AuthResponseData>(`${this.myUrlSignUp}${this.apiKey}` , 
        {
            email: email,
            password: password,
            returnSecureToken: true
        } 
      ).pipe(catchError(this.handleError),tap(response=>{
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      }));
    }

    login(email: string, password: string){
        return  this.http.post<AuthResponseData>(`${this.myUrlSignIn}${this.apiKey}` , 
        {
            email,
            password,
            returnSecureToken: true
        } 
      ).pipe(catchError(this.handleError),tap(response=>{
        this.handleAuthentication(response.email, response.localId, response.idToken, +response.expiresIn);
      }))
    }

    private handleAuthentication(email: string, userId: string,token: string, expiresIn: number){
        const expDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email, 
            userId,
            token,
            expDate, 
        );
        this.user.next(user);
        localStorage.setItem('userData', JSON.stringify(user));
    }

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

    // autoLogin(){
    //     const userData = JSON.parse(localStorage.getItem('userData'));
    //     if(!userData){
    //         return;
    //     }
    //     const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate) );
    // }
    
    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
    }
}

