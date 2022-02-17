import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private state: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  
}
