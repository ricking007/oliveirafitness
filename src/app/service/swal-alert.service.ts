/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {

  constructor() { }

  // Success Type Alert
  success(title: string | undefined, message: string | undefined) {
    swal.fire(title, message, "success");
  }

  warning(title: string | undefined, message: string | undefined) {
    swal.fire(title, message, "warning");
  }

  error(title: string | undefined, message: string | undefined) {
    swal.fire(title, message, "error");
  }

  async confirmText(title: any, message: any, confirmMsg = "Sim, continuar!"): Promise<boolean> {
    let response = false;
    await swal.fire({
      // title: 'Do you want to save the changes?',
      // showDenyButton: true,
      // showCancelButton: true,
      // confirmButtonText: 'Save',
      // denyButtonText: `Don't save`,

      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmMsg,
      cancelButtonText: "Voltar"
    }).then((result) => {
      if (result.value) {
        response = true;
      }
      return response;
    });
    return response;
  }
}
