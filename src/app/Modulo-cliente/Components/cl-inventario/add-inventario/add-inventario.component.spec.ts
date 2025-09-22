import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventarioComponent } from './add-inventario.component';

describe('AddInventarioComponent', () => {
  let component: AddInventarioComponent;
  let fixture: ComponentFixture<AddInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
