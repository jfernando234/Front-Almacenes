import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClEditarClienteComponent } from './cl-editar-cliente.component';

describe('ClEditarClienteComponent', () => {
  let component: ClEditarClienteComponent;
  let fixture: ComponentFixture<ClEditarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClEditarClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClEditarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
