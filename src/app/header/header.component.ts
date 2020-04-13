import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UsersService } from '../auth/users.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private authStatusSubscription: Subscription;


  constructor(private usersService: UsersService) {}

  ngOnInit(){
   this.isAuthenticated = this.usersService.getAuthStatus();
   this.authStatusSubscription = this.usersService.getAuthStatusListner().subscribe(authStatus =>
    {
      this.isAuthenticated = authStatus;
    });
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

  logOut(){
    this.usersService.logOut();
  }

}
