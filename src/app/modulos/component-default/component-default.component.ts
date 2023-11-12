/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { Messages } from 'app/enums/messages.enum';
import { ICamposDefault, IComponentDefault } from 'app/interface/component.default.interface';
import { IRequest } from 'app/interface/request.interface';
import { IToken } from 'app/interface/token.interface';
import { environment } from 'environments/environment';
import { ComponentDefaultFormComponent } from './component-default-form/component-default-form.component';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from "ngx-spinner";
import { CrudService } from 'app/service/crud.service';
import { LoadingService } from 'app/service/loading.service';
import { StorageService } from 'app/service/storage.service';
import { SwalAlertService } from 'app/service/swal-alert.service';
import { ToastService } from 'app/service/toastr.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-default',
  templateUrl: './component-default.component.html',
  styleUrls: ['./component-default.component.scss']
})
export class ComponentDefaultComponent {
  @Input() item?: IComponentDefault = {};
  @Input() reload?: boolean = false;
  // @Input() reload?: boolean = false;

  rows: any[] = [];
  filter = '';
  pag: Number = 1;
  count: Number = 8;
  total!: number;
  component: boolean = true;
  label: string = "Novo Cadastro";
  icon: string = "icon-plus-circle feather";
  objeto: any = {};
  p!: number;

  constructor(
    private crudService: CrudService,
    private swalAlertService: SwalAlertService,
    public activeModal: NgbActiveModal,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    if (this.item?.filter != undefined) {
      this.getAll();
    }
  }

  changeComponent() {
    this.component = !this.component;
    this.change();
  }

  async edit(item: any) {
    if (this.item?.id_update_name) {
      this.item.id_update_id = item[this.item.id_update_name];
    }

    await this.item?.inputs?.map((element: { inputs: any[]; }) => {
      element.inputs.forEach((el: { value: any; key: string | number; isDateType: any; }) => {
        el.value = item[el.key]
        if (el.isDateType) {
          const dt_data = new DatePipe('en-US').transform(item[el.key], 'ddMMyyyy')
          el.value = dt_data;
        }
      })
    });
    this.openModal(item);
  }

  openModal(item: ICamposDefault) {
    let modalRef = this.modalService.open(ComponentDefaultFormComponent, { backdrop: 'static', size: this.item?.size_modal_form, keyboard: false, centered: true });
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.formFields = this.item?.inputs;
    if (item) {
      modalRef.componentInstance.row = item;
    }
    modalRef.result.then((result: any) => {
      console.log(result);
    }, (reason: any) => {
      this.getAll();
      this.item!.id_update_id = null;
      console.log(reason);
    });
  }

  change() {
    if (this.component) {
      this.objeto = {};
    }
    this.openModal({});
  }

  async getAll() {
    this.rows = [];
    this.spinner.show();
    let options: any = {
      tabela: this.item?.tabela,
      entidade: this.item?.entidade,
      joins: this.item?.joins != undefined ? JSON.stringify(this.item.joins) : "",
      counts: this.item?.counts != undefined ? JSON.stringify(this.item.counts) : "",
      orderBy: this.item?.orderBy != undefined ? JSON.stringify(this.item.orderBy) : "",
      groupBy: this.item?.groupBy != undefined ? JSON.stringify(this.item.groupBy) : "",

    };
    const request: IRequest =
    {
      url: this.item?.rota ? this.item?.rota : '',
      authenticate: true,
      options: options,
      isNotLoad: true,
    }
    await this.crudService.get(request).then(response => {
      this.spinner.hide();
      // response.data.map((element => {
      //   let row: any = {};
      //   this.item.fields.forEach(el => {
      //     row[el.model] = element[el.model]
      //   });
      //   this.rows.push(row);
      // }));
      this.rows = response.data;
      this.total = this.rows.length;
    }).catch((err: { status: number; }) => {
      this.spinner.hide();
      if (err.status < 500) {
        this.activeModal.close(false);
      } else {
        this.swalAlertService.error(Messages.ERRO, Messages.SERVICO_INDISPONIVEL);
      }
      console.log({ error: err });
    });
  }

  async delete(item: any, key: any) {
    this.swalAlertService.confirmText(Messages.ATENCAO_EXCLUIR, Messages.EXCLUIR_MESSAGE).then((value: any) => {
      if (value) {
        //this.loadingService.show();
        const request: IRequest =
        {
          url: this.item?.rota + "-delete",
          authenticate: true,
          options: {
            menu: this.item?.menu,
            tabela: this.item?.tabela,
            id: this.item?.id_update_name ? item[this.item.id_update_name] : null,
          },
        }
        this.crudService.post(request).then(response => {
          //this.loadingService.close();
          this.toastService.success(Messages.SUCCESS, response.message);
          const index = this.rows.indexOf(key, 0);
          this.rows.splice(index, 1);
        }).catch((err: any) => {
          //this.loadingService.close();
          this.swalAlertService.error(Messages.ERRO, Messages.SERVICO_INDISPONIVEL);
          this.activeModal.close(false);
          console.log({ error: err });
        });
      }
    }).catch((err: any) => {
      console.log({ error: err });
    });
  }

  print() {
    const link = document.createElement('a');
    const tenant: string = this.storageService.getData("tenant");
    const token: IToken = this.storageService.getData("token");
    let url: string | undefined = environment.baseUrl + tenant + "/" + this.item?.print?.rota;
    if (this.item?.print?.campo_id) {
      url = url + "?" + this.item.print.campo_id + "=" + this.item.print.id
    }
    url = url + '&token=' + token.token;
    link.href = url;
    link.target = '_blank';
    if (this.item?.print?.isDownload) {
      link.download = 'download';
    }
    link.click()
  }

  close() {
    if (this.reload) {
      this.activeModal.dismiss(true);
    } else {
      this.activeModal.dismiss(false);
    }
  }
}
