import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/comman.services';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  vendorList = [];
  isVisible = false;
  isExists = false;
  isValidation = false;
  vendorForm: FormGroup;
  constructor(private service: CommonService, private fb: FormBuilder,private router : Router) { 
    if(!this.service.checkLogin()){
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.getVendorList();
    this.vendorForm = this.fb.group({
      vendorID: [0],
      vendorName: ['', [Validators.required]],
      place: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    });
  }
  getVendorList() {
    this.service.API_GET("Vendor/GetVendors").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.vendorList = result.lstVendor;
      }
    })
  }
  openModel() {
    this.isVisible = !this.isVisible;
    if(!this.isVisible){
      this.vendorForm.reset();
    }
  }
  patchRecords(id) {
    if (id) {
      var data = this.vendorList.filter(x => x.VendorID === id)[0];
      if (data) {
        this.vendorForm.controls.vendorID.setValue(data.VendorID);
        this.vendorForm.controls.vendorName.setValue(data.VendorName);
        this.vendorForm.controls.place.setValue(data.Place);
        this.vendorForm.controls.mobileNo.setValue(data.MobileNo);
        this.openModel();
      }
    }
  }
  get vendorFormControl() {
    return this.vendorForm.controls;
  }
  saveVendor() {
    this.vendorForm.markAllAsTouched(); 
    Object.values(this.vendorForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    if (this.vendorForm.valid) {
      if (this.vendorForm.value['vendorID'] === 0) {
        if(this.vendorList.length > 0){
          this.vendorList.forEach(element => {
            if (element.VendorName === this.vendorForm.value['vendorName']) {
              this.isExists = true;
            }
          });
        }
        if (!this.isExists) {
          var data = {
            vendorName: this.vendorForm.value['vendorName'],
            place: this.vendorForm.value['place'],
            mobileNo: this.vendorForm.value['mobileNo']
          }
          this.service.API_POST("Vendor/AddVendor", data).subscribe(response => {
            let result = response;
            if (result.isSuccess) {
              this.openModel();
              this.service.showMessage('success', 'Vendor Added Successfully!')
              this.getVendorList();
              this.vendorForm.reset();
            }
            this.isExists = false;
          }, (error) => {
            this.openModel();
            this.vendorForm.reset();
            this.isExists = false;
            this.service.showMessage('error', 'Error while adding data, please try again!')
          })
        } else {
          this.service.showMessage('info', 'Vendor Already Exists!');
          this.isExists = false;
        }
      } else {
        if (this.vendorForm.value['vendorID'] > 0) {
          this.vendorList.forEach(element => {
            if (element.VendorName === this.vendorForm.value['vendorName']) {
              if (element.VendorID !== this.vendorForm.value['vendorID']) {
                this.isExists = true;
              }
            }
          });
          if (!this.isExists) {
            var form = {
              vendorID: this.vendorForm.value['vendorID'],
              vendorName: this.vendorForm.value['vendorName'],
              place: this.vendorForm.value['place'],
              mobileNo: this.vendorForm.value['mobileNo']
            }
            this.service.API_POST("Vendor/AddVendor", form).subscribe(response => {
              let result = response;
              if (result.isSuccess) {
                this.openModel();
                this.service.showMessage('success', 'Vendor Update Successfully!')
                this.getVendorList();
                this.vendorForm.reset();
              }
              this.isExists = false;
            }, (error) => {
              this.openModel();
              this.vendorForm.reset();
              this.isExists = false;
              this.service.showMessage('error', 'Error while updating data, please try again!')
            })
          } else {
            this.service.showMessage('info', 'Vendor Already Exists!');
            this.isExists = false;
          }
        }
      }
    }
  }
  deleteRecord(id) {
    if (id) {
      var data = {
        vendorID:id
      }
      this.service.API_DELETE("Vendor/DeleteVendor", data).subscribe(response => {
        let result = response;
        if (result.isSuccess) {
          this.service.showMessage('success', 'Vendor Delete Successfully!')
          this.getVendorList();
          this.vendorForm.reset();
        }
      }, (error) => {
        this.vendorForm.reset();
        this.service.showMessage('error', 'Error while deleting data, please try again!')
      })
    }
  }
}
