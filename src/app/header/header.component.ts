import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub!: Subscription;
  isAuthenticated = false;
  constructor(
    private dataStorageService: DataStorageService,
    private auth: AuthService
  ) {}

  ngOnInit(){
    this.userSub = this.auth.user.subscribe(user =>{
        this.isAuthenticated = !!user;
        // console.log(this.isAuthenticated)
        console.log(!!user)
        console.log(!user)
    });
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  logout(){
    // this.isAuthenticated = false;
    this.auth.logout();
  }
}
