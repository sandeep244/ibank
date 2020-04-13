import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountsService } from '../accounts.service';
import { Account } from '../account.model';
import { UsersService } from 'src/app/auth/users.service';



@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent implements OnInit, OnDestroy{

  enteredType = '';
  enteredAccountNumber = '';
  enteredAmount = '';
  isLoading = false;
  form: FormGroup;
  account: Account;
  private mode = 'create';
  private accountId: string;
  private authStatusSub: Subscription;


  constructor(public accountsService: AccountsService, public route: ActivatedRoute, public usersService: UsersService) {}

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  ngOnInit() {
    this.authStatusSub = this.usersService.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      'type': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'accountNumber': new FormControl(null, {
        validators: [Validators.required]
      }),
      'amount': new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('accountId')) {
        this.mode = 'edit';
        this.accountId = paramMap.get('accountId');
        this.isLoading = true;
        this.accountsService.getAccount(this.accountId).subscribe(res => {
          this.isLoading = false;
          this.account = {
            id: res.account._id,
            type: res.account.type,
            accountNumber: res.account.accountNumber,
            amount: res.account.amount,
            creator: res.account.creator,
            trxns: null
          };
          this.form.setValue({'type': this.account.type, 'accountNumber': this.account.accountNumber, 'amount': this.account.amount});
        });
      } else {
        this.mode = 'create';
        this.accountId = null;
      }
    });
  }

  onSaveAccount() {
    this.isLoading = true;
    if (this.form.invalid){
      return;
    }
    console.log(this.form);
    if (this.mode === 'create')
    {
      this.accountsService.addAccount(this.form.value.type, this.form.value.accountNumber, this.form.value.amount);
    }else {
      this.accountsService.updateAccount(this.accountId, this.form.value.type, this.form.value.accountNumber, this.form.value.amount);
    }
    this.form.reset();
  }

}
