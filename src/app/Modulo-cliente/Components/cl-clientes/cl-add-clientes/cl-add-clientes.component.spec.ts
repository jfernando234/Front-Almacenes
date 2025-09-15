import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClAddClientesComponent } from './cl-add-clientes.component';

describe('ClAddClientesComponent', () => {
  let component: ClAddClientesComponent;
  let fixture: ComponentFixture<ClAddClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClAddClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClAddClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
