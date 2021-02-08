import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Product } from './market.model';
import { AuthService } from '../auth/auth.service';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class MarketService {
  error = new Subject<string>();

  productDetailList: AngularFireList<any>;

  predictionDetailList: AngularFireList<any>;

  constructor(private http: HttpClient, private authService: AuthService, private firebase: AngularFireDatabase) {}

  createProduct(productData: Product) {
    productData.owner = this.authService.user.id;
    this.http.post('https://agripro-d4890.firebaseio.com/products.json', productData)
    .subscribe((responseData) => {
      console.log(responseData);
    });

  }

  fetchProducts() {
    return this.http.get<{ [key: string]: Product }>('https://agripro-d4890.firebaseio.com/products.json')
    .pipe(map(responseData => {
      const productsArray: Product[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          productsArray.push({...responseData[key], id: key});
        }
      }
      return productsArray;
    })
    );
  }

  getImageDetailList() {
    this.productDetailList = this.firebase.list('products');
  }

  insertImageDetails(imageDetails) {

    this.productDetailList.push(imageDetails);
  }


  getPredictionDetailList() {
    this.predictionDetailList = this.firebase.list('prediction');
  }

  insertPredictionDetails(predictionDetails) {

    this.predictionDetailList.push(predictionDetails);
  }


  getPrediction(imageFile) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded' });
    let options = { headers: headers };
    let formData = new FormData();
    formData.append('file', imageFile, imageFile.name);
    return this.http.post('/api/photo', formData);
  }

  deleteProductDetail(key) {
    this.productDetailList.remove(key);
  }


}
