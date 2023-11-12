import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { environment } from 'environments/environment';
import { Categoria } from './categoria.model';
import { IRequest } from 'app/interface/request.interface';
@Injectable()
export class CategoriaService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = environment.baseUrl + 'categoria';
  isTblLoading = true;
  dataChange: BehaviorSubject<Categoria[]> = new BehaviorSubject<
    Categoria[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Categoria;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): Categoria[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllCategorias(request: IRequest): void {
    this.subs.sink = this.httpClient
      .get<Categoria[]>(request.url)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addCategoria(advanceTable: Categoria): void {
    this.dialogData = advanceTable;

    this.httpClient.post(this.API_URL, advanceTable)
      .subscribe({
        next: (data) => {
          console.log(data)
          this.dialogData = advanceTable;
        },
        error: (error: HttpErrorResponse) => {
           console.log(error)
        },
      });
  }
  updateCategoria(advanceTable: Categoria): void {
    this.dialogData = advanceTable;

    this.httpClient.put(this.API_URL + advanceTable.id_categoria, advanceTable)
        .subscribe({
          next: (data) => {
            console.log(data)
            this.dialogData = advanceTable;
          },
          error: (error: HttpErrorResponse) => {
            console.log(error)
          },
        });
  }
  deleteCategoria(id: number): void {
    this.httpClient.delete(this.API_URL + id)
        .subscribe({
          next: (data) => {
            console.log(data)
            console.log(id);
          },
          error: (error: HttpErrorResponse) => {
             console.log(error)
          },
        });
  }
}
