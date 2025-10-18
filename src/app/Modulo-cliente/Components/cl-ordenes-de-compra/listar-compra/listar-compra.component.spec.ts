import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCompraComponent } from './listar-compra.component';

describe('ListarCompraComponent', () => {
  let component: ListarCompraComponent;
  let fixture: ComponentFixture<ListarCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
