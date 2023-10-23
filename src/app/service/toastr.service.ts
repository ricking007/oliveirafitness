
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class ToastService {
    constructor(public toastr: ToastrService) { }

    success(message: string | undefined, title: string | undefined) {
        this.toastr.success(title,message);
    }

    info(message: string | undefined, title: string | undefined) {
        this.toastr.info(title,message);
    }

    warning(message: string | undefined,title = null) {
        this.toastr.warning(title || undefined,message);
    }

    error(message: string | undefined, title: string | undefined) {
        this.toastr.error(title,message);
    }

    // Custom Type
    typeCustom(message: string) {
        this.toastr.success('<span class="text-danger">'+message+'</span>', undefined, { enableHtml: true });
    }

    //Progress bar
    progressBar(message: string | undefined, title: string | undefined) {
        this.toastr.info(message, title, { "progressBar": true });
    }

    // Timeout
    timeout() {
        this.toastr.error('I do not think that word means what you think it means.', 'Timeout!', { "timeOut": 2000 });
    }


    //Dismiss toastr on Click
    dismissToastOnClick() {
        this.toastr.info('We do have the Kapua suite available.', 'Turtle Bay Resort', { "tapToDismiss": true });
    }
    // Remove current toasts using animation
    clearToast() {
        this.toastr.clear()
    }

    // Show close button
    showCloseButton() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { closeButton: true });
    }
    // Enable  HTML
    enableHtml() {
        this.toastr.info('<i>Have fun <b>storming</b> the castle!</i>', 'Miracle Max Says', { enableHtml: true });
    }
    // Title Class
    titleClass() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { titleClass: 'h3' });
    }
    // Message Class
    messageClass() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { messageClass: 'text-uppercase' });
    }

}
