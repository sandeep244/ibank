import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Account } from './account.model';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/accounts/';

@Injectable()
export class AccountsService {
  private accounts: Account[] = [];
  private accountsUpdated = new Subject<{accounts: Account[], accountCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getAccounts(accountsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${accountsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, accounts: any, maxAccounts: number}>(BACKEND_URL + queryParams)
    .pipe(map((accountData) => {
      return {accounts: accountData.accounts.map(account => {
        return {
          type: account.type,
          accountNumber: account.accountNumber,
          amount: account.amount,
          id: account._id,
          creator: account.creator,
          trxns: null
        };
      }), maxAccounts: accountData.maxAccounts
    };
  }))
    .subscribe((transformedAccountData) => {
      console.log('my transformed');
      console.log(transformedAccountData);
      this.accounts = transformedAccountData.accounts;
      this.accountsUpdated.next({accounts: [...this.accounts], accountCount: transformedAccountData.maxAccounts});
    });
  }

  getAccountUpdateListner() {
    return this.accountsUpdated.asObservable();
  }

  addAccount(type: string, accountNumber: string, amount: number) {
    const account: Account = {id: null, type: type, accountNumber: accountNumber, amount: amount, creator: null, trxns: null};
    console.log(account);
    this.http.post<{message: string, account: Account}>(BACKEND_URL, account)
    .subscribe((response) => {
      this.router.navigate(['/']);
    });
  }

  updateAccount(id: string, type: string, accountNumber: string, amount: number) {
    let accountData: Account | FormData;
    accountData = {id: id, type: type, accountNumber: accountNumber, amount: amount, creator: null, trxns: null};
    this.http.put<{message: string}>(BACKEND_URL + id, accountData)
    .subscribe((response) => {
      console.log(response.message);
      this.router.navigate(['/']);
    });
  }

  deleteAccount(id: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + id);
  }

  getAccount(id: string) {
    return this.http.get<{message: string, account: any}>(BACKEND_URL + id);
  }

  getTrxns(id: string) {
    return this.http.get<{message: string, trxns: any}>(BACKEND_URL + id + '/trxns');
  }

  credit(id: string, amount: number, desc: string) {
    console.log('id is ' + id);
    this.getAccount(id).subscribe(res => {
      console.log(res);
      const account = {
        id: res.account[0]._id,
        type: res.account[0].type,
        accountNumber: res.account[0].accountNumber,
        amount: res.account[0].amount,
        creator: res.account[0].creator,
        trxns: null
      };
      console.log(account);
      const postAmount = { amount: amount, desc: desc, oldAccount: account };
      this.http.post<{message: string}>(BACKEND_URL + id + '/credit', postAmount)
      .subscribe(response => {
        console.log(response.message);
        this.router.navigate(['/']);
      });
    });
  }

  debit(id: string, amount: number, desc: string) {
    this.getAccount(id).subscribe(res => {
      const account = {
        id: res.account[0]._id,
        type: res.account[0].type,
        accountNumber: res.account[0].accountNumber,
        amount: res.account[0].amount,
        creator: res.account[0].creator,
        trxns: null
      };
      console.log(account);
      const postAmount = { amount: amount, desc: desc, oldAccount: account };
      this.http.post<{message: string}>(BACKEND_URL + id + '/debit', postAmount)
      .subscribe(response => {
        console.log(response.message);
        this.router.navigate(['/']);
      });
    });
  }
}
