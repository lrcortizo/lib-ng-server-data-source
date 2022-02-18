import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDataSourceComponent } from './server-data-source.component';

describe('ServerDataSourceComponent', () => {
  let component: ServerDataSourceComponent;
  let fixture: ComponentFixture<ServerDataSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerDataSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerDataSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
