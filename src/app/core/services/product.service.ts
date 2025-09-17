import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../interfaces/product';
import { environment } from '../../../environments/environment';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private urlBackEnd = `${environment.urlBackEnd}/api/products`;

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.urlBackEnd);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.urlBackEnd, product);
  }

  findByCode(code: string): Observable<Product> {
    return this.http.get<Product>(`${this.urlBackEnd}/${code}`);
  }

  findByStatus(status: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlBackEnd}/status/${status}`);
  }

  update(code: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.urlBackEnd}/${code}`, product);
  }

  delete(code: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBackEnd}/${code}`);
  }

  restore(code: string): Observable<void> {
    return this.http.put<void>(`${this.urlBackEnd}/${code}/restore`, {});
  }

  deletePhysical(code: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBackEnd}/physical/${code}`);
  }

  reportPdf() {
    return this.http.get(`${this.urlBackEnd}/pdf`, { responseType: 'blob' });
  }
}