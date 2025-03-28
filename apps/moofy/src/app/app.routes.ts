import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@moofy/dashboard').then((m) => m.dashboardRoutes),
  },
];
