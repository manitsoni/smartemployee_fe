import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardAdmin } from './services/admin-auth';
import { AuthGuardEmployee } from './services/employee-auth';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {path : 'login', loadChildren :() => import('./pages/login/login.module').then(m => m.LoginModule)},
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) , canActivate:[AuthGuardAdmin]},
  { path: 'company', loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyModule) , canActivate:[AuthGuardAdmin]},
  { path: 'vendor', loadChildren: () => import('./pages/vendor/vendor.module').then(m => m.VendorModule) , canActivate:[AuthGuardAdmin]},
  { path: 'purchase', loadChildren: () => import('./pages/purchase-dashboard/purchase-dashboard.module').then(m => m.PurchaseModule)},
  { path: 'add-purchase', loadChildren: () => import('./pages/add-purchase/add-purchase.module').then(m => m.AddPurchaseModule),  canActivate:[AuthGuardEmployee]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule],
  providers: [AuthGuardAdmin,AuthGuardEmployee]
})
export class AppRoutingModule { }
