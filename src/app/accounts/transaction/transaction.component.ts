import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AccountsService } from '../accounts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UsersService } from 'src/app/auth/users.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;
  mode = 'credit';
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
      'amount': new FormControl(null, {
        validators: [Validators.required]
      }),
      'desc': new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('accountId') && paramMap.has('trxnType')) {
        this.accountId = paramMap.get('accountId');
        this.mode = paramMap.get('trxnType');
      }
    });
  }

  onSaveTransaction() {
    this.isLoading = true;
    if (this.form.invalid){
      return;
    }
    console.log(this.form);
    if (this.mode === 'credit')
    {
      console.log('credit');
      this.accountsService.credit(this.accountId, this.form.value.amount, this.form.value.desc);
    }else if (this.mode === 'debit'){
      console.log('debit');
      this.accountsService.debit(this.accountId, this.form.value.amount, this.form.value.desc);
    }
    this.form.reset();
    this.isLoading = false;
  }
}
