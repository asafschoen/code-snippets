import {Injectable} from '@angular/core';

const Web3 = require('web3'); // tslint:disable-line

declare let require: any;
declare let window: any;

const tokenAbi = require('./tokenContract.json');

@Injectable()
export class ContractsService {
  public _account: string = null;
  private _web3: any;

  private _tokenContract: any;
  private _tokenContractAddress = '0x2ef76b22c586843d69d0b4eed1b6b72df2e6623f'; // '0x82811c68e74b171b69754b29c597a498ff167a9c';

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);

      if (this._web3.version.network !== '4') {
        alert('Please connect to the Rinkeby network');
      }
    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this._tokenContract = new this._web3.eth.Contract(tokenAbi, this._tokenContractAddress);
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }

          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        });
      }) as string;

      this._web3.eth.defaultAccount = this._account;
    }

    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();

    return this.getBalanceOf(account);
  }

  public async getBalanceOf(account): Promise<number> {
    return new Promise((resolve, reject) => {
      this._tokenContract.methods.balanceOf(account).call((err, result) => {
        if (err != null) {
          reject(err);
        }

        return resolve(result);
      });
    }) as Promise<number>;
  }

  public async transferFrom(from, to, amount): Promise<number> {
    return new Promise((resolve, reject) => {
      return this._tokenContract.methods.transfer(to, amount)
        .send({from: from}).then( function (err, transactionHash) {
          console.log('@@@@@@' + transactionHash);
        });
    }) as Promise<number>;
  }
}
