/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { IRequest } from 'app/interface/request.interface';
import { IResponse } from 'app/interface/response.interface';
import { IToken } from 'app/interface/token.interface';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUrl: string | undefined;

  constructor(
    private httpService: HttpService,
    private storageService: StorageService,
    private http: HttpClient,
    private router: Router) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
        }
      });
    }

  getCurrentUrl(): string {
    return this.currentUrl || '';
  }

  setCurrentUrl() {
    console.log({currentUrl: this.currentUrl})
    this.storageService.setData("url", this.currentUrl);
  }

  public async script(request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const response = this.httpService.get(request);
      const response$ = response.subscribe(
        result => {
          try {
            resolve(result);
          } catch (e) {
            reject(e);
          }
          response$.unsubscribe();
        },
        e => {
          reject(e);
          response$.unsubscribe();
        },
      );
    });
  }

  public loginDo(request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      this.httpService.post(request).subscribe(
        (result: IResponse) => {
          resolve(result);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }


  public async cadastro(request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const response = this.httpService.post(request);
      const response$ = response.subscribe(
        result => {
          try {
            resolve(result);
          } catch (e) {
            reject(e);
          }
          response$.unsubscribe();
        },
        e => {
          reject(e);
          response$.unsubscribe();
        },
      );
    });
  }

  public refreshToken(): Observable<IToken> {
    const refreshToken = this.storageService.getData('token').refreshToken;
    return this.http.post(`${environment.baseUrl}auth/refresh`, { refreshToken }).pipe(
      map((response: any) => {
        console.log({ response: response });
        const token: IToken = {
          token: response.token
        }
        this.storageService.setData('token', token);
        return token;
      }),
    );
  }


}
