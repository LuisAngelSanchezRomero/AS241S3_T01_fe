import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Product>();

  productForm: FormGroup;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      providerId: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      unit: ['', Validators.required],
      price: [0.01, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['Activo', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.product) {
      this.isEditing = true;
      this.productForm.patchValue({
        ...this.product,
        unit: this.product.unit || '',
        status: this.product.status || 'Activo'
      });
      
      this.productForm.get('code')?.disable();
      
      console.log('Formulario cargado con:', this.productForm.value);
    } else {
      this.isEditing = false;
      this.productForm.get('code')?.enable();
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();
    
    const productToSave = this.isEditing && this.product 
      ? { ...formValue, code: this.product.code }
      : formValue;

    this.save.emit(productToSave);
  }

  closeForm(): void {
    this.productForm.reset({
      price: 0.01,
      stock: 0,
      status: 'Activo'
    });
    this.close.emit();
  }
}
