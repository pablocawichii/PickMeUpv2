import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupNewComponent } from './pickup-new.component';

describe('PickupNewComponent', () => {
  let component: PickupNewComponent;
  let fixture: ComponentFixture<PickupNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
