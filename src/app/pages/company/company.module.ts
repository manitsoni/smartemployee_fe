import { NgModule } from '@angular/core';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SharedModule } from 'src/app/services/shared.module';

@NgModule({
  imports: [
    CompanyRoutingModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzBreadCrumbModule,
  SharedModule],
  declarations: [CompanyComponent],
  exports: [CompanyComponent]
})
export class CompanyModule { }