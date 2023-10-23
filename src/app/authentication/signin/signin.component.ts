/* eslint-disable no-var */
/* eslint-disable prefer-const */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { LoadingService } from 'app/service/loading.service';
import { StorageService } from 'app/service/storage.service';
import { SwalAlertService } from 'app/service/swal-alert.service';
import { IRequest } from 'app/interface/request.interface';
import { ApiUrl } from 'app/enums/api.enum';
import { Permissao, Usuario } from 'app/interface/usuario.interface';
import { IToken } from 'app/interface/token.interface';
import { Messages } from 'app/enums/messages.enum';
import { AuthService as AuthService } from 'app/service/auth.service';
import { AuthService as AuthService2 } from '@core';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authService2: AuthService2,
    private swalAlertService: SwalAlertService,
    private storageService: StorageService,
    private loadingService: LoadingService,
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      dc_email: ['', Validators.required],
      dc_senha: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.loadingService.show();
    const request: IRequest =
    {
      url: ApiUrl.LOGIN,
      options: this.authForm.value
    }
    this.authService.loginDo(
      request
    ).then((response) => {
      this.loadingService.close();
      if (response.success) {
        let permissao: Permissao[] | undefined = response.permissao;
        let usuario: Usuario | undefined;
        usuario = response.usuario;
        console.log({ response: response })
        if (this.storageService.setData("usuario", usuario)) {
          var time = new Date();
          var create_at = new Date();
          create_at.setHours(time.getHours() + 1); // Adiciona 2 horas
          let token: IToken = {
            token: response.token,
            type: "JWT",
            create_at: create_at
          }


          //código do template
          this.subs.sink = this.authService2
            .login(this.f['username'].value, this.f['password'].value)
            .subscribe({
              next: (res) => {
                if (res) {
                  if (res) {
                    const token = response.token;
                    if (token) {
                      this.router.navigate(['/dashboard/dashboard1']);
                    }
                  } else {
                    this.error = 'Invalid Login';
                  }
                } else {
                  this.error = 'Invalid Login';
                }
              },
              error: (error) => {
                this.error = error;
                this.submitted = false;
                this.loading = false;
              },
            });


          this.storageService.setData("permissoes", permissao);
          if (this.storageService.setData("token", token)) {
            this.storageService.setData("location", 'true');
            this.router.navigate(['/admin/dashboard/main']);
          }
        }

      } else {
        this.swalAlertService.error(Messages.ERRO, response.message);
      }
    }).catch(err => {
      this.loadingService.close();
      this.swalAlertService.error(Messages.ERRO, err);
      console.log({ error: err });
    });
  }
}
