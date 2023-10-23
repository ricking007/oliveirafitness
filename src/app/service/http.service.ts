/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { catchError, map } from 'rxjs/operators';
import { IToken } from 'app/interface/token.interface';
import { environment } from 'environments/environment';
import { IRequest } from 'app/interface/request.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  baseUrl: string = environment.baseUrl;
  usuario: any;
  // usuario: IUsuario;
  token: IToken = {};
  reqHeader: HttpHeaders;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    if (this.storageService.getData("usuario")) {
      this.usuario = this.storageService.getData("usuario");
    }
    this.reqHeader = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  get(request: IRequest): Observable<any> {
    let finalUrl = this.baseUrl + request.url;
    if (request.urlLivre) {
      finalUrl = request.url;
    }
    if (request.id) {
      finalUrl = finalUrl + "/" + request.id;
    }
    return this.http.get(finalUrl, {
      params: request.options
    }).pipe(
      map((response: any) => this.extractData(response)), // Correção aqui para 'any'
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  post(request: IRequest): Observable<any> {
    let finalUrl = this.baseUrl + request.url;
    return this.http.post(finalUrl, request.options)
      .pipe(
        map((response: any) => this.extractData(response)), // Correção aqui para 'any'
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  put(request: IRequest): Observable<any> {
    let finalUrl = this.baseUrl + request.url + '/' + request.id;
    return this.http.put(finalUrl, request.options)
      .pipe(
        map((response: any) => this.extractData(response)), // Correção aqui para 'any'
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  delete(request: IRequest): Observable<any> {
    let finalUrl = this.baseUrl + request.url + "/" + request.id;
    return this.http.delete(finalUrl, request.options)
      .pipe(
        map((response: any) => this.extractData(response)), // Correção aqui para 'any'
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  upload(file: File, pessoa: number): Observable<HttpEvent<any>> {
    let finalUrl = this.baseUrl + '/pessoa/avatar/' + pessoa;
    console.log(file);
    const formData: FormData = new FormData();
    formData.append('image', file);
    const req = new HttpRequest('POST', finalUrl, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    let finalUrl = this.baseUrl + '/avatar';
    return this.http.get(finalUrl);
  }

  private extractData(response: any) {
    return response; // Não precisa mais desembrulhar 'body'
  }

  handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = '';
    if (errorResponse instanceof HttpErrorResponse) {
      errorMessage += ` HttpErrorResponse: ${errorResponse.error.message}`;
    }
    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage += ' An error occurred:' + errorResponse.error.message;
    } else {
      errorMessage += ` Backend returned code ${errorResponse.status}, ` + `body was: ${errorResponse.error}`;
    }
    return throwError(errorResponse);
  }

}
