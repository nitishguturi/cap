import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Product } from '../market.model';
import { MarketService } from '../market.service';
import { AuthService } from '../../auth/auth.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  loadedProducts: Product[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  user: string;


  imgSrc: string;
  selectedImage: any = null;
  isSubmitted: boolean;


  productList: any[] = [];
  rowIndexArray: any[];


  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl(''),
    imageUrl: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    avaldate: new FormControl('', Validators.required),
    contact: new FormControl('', (Validators.maxLength(10), Validators.minLength(10))),
    location: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient, private marketService: MarketService, private authService: AuthService, private changeDetector: ChangeDetectorRef, private storage: AngularFireStorage ) { }
  /*
  ngOnInit(): void {
    this.marketService.fetchProducts()
    .subscribe((products: Product[]) => {
      console.log(products);
      for (const product of products) {
        if (product.owner === this.authService.user.id) {
          this.loadedProducts.push(product);
        }
      }
      this.changeDetector.detectChanges();
    });
  }

  onCreateProduct(productData: NgForm) {
    this.marketService.createProduct(productData.value);
    productData.reset();
    this.changeDetector.detectChanges();

  }
  */

 getMyProducts() {
  this.productList = [];
  this.marketService.productDetailList.snapshotChanges().subscribe(
    list => {
      const products = list.map(item => ({key: item.payload.key, ...item.payload.val()}));

      for (const product of products) {
        if (product.owner === this.authService.user.id) {
          this.productList.push(product);
        }
      }

      console.log(this.productList);
      this.rowIndexArray =  Array.from(Array(Math.ceil((this.productList.length + 1) / 3)).keys());
      this.changeDetector.detectChanges();
      console.log(this.productList);
    });
 }

 ngOnInit() {
  this.resetForm();
  this.getMyProducts();

  this.user = this.authService.user.id;
}

showPreview(event: any) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e: any) => this.imgSrc = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.selectedImage = event.target.files[0];
  }
  else {
    this.imgSrc = '/assets/img/image_placeholder.jpg';
    this.selectedImage = null;
  }
}

onSubmit(formValue) {

  this.isSubmitted = true;
  if (this.formTemplate.valid) {
    let filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    console.log(filePath);
    const fileRef = this.storage.ref(filePath);
    console.log(fileRef);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          formValue.imageUrl = url;
          formValue.owner = this.authService.user.id;
          console.log(formValue);
          this.marketService.insertImageDetails(formValue);
          this.resetForm();
          this.getMyProducts();
          this.changeDetector.detectChanges();
        });
      })
    ).subscribe();
  }
}

get formControls() {
  return this.formTemplate.controls;
}

resetForm() {
  this.formTemplate.reset();
  this.formTemplate.setValue({
    name: '',
    imageUrl: '',
    category: 'Vegetables',
    description: '',
    avaldate: '',
    contact: '',
    location: '',
    quantity: '',
    price: ''
  });
  this.imgSrc = '/assets/img/image_placeholder.jpg';
  this.selectedImage = null;
  this.isSubmitted = false;
}



  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {

  }

  deleteProduct(key: string) {
    this.marketService.deleteProductDetail(key);
  }


}
