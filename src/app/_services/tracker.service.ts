import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TRACKER_URL } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(
    private http: HttpClient
  ) { }

  getTrackers(): Observable<any> {
    return this.http.get(TRACKER_URL)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError<any>('error'))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
