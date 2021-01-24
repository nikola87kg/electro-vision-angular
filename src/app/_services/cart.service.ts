/* Angular */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { SnackbarComponent } from './../partials/snackbar/snackbar.component';

/* BRAND SERVICE */
@Injectable({ providedIn: 'root' })
export class CartService {

    cartCount$$ = new BehaviorSubject<number>(0);
    constructor(private snackBar: MatSnackBar) { }

    addToCart(id, count = 1): void {
        const cartString = localStorage.getItem('new-cart');
        const cartArray = JSON.parse(cartString) || [];
        if (cartArray.some(e => id in e)) {
            this.openSnackBar({ action: 'new-cart', type: 'exist' });
            return;
        }
        this.cartCount$$.next(cartArray.length + 1);
        cartArray.push({ [id]: count });
        localStorage.setItem('new-cart', JSON.stringify(cartArray));
        this.openSnackBar({ action: 'new-cart', type: 'new' });
    }

    removeFromCart(id): void {
        const cartString = localStorage.getItem('new-cart');
        const cartArray: Array<any> = JSON.parse(cartString) || [];
        const itemIndex = cartArray.findIndex(e => id in e);
        if (itemIndex > -1) {
            this.cartCount$$.next(cartArray.length - 1);
            cartArray.splice(itemIndex, 1);
            localStorage.setItem('new-cart', JSON.stringify(cartArray));
        }
    }


    getCartProducts(productList): any[] {
        if (!productList) {
            return;
        }
        let cartProducts;
        const cartString = localStorage.getItem('new-cart');
        const cartArray = JSON.parse(cartString) || [];
        cartProducts = productList?.filter(product => {
            const itemIndex = cartArray.findIndex(e => product._id in e);
            return itemIndex > -1;
        });
        this.cartCount$$.next(cartProducts.length);
        cartProducts.map(product => {
            const cartIndex = cartArray.findIndex(e => product._id in e);
            product.amount = cartArray[cartIndex][product._id] || 1;
            return product;
        });
        return cartProducts;
    }

    clearCart(): void {
        localStorage.removeItem('new-cart');
        this.cartCount$$.next(0);
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 3000,
            data: object,
        });
    }
}
