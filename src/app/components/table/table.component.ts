/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HexToRGB } from '@shared/utils/HexToRGB';
import { Messages } from 'app/enums/messages.enum';
import { ICamposDefault, IComponentDefault, IGradeButton } from 'app/interface/component.default.interface';
import { IRequest } from 'app/interface/request.interface';
import { ComponentDefaultFormComponent } from 'app/modulos/component-default/component-default-form/component-default-form.component';
import { CrudService } from 'app/service/crud.service';
import { SwalAlertService } from 'app/service/swal-alert.service';
import { ToastService } from 'app/service/toastr.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() rows: any[] = [];
  @Input() item: IComponentDefault = {};
  @Input() buttons: IGradeButton[] = [];
  pageSize: number = 12;
  @Input() title?: string = "Resultado";
  @Input() legendaSemRegistro?: string = "Nenhuma informação. Utilize o filtro para buscar.";
  @Input() exibeContainerVaziu1?: boolean = true;
  @Input() exibeContainerVaziu2?: boolean = false;
  @Input() btnNovoCadastro?: boolean = false;
  @Input() newButton?: IGradeButton = {};
  @Input() isFilter?: boolean = false;

  @Output() buttonEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() setImage: EventEmitter<any> = new EventEmitter<any>();

  _rows: any[] = [];

  filter = '';
  pag: Number = 1;
  total!: number;
  component: boolean = true;
  objeto: any = {};
  p: any;

  key: string = '';
  reverse: boolean = false;

  isReadMore = true;


  hexToRGB = HexToRGB;

  selectedButtonIndex = -1;

  constructor(private crudService: CrudService,
    private swalAlertService: SwalAlertService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    // public permissoesService: PermissoesService,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._rows = this.rows;
  }

  onOptionChanged(row: any, index: number) {
    if (this.selectFilter) { // Verificação aqui
      this.selectFilter.emit({
        row: row
      });
    }
    this.selectedButtonIndex = index;
  }


  onClear() {
    this.pageSize = 12;
  }

  countRows(row: string | any[]) {
    return row.length;
  }

  // openRowsItem(rows: any, labelPosition: any, processo: any) {
  //   let modalRef = this.modalService.open(ListItensComponent, { size: 'lg', centered: true });
  //   modalRef.componentInstance.rows = rows;
  //   modalRef.componentInstance.labelPosition = labelPosition;
  //   modalRef.componentInstance.processo = processo;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //   }, (reason) => {
  //     console.log(reason);
  //   });
  // }

  getFilter() {
    let arr: any = {};
    if (this.item && this.item.fields) {
      this.item.fields.forEach(element => {
        if (element.model !== undefined) { // Adicione esta linha
          arr[element.model] = this.filter;
        }
      });
    }
    return arr;
  }


  getField(field: any) {
    console.log({
      field: field
    })
  }

  // getFilter() {
  //   let arr: any = {};
  //   if (this.item) {
  //     this.item.fields.forEach(element => {
  //       arr[element.model] = this.filter
  //     })
  //   }
  //   return arr;
  // }

  ngOnChanges(): void {
    this._rows = this.rows;
    this.p = 1;
  }

  sort(key: string) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  showText() {
    this.isReadMore = !this.isReadMore
  }

  buttonClick(row = null, button:any, $event: any, i = null) {
    console.log(button);
    if (button.id == "edit") {
      this.edit(row);
    } else if (button.id == "delete") {
      this.delete(row, i);
    } else {
      this.buttonEmit.emit({
        row: row,
        button: button,
      })
    }
  }

  async edit(item: any) {
    if (this.item.id_update_name) {
      this.item.id_update_id = item[this.item.id_update_name];
    }

    this.item.inputs?.forEach(element => {
      element.inputs.forEach(el => {
        const key = el.key as keyof typeof item; // A asserção de tipo assegura que a chave não é undefined
        if (typeof item[key] !== 'undefined') {
          el.value = item[key];

          if (el.isDateType) {
            const dt_data = new DatePipe('en-US').transform(item[key], 'ddMMyyyy');
            el.value = dt_data;
          }

          if (el.isSearchable) {
            el.searchValue = item[key];
            console.log({ item_search: item, element: el });
          }
        }
      });
    });

    this.openModal(item);
  }


  openModal(item: ICamposDefault) {
    let modalRef = this.modalService.open(ComponentDefaultFormComponent, { backdrop: 'static', size: this.item.size_modal_form, keyboard: false, centered: true });
    modalRef.componentInstance.item = this.item;
    modalRef.componentInstance.formFields = this.item.inputs;
    if (item) {
      modalRef.componentInstance.row = item;
    }
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.item.id_update_id = null;
      console.log(reason);
    });
  }

  async delete(item: any, key: null) {
    this.swalAlertService.confirmText(Messages.ATENCAO_EXCLUIR, Messages.EXCLUIR_MESSAGE).then(value => {
      if (value) {
        //this.loadingService.show();
        const updateKeyName = this.item.id_update_name;
        const idValue = typeof updateKeyName !== 'undefined' ? item[updateKeyName] : null;
        const request: IRequest = {
          url: this.item.rota + "-delete",
          authenticate: true,
          options: {
            menu: this.item.menu,
            tabela: this.item.tabela,
            id: idValue,
          },
        }
        this.crudService.post(request).then(response => {
          //this.loadingService.close();
          this.toastService.success(Messages.SUCCESS, response.message);
          // this._rows.splice(key);
          this._rows.map(el => {
            if (typeof updateKeyName !== 'undefined') {
              this._rows.forEach(el => {
                if (el[updateKeyName] === item[updateKeyName]) {
                  el.Omite = true;
                }
              });
            }
          })
        }).catch(err => {
          //this.loadingService.close();
          this.swalAlertService.error(Messages.ERRO, Messages.SERVICO_INDISPONIVEL);
          console.log(err);
        });
      }
    }).catch(err => {
      console.log(err);
    });
  }



  _setImage(field: any, row: any) {
    if (field.imageClicable) {
      this.setImage.emit({
        row: row
      });
    }
  }

  getImagem(img: any) {
    let url = environment.baseImagem
    if (img) {
      url = url + img;
    } else {
      url = url + "img/associado/perfil.png";
    }
    return url;
  }
}
