/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpClient,
  HttpErrorResponse,
  HttpBackend
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { StorageService } from 'app/service/storage.service';
import { jwtDecode } from "jwt-decode"; // Ajuste na importação de jwt-decode
import { IToken } from 'app/interface/token.interface';
import { environment } from 'environments/environment';

interface DecodedToken {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  private httpWithoutInterceptor: HttpClient;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private httpBackend: HttpBackend
  ) {
    this.httpWithoutInterceptor = new HttpClient(httpBackend);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.getData('token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token.token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const currentDate = new Date();

      if (expirationDate.getTime() < currentDate.getTime()) {
        return this.refreshToken(token.token).pipe(
          catchError(error => {
            console.log({ error: error });
            this.storageService.setData('token', null);
            this.storageService.setData('usuario', null);
            this.router.navigate(['/authentication/signin']);
            return throwError(error);
          }),
          switchMap((newToken: IToken) => {
            const clonedRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken.token}`,
              },
            });
            return next.handle(clonedRequest);
          }),
        );
      }

      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.token}`,
        },
      });

      return next.handle(clonedRequest).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
            this.storageService.setData('token', null);
            this.storageService.setData('usuario', null);
            this.router.navigate(['/authentication/signin']);
          }
          return throwError(error);
        }),
      );
    }

    return next.handle(request);
  }

  public refreshToken(token: any): Observable<IToken> {
    return this.httpWithoutInterceptor.post(`${environment.baseUrl}auth/refresh`, { token }).pipe(
      map((response: any) => {
        const token: IToken = {
          token: response.token
        }
        this.storageService.setData('token', token);
        return token;
      }),
      catchError(error => {
        console.log({ error2: error });
        return throwError(error);
      })
    );
  }
}
