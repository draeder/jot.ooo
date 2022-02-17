import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private auth: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() { }

  public get auth$() {
    return this.auth.asObservable();
  }
  
  public set auth$(auth: any) {
    this.auth.next(auth);
  }
}
