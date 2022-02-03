import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
      tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log("Success :", event);
          }
        }),
      catchError((error: HttpErrorResponse) => {
      console.error('Error: ', error);
      return throwError(error);
    }));
  }
}
