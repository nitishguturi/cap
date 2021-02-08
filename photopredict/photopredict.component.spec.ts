import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotopredictComponent } from './photopredict.component';

describe('PhotopredictComponent', () => {
  let component: PhotopredictComponent;
  let fixture: ComponentFixture<PhotopredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotopredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotopredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
