import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { PurchaseDashboardComponent } from './purchase-dashboard.component';
import { PurchaseDashboardRoutingModule } from './purchase-dashboard-routing.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SharedModule } from 'src/app/services/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdvanceSearchPipe } from './advanceSearch';

@NgModule({
  imports: [
    PurchaseDashboardRoutingModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzBreadCrumbModule,
    SharedModule,
    NzDatePickerModule,
    NzImageModule,
    NzPaginationModule,
    NgxPaginationModule
  ],
  declarations: [PurchaseDashboardComponent,AdvanceSearchPipe],
  exports: [PurchaseDashboardComponent]
})
export class PurchaseModule { }