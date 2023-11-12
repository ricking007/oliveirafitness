/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interceptor } from './interceptor.service';
import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, flatMap, tap } from "rxjs/operators";
import { StorageService } from 'app/service/storage.service';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Refresh implements HttpInterceptor {

    constructor(
        private http: HttpClient,
        private tokenInterceptor: Interceptor,
        private storageService: StorageService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(
                catchError(error => {
                    const responseError = error as HttpErrorResponse;
                    if (responseError.status === 401) {
                        return this.http.post<any>(
                            environment.baseUrl + this.storageService.getData('tenant') + '/auth/refresh',
                            {})
                            .pipe(
                                tap(response => localStorage.setItem('token', response.token)),
                                flatMap(() => this.tokenInterceptor.intercept(req, next))
                            );
                    }
                    return throwError(error);
                })
            );
    }

}
