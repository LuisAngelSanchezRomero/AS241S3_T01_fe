import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from '../product-form/product-form.component';
import { SideBarComponent } from '../../../layout/side-bar/side-bar.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductFormComponent,
    SideBarComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isFormVisible = false;
  selectedProduct: Product | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.findAll().subscribe({
      next: (data) => {
        this.products = data;
        console.log('ProductListComponent: Productos cargados:', this.products);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
        this.errorMessage = 'Error al cargar los productos. Por favor, intente nuevamente.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  addProduct(): void {
    console.log('ProductListComponent: Añadiendo nuevo producto. selectedProduct = null.');
    this.selectedProduct = null;
    this.isFormVisible = true;
    this.errorMessage = null;
  }

  saveProduct(product: Product): void {
    console.log('ProductListComponent: Recibido producto para guardar:', product);

    if (this.selectedProduct && this.selectedProduct.code) {
      const productToUpdate: Product = {
        ...product,
        code: this.selectedProduct.code
      };
      console.log('ProductListComponent: Actualizando producto con code:', productToUpdate.code, 'Nuevos datos:', productToUpdate);
      this.productService.update(productToUpdate.code, productToUpdate).subscribe({
        next: () => {
          this.loadProducts();
          this.isFormVisible = false;
          this.successMessage = 'Producto actualizado correctamente.';
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          console.error('Error al actualizar producto', err);
          this.errorMessage = 'Error al actualizar el producto. Por favor, intente nuevamente.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    } else {

      console.log('ProductListComponent: Creando nuevo producto:', product);
      this.productService.create(product).subscribe({
        next: () => {
          this.loadProducts();
          this.isFormVisible = false;
          this.successMessage = 'Producto creado correctamente.';
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          console.error('Error al crear producto', err);
          this.errorMessage = 'Error al crear el producto. Por favor, intente nuevamente.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  editProduct(product: Product): void {
    console.log('ProductListComponent: Clic en EDITAR. Producto recibido:', product);

    if (product.status === 'Inactivo') {
      this.errorMessage = 'No se puede editar un producto inactivo.';
      setTimeout(() => this.errorMessage = null, 5000);
      return;
    }

    this.selectedProduct = { ...product };
    console.log('ProductListComponent: selectedProduct configurado para editar:', this.selectedProduct);

    this.isFormVisible = true;
    this.errorMessage = null;
  }

  deleteProduct(code: string): void {
    if (confirm('¿Estás seguro de ELIMINAR LÓGICAMENTE este producto? (El producto quedará inactivo y podrá restaurarse).')) {
      this.productService.delete(code).subscribe({
        next: () => {
          this.products = this.products.map(p =>
            p.code === code ? { ...p, status: 'Inactivo' } : p
          );
          this.successMessage = 'Producto eliminado lógicamente (desactivado) correctamente.';
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          console.error('Error al eliminar lógicamente el producto', err);
          this.errorMessage = 'Error al eliminar lógicamente el producto. Por favor, intente nuevamente.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  restoreProduct(code: string): void {
    if (confirm('¿Estás seguro de RESTAURAR este producto? (El producto volverá a estar activo).')) {
      this.productService.restore(code).subscribe({
        next: () => {
          this.products = this.products.map(p =>
            p.code === code ? { ...p, status: 'Activo' } : p
          );
          this.successMessage = 'Producto restaurado correctamente.';
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          console.error('Error al restaurar el producto', err);
          this.errorMessage = 'Error al restaurar el producto. Por favor, intente nuevamente.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  deleteProductPhysical(code: string): void {
    if (confirm('¡ADVERTENCIA! ¿Estás seguro de ELIMINAR FÍSICAMENTE este producto? Esta acción no se puede deshacer.')) {
      this.productService.deletePhysical(code).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.code !== code);
          this.successMessage = 'Producto eliminado físicamente correctamente.';
          setTimeout(() => this.successMessage = null, 5000);
        },
        error: (err) => {
          console.error('Error al eliminar físicamente el producto', err);
          this.errorMessage = 'Error al eliminar físicamente el producto. Por favor, intente nuevamente.';
          setTimeout(() => this.errorMessage = null, 5000);
        }
      });
    }
  }

  cancelForm(): void {
    console.log('ProductListComponent: Cancelando formulario.');
    this.selectedProduct = null;
    this.isFormVisible = false;
    this.errorMessage = null;
  }

  reportPdf() {
    this.productService.reportPdf().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'reporte_productos.pdf';
        link.click();
        URL.revokeObjectURL(url);
        this.successMessage = 'Reporte generado correctamente.';
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        console.error('Error al generar el reporte', err);
        this.errorMessage = 'Error al generar el reporte. Por favor, intente nuevamente.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }
}