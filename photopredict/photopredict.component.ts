import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from "rxjs/operators";

import { MarketService } from '../market/market.service';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-photopredict',
  templateUrl: './photopredict.component.html',
  styleUrls: ['./photopredict.component.css']
})
export class PhotopredictComponent implements OnInit {

  imgSrc: string = "/assets/img/image_placeholder.jpg";
  selectedImage: any = null;
  isSubmitted: boolean;

  predictionResult: string = null;

  latitude: number = null;
  longitude: number = null;

  formTemplate = new FormGroup({
    imageUrl: new FormControl('', Validators.required),


  })

  constructor(private storage: AngularFireStorage, private marketService: MarketService, private changeDetector: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit() {
    this.resetForm();
    this.getLocation();
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
      var filePath = `prediction/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            formValue['imageUrl'] = url;
            this.marketService.getPrediction(this.selectedImage).subscribe((responseData) => {
              this.predictionResult = responseData.toString();
              formValue['result'] = this.predictionResult;
              formValue['owner'] = this.authService.user.id;
              formValue['latitude'] = this.latitude;
              formValue['longitude'] = this.longitude;
              formValue['date'] = new Date().toLocaleString();
              if(this.predictionResult === 'Broadleaf') {
                formValue['category'] = 'Weed';
              }
              else {
                formValue['category'] = 'Not Weed';
              }
              this.changeDetector.detectChanges();
              this.marketService.insertPredictionDetails(formValue);
            })



          })
        })
      ).subscribe();
    }
  }

  resetButton() {
    this.resetForm();
    this.predictionResult = null;
  }

  get formControls() {
    return this.formTemplate['controls'];
  }

  resetForm() {
    this.formTemplate.reset();
    this.formTemplate.setValue({
      imageUrl: '',
    });
    this.imgSrc = '/assets/img/image_placeholder.jpg';

    this.selectedImage = null;
    this.isSubmitted = false;
    this.changeDetector.detectChanges();
  }


  getPrediction() {
    this.marketService.getPrediction(this.selectedImage).subscribe((responseData) => {
      this.predictionResult = responseData.toString();

      this.changeDetector.detectChanges();
    })
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.changeDetector.detectChanges();
    });
  }

}
