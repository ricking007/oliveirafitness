import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AplicationErrorHandle } from './handler.service';
import { Interceptor } from './interceptor.service';
@NgModule({
    providers: [
        AplicationErrorHandle,
        Interceptor,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: Interceptor,
            multi: true,
        },
        {
            provide: ErrorHandler,
            useClass: AplicationErrorHandle
        },
    ],
})
export class InterceptorModule { }
//{provide: ErrorHandler, useClass: AplicationErrorHandle },
