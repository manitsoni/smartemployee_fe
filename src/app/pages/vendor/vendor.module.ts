import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SharedModule } from 'src/app/services/shared.module';

@NgModule({
  imports: [
    VendorRoutingModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzBreadCrumbModule,
    SharedModule,
  NzSelectModule,NzSwitchModule],
  declarations: [VendorComponent],
  exports: [VendorComponent]
})
export class VendorModule { }