import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegUsuarioRolComponent } from './seg-usuario-rol.component';

describe('SegUsuarioRolComponent', () => {
  let component: SegUsuarioRolComponent;
  let fixture: ComponentFixture<SegUsuarioRolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegUsuarioRolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegUsuarioRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
