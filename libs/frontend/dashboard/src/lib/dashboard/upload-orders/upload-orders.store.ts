import { inject, Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { switchMap, Observable, tap, pipe, catchError, retry } from 'rxjs';
import {
  moofyPO,
  PdfExtractService,
  ComponentStoreMixinHelper,
  moofyToWalmartRoutes,
} from '@moofy/shared';

type RouteKey = keyof typeof moofyToWalmartRoutes;
type AggregatedOrders = {
  route: RouteKey;
  orders: { DocumentId: number; Location: string }[];
}[];
type inboundOrder = {
  AckStatusCode: string | null;
  AckStatusDescription: string | null;
  AifNumber: string | null;
  ApprovalTimestamp: string;
  Country: string | null;
  CreatedTimestamp: string;
  DocSplitInd: string;
  DocType: string;
  DocumentCountry: string;
  DocumentId: number;
  DocumentNumber: string;
  DocumentOpenedIndicator: string;
  DocumentStatusCode: number;
  DocumentTypeCode: number;
  EditType: string | null;
  Location: string;
  MailboxId: number;
  MailboxSystemSeparator: string | null;
  OrderDate: string;
  PdfRequestIconDisplay: string | null;
  PdfRequestJsonDetail: string | null;
  PdfStatus: string | null;
  RelatedDocumentCount: number;
  TaSlipNumber: string;
  TaSplitInd: string;
  TotalRows: number;
  TradRelId: string | null;
  VendorName: string | null;
  VendorNumber: number;
  WebEdiSetupId: string | null;
  XmlPath: string | null;
};

type PurchaseOrdeDetails = {
  purchaseOrderNumber: string;
  purchaseOrderDate: string;
  shipDate: string;
  cancelDate: string;
  additionalDetails: {
    orderType: string;
    currency: string;
    department: string;
    paymentTerms: string;
    carrier: string;
    shipTo: string;
    billTo: string;
  };
  items: {
    line: string;
    itemNumber: string;
    gtin: string;
    supplierStock: string;
    color: string;
    size: string;
    quantityOrdered: string;
    uom: string;
    pack: string;
    cost: string;
    extendedCost: string;
  }[];
  totals: {
    totalAmount: string;
    totalItems: string;
    totalUnits: string;
  };
};

@Injectable({
  providedIn: 'root',
})
export class UploadOrdersStore extends ComponentStoreMixinHelper<{
  inboundOrders: inboundOrder[];
  inboundOrderDetails: PurchaseOrdeDetails;
}> {
  pdfExtractService = inject(PdfExtractService);

  constructor() {
    super({
      inboundOrders: [],
      inboundOrderDetails: {} as PurchaseOrdeDetails,
    });
    this.#getInboutOrders$();
  }

  readonly inboundOrders$ = this.select((state) => state.inboundOrders);
  readonly inboundOrderDetails$ = this.select(
    (state) => state.inboundOrderDetails
  );

  readonly getInboundOrdersByRoute$ = this.select((state) => {
    return this.aggregateInboundOrdersByRoute(state.inboundOrders);
  });

  readonly setInboundOrders = this.updater(
    (state, inboundOrders: inboundOrder[]) => ({
      ...state,
      loading: false,
      inboundOrders,
    })
  );

  readonly setInboundOrderDetails = this.updater(
    (state, inboundOrderDetails: any) => ({
      ...state,
      loading: false,
      inboundOrderDetails,
    })
  );

  readonly #getInboutOrders$ = this.effect<void>(
    pipe(
      this.responseHandler(
        switchMap(() =>
          this.pdfExtractService
            .fetchInboundDocuments()
            .pipe(tapResponse(this.onSetInboundOrdersSuccess, this.onError))
        )
      )
    )
  );

  readonly getInboutOrderDetails$ = this.effect(
    (inbountOrder$: Observable<any>) =>
      inbountOrder$.pipe(
        this.responseHandler(
          switchMap((inboundOrder) =>
            this.pdfExtractService
              .getInboutOrderDetails(
                inboundOrder.DocumentId,
                inboundOrder.Location
              )
              .pipe(
                tapResponse(this.onSetInboundOrderDetailsSuccess, this.onError)
              )
          )
        )
      )
  );

  aggregateInboundOrdersByRoute(
    inboundOrders: { DocumentId: number; Location: string }[]
  ): AggregatedOrders {
    if (
      !inboundOrders ||
      !inboundOrders.length ||
      !moofyToWalmartRoutes ||
      Object.keys(moofyToWalmartRoutes).length === 0
    ) {
      console.warn('No inbound orders or routes to process.');
      return [];
    }

    const result: Record<RouteKey, any[]> = Object.keys(
      moofyToWalmartRoutes
    ).reduce((acc, key) => {
      acc[key as RouteKey] = [];
      return acc;
    }, {} as Record<RouteKey, any[]>);

    inboundOrders.forEach((doc) => {
      const locationKey = `${doc.Location}`.trim();

      for (const [routeKey, stores] of Object.entries(moofyToWalmartRoutes)) {
        const foundStore = (stores as any[]).find(
          (store) => store.name === locationKey
        );

        if (foundStore) {
          result[routeKey as RouteKey].push(doc);
          break;
        }
      }
    });

    const transformedResult = Object.entries(result)
      .filter(([_, orders]) => orders.length > 0)
      .map(([routeKey, orders]) => ({
        route: routeKey as RouteKey,
        orders,
      }));

    return transformedResult;
  }

  get onError() {
    return (error: any, component?: any) => {
      this.setError(error);
      return this.errorHelperService.handleError(
        error,
        component || 'not reported'
      );
    };
  }

  get onSetInboundOrdersSuccess() {
    return (files: any) => this.setInboundOrders(files);
  }

  get onSetInboundOrderDetailsSuccess() {
    return (files: any) => this.setInboundOrderDetails(files);
  }
}
