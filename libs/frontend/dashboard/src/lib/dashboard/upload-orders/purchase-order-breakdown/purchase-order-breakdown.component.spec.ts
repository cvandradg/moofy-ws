import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PurchaseOrderBreakdownComponent } from './purchase-order-breakdown.component';
import { MODULES } from '@moofy/shared';
import { signal } from '@angular/core';

describe('PurchaseOrderBreakdownComponent', () => {
  let component: PurchaseOrderBreakdownComponent;
  let fixture: ComponentFixture<PurchaseOrderBreakdownComponent>;

  const mockPurchaseOrder = signal({
    AckStatusCode: null,
    AckStatusDescription: null,
    AifNumber: null,
    ApprovalTimestamp: '2025-01-20T00:00:00Z',
    Country: null,
    CreatedTimestamp: '2025-01-20T00:00:00Z',
    DocSplitInd: '',
    DocType: '',
    DocumentCountry: '',
    DocumentId: 1,
    DocumentNumber: '',
    DocumentOpenedIndicator: '',
    DocumentStatusCode: 1,
    DocumentTypeCode: 1,
    EditType: null,
    Location: '',
    MailboxId: 1,
    MailboxSystemSeparator: null,
    OrderDate: '2025-01-20T00:00:00Z',
    PdfRequestIconDisplay: null,
    PdfRequestJsonDetail: null,
    PdfStatus: null,
    RelatedDocumentCount: 0,
    TaSlipNumber: '',
    TaSplitInd: '',
    TotalRows: 0,
    TradRelId: null,
    VendorName: null,
    VendorNumber: 1,
    WebEdiSetupId: null,
    XmlPath: null,
  });

  const mockPurchaseOrderDetails = {
    purchaseOrderNumber: '12345',
    purchaseOrderDate: '2025-01-20',
    shipDate: '2025-01-25',
    cancelDate: '2025-01-30',
    additionalDetails: {
      orderType: 'Regular',
      currency: 'USD',
      department: 'Electronics',
      paymentTerms: 'Net 30',
      carrier: 'FedEx',
      shipTo: 'Warehouse A',
      billTo: 'Company B',
    },
    items: [
      {
        line: '1',
        itemNumber: '123',
        gtin: '456',
        supplierStock: '100',
        color: 'Red',
        size: 'L',
        quantityOrdered: '10',
        uom: 'PCS',
        pack: '1',
        cost: '10.00',
        extendedCost: '100.00',
      },
    ],
    totals: {
      totalAmount: '100.00',
      totalItems: '1',
      totalUnits: '10',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderBreakdownComponent, MODULES],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderBreakdownComponent);
    component = fixture.componentInstance;

    // Set inputs
    component.purchaseOrder = mockPurchaseOrder;
    component.purchaseOrderDetails$ = mockPurchaseOrderDetails;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
