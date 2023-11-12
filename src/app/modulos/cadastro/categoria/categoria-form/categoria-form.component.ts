import { Component, Inject } from '@angular/core';
import { Categoria } from '../categoria.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriaService } from '../categoria.service';
export interface DialogData {
  id: number;
  action: string;
  categoria: Categoria;
}
@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE,
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
    }, }],
})
export class CategoriaFormComponent {
  action: string;
  dialogTitle: string;
  categoriaForm: UntypedFormGroup;
  categoria: Categoria;
  constructor(
    public dialogRef: MatDialogRef<CategoriaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public categoriaService: CategoriaService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle =
        data.categoria.no_categoria;
      this.categoria = data.categoria;
    } else {
      this.dialogTitle = 'Novo Cadastro';
      const blankObject = {} as Categoria;
      this.categoria = new Categoria(blankObject);
    }
    this.categoriaForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id_categoria: [this.categoria.id_categoria],
      no_categoria: [this.categoria.no_categoria, [Validators.required]],
      id_categoria_pai: [this.categoria.id_categoria_pai],
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd(): void {
    this.categoriaService.addCategoria(
      this.categoriaForm.getRawValue()
    );
  }
}
