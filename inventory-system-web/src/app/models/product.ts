import { User } from "./user";

export interface Product{
    productId: number;
    userId: number;
    name: string;
    stock: number;
    entryDate: Date;
    user: User;
}