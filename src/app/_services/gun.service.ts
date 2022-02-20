import { Injectable } from '@angular/core';
import { IGunCryptoKeyPair } from 'gun/types/types';
import { UserService } from './user.service';
import * as GUN from 'gun/gun';
import 'gun/sea';
import { environment } from 'src/environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest extends LoginRequest {}

@Injectable({
  providedIn: 'root'
})
export class GunService {
  public gun: any;
  private sea: any;
  private user: any;
  private entangler: any;

  constructor(private userService: UserService) {
    this.gun = new GUN({ peers: environment.peerUrls });
    this.sea = GUN.SEA;
    this.user = this.gun.user().recall({sessionStorage: true});
    this.gun.on('auth', (ack: any) => {
      if(ack) {
        this.userService.auth$ = ack;
        // this.entangler = this.gun.entangler(ack.sea);
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
    });
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

  public getCurrentPair(): Promise<IGunCryptoKeyPair> {
    return new Promise((resolve, reject) => {
      this.gun.user().get('pair').then((pair: IGunCryptoKeyPair | any) => {
        !!pair? resolve(pair) : reject(new Error('No pair found'));
      });
    })
  }

  public createQRimage() {
    // this.entangler.QR.image().then((qr: any) => {
    //   console.log(qr);
    // });
    // this.getCurrentPair().then((pair: IGunCryptoKeyPair) => {
    //   console.log(pair);
    // });
    
  }
}
