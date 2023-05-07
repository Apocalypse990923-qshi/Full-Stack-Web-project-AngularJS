import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailcardComponent } from './detailcard.component';

describe('DetailcardComponent', () => {
  let component: DetailcardComponent;
  let fixture: ComponentFixture<DetailcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
