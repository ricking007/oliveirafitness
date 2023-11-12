import { Direction } from '@angular/cdk/bidi';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UnsubscribeOnDestroyAdapter } from '@shared/UnsubscribeOnDestroyAdapter';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { TableElement } from '@shared/TableElement';
import { TableExportUtil } from '@shared';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { CategoriaService } from './categoria.service';
import { Categoria } from './categoria.model';
import { IRequest } from 'app/interface/request.interface';
import { ApiUrl } from 'app/enums/api.enum';
import { environment } from 'environments/environment';
import { DeleteDialogComponent } from 'app/advance-table/dialogs/delete/delete.component';

export const MOMENT_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};
@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  providers: [{
    provide: MAT_DATE_LOCALE,
    useValue: {
      parse: {
        dateInput: ['l', 'LL'],
      },
      display: {
        dateInput: 'L',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    },
  }],
})
export class CategoriaComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  categoria?: Categoria;
  categoriaDatabase?: CategoriaService;
  selection = new SelectionModel<Categoria>(true, []);
  dataSource!: CategoriaDataSource;

  displayedColumns = [
    'select',
    'id_categoria',
    'no_categoria',
    'created_at',
    'actions',
  ];

  id?: number;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public categoriaService: CategoriaService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit(): void {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      height: '300px',
      width: '400px',
      data: {
        categoria: this.categoria,
        action: 'add',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.categoriaDatabase?.dataChange.value.unshift(
          this.categoriaService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  public loadData() {
    this.categoriaDatabase = new CategoriaService(this.httpClient);
    this.dataSource = new CategoriaDataSource(
      this.categoriaDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }

  onContextMenu(event: MouseEvent, item: Categoria) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'ID': x.id_categoria,
        'Descricao': x.no_categoria,
        // Email: x.email,
        // Gender: x.gender,
        // 'Birth Date': formatDate(new Date(x.bDate), 'yyyy-MM-dd', 'en') || '',
        // Mobile: x.mobile,
        // Address: x.address,
        // Country: x.country,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.categoriaDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<Categoria>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Cadastro apagado com sucesso...!!!',
      'bottom',
      'center'
    );
  }

  editCall(row: Categoria) {
    console.log({ editCall: row })
    this.id = row.id_categoria;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(CategoriaFormComponent, {
      data: {
        categoria: row,
        action: 'edit',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.categoriaDatabase?.dataChange.value.findIndex(
          (x) => x.id_categoria === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.categoriaDatabase) {
          this.categoriaDatabase.dataChange.value[foundIndex] =
            this.categoriaService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            'black',
            'Cadastro atualizado com sucesso...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }
  deleteItem(row: Categoria) {
    console.log({ deleteItem: row })
    this.id = row.id_categoria;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.categoriaDatabase?.dataChange.value.findIndex(
          (x) => x.id_categoria === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.categoriaDatabase) {
          this.categoriaDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Cadastro excluído com sucesso...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

}


export class CategoriaDataSource extends DataSource<Categoria> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Categoria[] = [];
  renderedData: Categoria[] = [];
  constructor(
    public categoriaDatabase: CategoriaService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Categoria[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.categoriaDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    const request: IRequest = {
      url: environment.baseUrl + ApiUrl.CATEGORIA
    }
    this.categoriaDatabase.getAllCategorias(request);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.categoriaDatabase.data
          .slice()
          .filter((categoria: Categoria) => {
            const searchStr = (
              categoria.id_categoria +
              categoria.no_categoria +
              categoria.created_at
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: Categoria[]): Categoria[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id_categoria':
          [propertyA, propertyB] = [a.id_categoria, b.id_categoria];
          break;
        case 'no_categoria':
          [propertyA, propertyB] = [a.no_categoria, b.no_categoria];
          break;
        case 'created_at':
          [propertyA, propertyB] = [a.created_at, b.created_at];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
