/* eslint-disable no-var */
/* eslint-disable prefer-const */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'app/service/auth.service';
import { SwalAlertService } from 'app/service/swal-alert.service';
import { StorageService } from 'app/service/storage.service';
import { LoadingService } from 'app/service/loading.service';
import { IRequest } from 'app/interface/request.interface';
import { ApiUrl } from 'app/enums/api.enum';
import { Permissao, Usuario } from 'app/interface/usuario.interface';
import { Messages } from 'app/enums/messages.enum';
import { IToken } from 'app/interface/token.interface';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  hide = true;
  chide = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private swalAlertService: SwalAlertService,
    private storageService: StorageService,
    private loadingService: LoadingService,
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      no_empresa: ['', Validators.required],
      nm_cnpj: ['', Validators.required], // Exemplo de validação de CNPJ
      dc_email: ['', Validators.required],
      nm_celular: ['', Validators.required],
      dc_responsavel: ['', Validators.required],
      dc_senha: ['', Validators.required],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loadingService.show();
    const request: IRequest =
    {
      url: ApiUrl.CADASTRO,
      options: this.authForm.value
    }
    this.authService.loginDo(
      request
    ).then((response) => {
      console.log({response: response})
      this.loadingService.close();
      if (response.success) {
          this.login();
      } else {
        this.swalAlertService.error(Messages.ERRO, response.message);
      }
    }).catch(err => {
      this.loadingService.close();
      this.swalAlertService.error(Messages.ERRO, err);
      console.log({ error: err });
    });
  }

  login() {
    this.submitted = true;
    // stop here if form is invalid
    // if (this.authForm.invalid) {
    //   return;
    // } else {
    //   this.router.navigate(['/admin/dashboard/main']);
    // }
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
      this.swalAlertService.error(Messages.ERRO,err);
      console.log({ error: err });
    });
  }
}
