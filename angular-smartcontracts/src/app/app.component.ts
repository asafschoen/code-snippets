import {Component} from '@angular/core';
import {ContractsService} from './services/contracts/contracts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public balance: number;
  public shimonBalance: number;

  constructor(private cs: ContractsService) {
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
