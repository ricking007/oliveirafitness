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
import { AuthService as AuthService2, User } from '@core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
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
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
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

          const user: User = {
            id: usuario?.id_usuario,
            img: '',
            username: usuario?.dc_email,
            password: usuario?.dc_senha,
            firstName: usuario?.no_nome,
            lastName: usuario?.no_nome,
            token: response.token
          }

          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);


          this.storageService.setData("permissoes", permissao);
          if (this.storageService.setData("token", token)) {
            this.storageService.setData("location", 'true');
            this.router.navigate(['/dashboard/dashboard1']);
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
