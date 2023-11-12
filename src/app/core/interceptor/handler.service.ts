/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ErrorHandler, Injector } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AplicationErrorHandle extends ErrorHandler {

    constructor(
        private injector: Injector,
        ) {
        super();
    }

    override handleError(errorResponse: any) {
        console.log(errorResponse);
        if (errorResponse instanceof HttpErrorResponse) {
            const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse.error;
            console.log({AplicationErrorHandle: error})
            if (errorResponse.status === 401) {
                console.log("erro http response");
                //this.goToLogin();
            }

            //   if (errorResponse.status === 401 && error.error === 'token_has_been_blacklisted') {
            //     this.goToLogin();
            //   }

        }

        super.handleError(errorResponse);
    }

    // goToLogin(): void {
    //     console.log("chegou aqui");
    //     const router = this.injector.get(Router);
    //     this.storageService.clear();
    //     router.navigate(['/']);
    // }

}
