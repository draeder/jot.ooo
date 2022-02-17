import { Injectable } from '@angular/core';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { UserService } from './user.service';
import * as GUN from 'gun/gun';
import 'gun/sea';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const PEERS = [
  'http://localhost:3000/gun',
]

export interface SignUpRequest extends LoginRequest {}

@Injectable({
  providedIn: 'root'
})
export class GunService {
  public gun: any;
  private sea: any;
  private user: any;

  constructor(private userService: UserService) {
    this.gun = GUN();
    this.sea = GUN.SEA;
    this.user = this.gun.user().recall({sessionStorage: true});
    this.gun.on('auth', (ack: any) => {
      if(ack) {
        this.userService.auth$ = ack;
      }
    });
  }

  /**
   * Create a SEA pair
   * @returns Promise SEA pair
   */
  public createSeaPair(): Promise<IGunCryptoKeyPair> {
    return new Promise((resolve, reject) => {
      try {
        this.sea.pair().then((pair: IGunCryptoKeyPair | any) => {
          resolve(pair);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * login with SEA pair
   * @param pair generated SEA pair
   * @returns Promise
   */
  public loginWithSeaPair(pair: IGunCryptoKeyPair) {
    this.gun.user().auth(pair);
  }

  /**
   * logout the current user
   */
  public logout() {
    this.gun.user().leave();
    sessionStorage.clear();
    this.userService.auth$ = null;
    this.user = null;
  }
}
