import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { AccountCreateComponent } from './accounts/account-create/account-create.component';
import { AuthGuard } from './auth/auth.guard';
import { TransactionComponent } from './accounts/transaction/transaction.component';

const routes: Routes = [
  {path: '', component: AccountListComponent},
  {path: 'create', component: AccountCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:accountId', component: AccountCreateComponent, canActivate: [AuthGuard]},
  {path: 'edit/:accountId/:trxnType', component: TransactionComponent, canActivate: [AuthGuard]},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
