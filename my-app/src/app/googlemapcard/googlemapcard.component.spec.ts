import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglemapcardComponent } from './googlemapcard.component';

describe('GooglemapcardComponent', () => {
  let component: GooglemapcardComponent;
  let fixture: ComponentFixture<GooglemapcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglemapcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglemapcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
