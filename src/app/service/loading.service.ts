import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private spinner: NgxSpinnerService) { }

  public show(): void {
    this.spinner.show();
  }
  
  public close(){
    this.spinner.hide();
  }
}
