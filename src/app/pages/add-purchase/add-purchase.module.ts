import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AddPurchaseRoutingModule } from './add-purchase-routing.module';
import { AddPurchaseComponent } from './add-purchase.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { SharedModule } from 'src/app/services/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    AddPurchaseRoutingModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    SharedModule],
  declarations: [AddPurchaseComponent],
  exports: [AddPurchaseComponent]
})
export class AddPurchaseModule { }