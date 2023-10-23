/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IRequest } from 'app/interface/request.interface';
import { IResponse } from 'app/interface/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(
    private httpService: HttpService
    ) {
     }

     public async get(request: IRequest): Promise<IResponse> {
      return new Promise((resolve, reject) => {
        this.httpService.get(request).subscribe(
          (result: IResponse) => resolve(result),
          (error: any) => reject(error)
        );
      });
    }

    public async post(request: IRequest): Promise<IResponse> {
      const observable = request.isUpdate
        ? this.httpService.put(request)
        : this.httpService.post(request);

      return new Promise((resolve, reject) => {
        observable.subscribe(
          (result: IResponse) => resolve(result),
          (error: any) => reject(error)
        );
      });
    }

    public async delete(request: IRequest): Promise<IResponse> {
      return new Promise((resolve, reject) => {
        this.httpService.delete(request).subscribe(
          (result: IResponse) => resolve(result),
          (error: any) => reject(error)
        );
      });
    }

}
