import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadOrdersComponent } from './upload-orders.component';
import { of } from 'rxjs';
import { Fontawesome, MODULES, PdfExtractService } from '@moofy/shared';
import { UploadOrdersStore } from './upload-orders.store';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UploadOrdersComponent', () => {
  let component: UploadOrdersComponent;
  let fixture: ComponentFixture<UploadOrdersComponent>;

  const pdfExtractService = {
    fetchInboundDocuments: jest.fn().mockReturnValue(of(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UploadOrdersComponent,
        MODULES,
        Fontawesome,
        RouterModule,
        MatBadgeModule,
        MatBottomSheetModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: PdfExtractService, useValue: pdfExtractService },
        { provide: UploadOrdersStore, useValue: pdfExtractService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
