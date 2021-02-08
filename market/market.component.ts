import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Product } from './market.model';
import { MarketService } from './market.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit{

  loadedProducts: Product[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;


  productList: Product[];
  rowIndexArray: any[];


  constructor(private http: HttpClient, private marketService: MarketService, private authService: AuthService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.marketService.productDetailList.snapshotChanges().subscribe(
      list => {
        this.productList = list.map(item => ({key: item.payload.key, ...item.payload.val()}));
        console.log(this.productList);
        this.rowIndexArray =  Array.from(Array(Math.ceil((this.productList.length+1) / 3)).keys());
        this.changeDetector.detectChanges();
      }
    );
  }


  fetchProducts() {
    this.marketService.fetchProducts()
    .subscribe((products: Product[]) => {
      this.loadedProducts = products;
    });
  }


}
