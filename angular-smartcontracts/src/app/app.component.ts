import {Component} from '@angular/core';
import {ContractsService} from './services/contracts/contracts.service';
interface Account {id: string; name: string; hash: string; balance?: number; }
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public balance: number;
  public shimonBalance: number;
  public accounts: Account[];
  public userAccount: Account;

  constructor(private cs: ContractsService) {
    this.accounts = [];
    this.accounts.push({id: 'a.schoen@f5.com', name: 'Asaf Schoen', hash: '0xc4DF943Ac8BEf242cd57FdbC17d8273aDdf5dd3C'});
    this.accounts.push({id: 's.sujaz@f5.com', name: 'Shimon Sujaz', hash: '0x3F442b94a11Fb126FC1E0297921Df26e0B6D4Da6'});
    cs.getAccount().then(userAccountHash => {
      this.userAccount = this.accounts.filter(account => account.hash === userAccountHash)[0];
    });
    this.accounts.forEach(account => {
      cs.getBalanceOf(account.hash).then(accountBalance => {
        account.balance = accountBalance;
      });
    });
    cs.getUserBalance().then(balance => this.balance = balance);
    cs.getBalanceOf('0x3F442b94a11Fb126FC1E0297921Df26e0B6D4Da6').then(balance => this.shimonBalance = balance);
  }

  transferToShimon() {
    this.cs.transferFrom('0xc4DF943Ac8BEf242cd57FdbC17d8273aDdf5dd3C', '0x3F442b94a11Fb126FC1E0297921Df26e0B6D4Da6', 1)
      .then(result => {
        console.log('!@#!@#!#' + result);
      });
  }
}
