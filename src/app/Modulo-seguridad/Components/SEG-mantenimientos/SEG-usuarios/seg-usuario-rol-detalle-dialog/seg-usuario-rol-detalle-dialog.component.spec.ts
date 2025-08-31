import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegUsuarioRolDetalleDialogComponent } from './seg-usuario-rol-detalle-dialog.component';

describe('SegUsuarioRolDetalleDialogComponent', () => {
  let component: SegUsuarioRolDetalleDialogComponent;
  let fixture: ComponentFixture<SegUsuarioRolDetalleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegUsuarioRolDetalleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegUsuarioRolDetalleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
