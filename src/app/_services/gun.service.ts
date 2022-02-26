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

export interface SignUpRequest extends LoginRequest { }

@Injectable({
  providedIn: 'root'
})
export class GunService {
  public gun: any;
  private sea: any;
  private user: any;
  // private entangler: any;
  // private auth: any;

  constructor(private userService: UserService) {
    this.gunOnReady().then(() => {
      // Login with Sear Pair
      this.createSeaPair().then((seaPair) => {
        this.loginWithSeaPair(seaPair);
      });
    });
  }

  public gunOnReady() {
    return new Promise((resolve, reject) => {
      this.gun = new GUN({ peers: environment.peerUrls, localStorage: true });
      this.sea = GUN.SEA;
      this.user = this.gun.user().recall({ sessionStorage: true });
      this.gun.on('auth', (ack: any) => {
        if (ack) {         
          this.userService.auth$ = ack;
          // this.entangler = this.gun.entangler(ack.sea);
        } else {
          reject(false);
        }
      });
      resolve(true);
    })
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

  public getUserSeaPair(): Promise<IGunCryptoKeyPair | any> {
    return new Promise((resolve, reject) => {
      let pair = sessionStorage.getItem('pair');
      if(pair) {
        pair = JSON.parse(pair);
        resolve(pair)
      } else {
        reject(new Error('No pair found'));
      }
    })
  }

  public createQRimage() {
    this.getUserSeaPair().then((pair) => {
      console.log(pair);
    });
  }

  public createPublicStore(storeName: string, data: any) {
    this.gun.get(storeName).put(data);
  }

  /**
   * save data to gun store using a store name
   * @param storeName store name
   * @param data data to be saved
   * @param key key to be saved
   * @param customSeaPair custom sea pair if not using user's sea Pair
   */
  public createPrivateStore(storeName: string, key: string, data: any, customSeaPair?: IGunCryptoKeyPair) {
    return new Promise((resolve, reject) => {
      this.encryptData(data, customSeaPair).then((encryptedData: any) => {
        try {
          const data = this.user.get(`${storeName}`).put({[key]: encryptedData});
          this.user.get(`${storeName}`).set(data).then((stored: any) => {
            resolve(!!stored);
          });
        } catch (error) {
          reject(error);
        }
      }).catch((err) => { reject(err) });
    });
  }

  /**
   * get sea encrypted data from gun store 
   * @param storeName store name
   * @param customSeaPair custom sea pair to decrypt or use the users sea pair
   * @param key key to get
   * @returns Promise decrypted data
   */
  public getPrivateStoreData(storeName: string, key: string, customSeaPair?: IGunCryptoKeyPair): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user.get(`${storeName}`).get(key).once((data: any) => {
        if(!data) {
          reject(new Error(`No data found with key [${key}] in store [${storeName}]`));
          return;
        }
        this.decryptData(data, customSeaPair).then((decryptedData: any) => {
          console.log('decrypted: ', data);
          resolve(decryptedData);
        }).catch(() => { reject(new Error(!data? 'No data to decrypt':  'Error while data decryption')) });
      });
    })
  }

  public getPublicStoreData(storeName: string) {
    return this.gun.get(storeName).val();
  }

  /**
   * encrypt data with either the saved user sea pair or the custom pair
   * @param data data to encrypt
   * @param customSeaPair optional custom pair
   * @returns Promise encrypted data
   */
  private encryptData(data: any, customSeaPair?: IGunCryptoKeyPair) {
    return new Promise((resolve, reject) => {
      if(customSeaPair) {
        this.encrypt(data, customSeaPair).then((encryptedData) => {
          resolve(encryptedData);
        }).catch((error) => { reject(error) });
      } else {
        this.getUserSeaPair().then((pair) => {
          this.encrypt(data, pair).then((encryptedData) => {
            resolve(encryptedData);
          }).catch((error) => { reject(error) });
        });
      }
    })
  }

  /**
   * decrypt data with either the saved user sea pair or the custom pair
   * @param encryptedData encrypted data
   * @param customSeaPair optional custom pair
   * @returns Promise decrypted data
   */
  private decryptData(encryptedData: any, customSeaPair?: IGunCryptoKeyPair) {
    return new Promise((resolve, reject) => {
      if(!encryptedData) { reject(null); return; }
      if(customSeaPair && customSeaPair?.pub) {
          this.decrypt(encryptedData, customSeaPair).then((data) => {
            resolve(data);
          }).catch((error) => { reject(error) });
      } else {
        this.getUserSeaPair().then((pair) => {
          this.decrypt(encryptedData, pair).then((data) => {
            resolve(data);
          }).catch((error) => { reject(error) });
        })
      }
    })
  }

  /**
   * decrypt data
   * @param encryptedData data to be decrypted
   * @param pair SEA pair
   * @returns decrypted data
   */
  private decrypt(encryptedData: any, pair: IGunCryptoKeyPair) {
    return new Promise((resolve, reject) => {
      if(!encryptedData || !pair?.pub) { reject(null); return; }
      this.sea.verify(encryptedData, pair.pub).then((verifiedData: any) => {
        this.sea.decrypt(verifiedData, pair).then((decrypted: any) => {
          resolve(decrypted);
        }).catch((error: any) => {
          console.error('Error decrypting data', error);
          reject(error);
        });
      }).catch((error: any) => {
        console.error('Error decrypting data', error);
        reject(error);
      });
    })
  }

  /**
   * encrypt data
   * @param data data to be encrypted
   * @param pair SEA pair
   * @returns encrypted data
   */
  private encrypt(data: any, pair: IGunCryptoKeyPair) {
    return new Promise((resolve, reject) => {
      this.sea.encrypt(data, pair).then((encrypted: any) => {
        this.sea.sign(encrypted, pair).then((encryptedAndSignedData: any) => {
          resolve(encryptedAndSignedData);
        });
      }).catch((error: any) => { 
        console.error('Error encrypting data', error);
        reject(error);
      });
    })
  }
}
