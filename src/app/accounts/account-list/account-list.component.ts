import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Account } from '../account.model';
import { AccountsService } from '../accounts.service';
import { UsersService } from 'src/app/auth/users.service';


@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit, OnDestroy {

  isLoading = false;
  accounts: Account[] = [];
  private accountsSubscription: Subscription;
  totalAccounts = 0;
  accountsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isAuthenticated = false;
  private authStatusSubscription: Subscription;
  userId: string;

  constructor(public accountsService: AccountsService, private usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.usersService.getUserId();
    this.isAuthenticated = this.usersService.getAuthStatus();
    this.authStatusSubscription = this.usersService.getAuthStatusListner().subscribe(authStatus => {
      console.log(authStatus);
      this.isAuthenticated = authStatus;
      this.userId = this.usersService.getUserId();
    });
    if (this.isAuthenticated) {
      this.accountsService.getAccounts(this.accountsPerPage, this.currentPage);
    }
    this.accountsSubscription = this.accountsService.getAccountUpdateListner().subscribe((accountSubject) => {
      this.isLoading = false;
      this.accounts = accountSubject.accounts;
      this.totalAccounts = accountSubject.accountCount;
      this.accounts.forEach(acc => {
        let trxns = null;
        this.accountsService.getTrxns(acc.id).subscribe( response => {
          trxns = response.trxns;
          console.log('my trxns');
          console.log(trxns);
          acc.trxns = trxns;
        });
      });
    });
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.accountsService.deleteAccount(id).subscribe(() => {
      this.accountsService.getAccounts(this.accountsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.accountsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.accountsService.getAccounts(this.accountsPerPage, this.currentPage);
  }
}
