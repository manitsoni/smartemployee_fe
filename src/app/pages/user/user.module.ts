import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SharedModule } from 'src/app/services/shared.module';

@NgModule({
  imports: [
    UserRoutingModule,
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
  declarations: [UserComponent],
  exports: [UserComponent]
})
export class UserModule { }