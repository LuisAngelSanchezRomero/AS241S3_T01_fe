export interface Product {
    code: string;
    providerId: number;
    name: string;
    description?: string;
    unit: string;
    price: number;
    stock: number;
    status: string;
    createdDate: string;
}