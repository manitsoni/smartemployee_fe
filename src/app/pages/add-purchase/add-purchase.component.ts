import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { CommonService } from 'src/app/services/comman.services';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  purchaseForm: FormGroup;
  vendorList: [] = []
  isVisible = false;
  isExists = false;
  isValidation = false;
  vendorForm: FormGroup;
  selectedFiles: Array<File>=[];
  typeList :string[] = ["Cash","Credit"];
  
  constructor(private fb: FormBuilder, private service: CommonService,private route : Router) { }

  ngOnInit(): void {
    this.getVendorList();
    this.purchaseForm = this.fb.group({
      purchaseDate: [null, [Validators.required]],
      vendorID: [null,[Validators.required]],
      vendorName: [null],
      toBillAmt: [null, [Validators.required,Validators.pattern("^([0-9])+(.[0-9]{0,9})?$")]],
      companyID: [localStorage.getItem("companyId")],
      userID: [localStorage.getItem("userId")],
      userName: [localStorage.getItem("loggedUser")],
      companyName: [null],
      files: [],
      type:['',Validators.required]
    });
    this.vendorForm = this.fb.group({
      vendorID: [null],
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
  get vendorFormControl() {
    return this.vendorForm.controls;
  }
  addPurchase() {
    this.purchaseForm.markAllAsTouched();
    Object.values(this.purchaseForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    if (this.purchaseForm.valid && this.selectedFiles.length > 0) {
      let formData = {
        purchaseDate: this.purchaseForm.value.purchaseDate,
        vendorID: this.purchaseForm.value.vendorID,
        vendorName: "",
        toBillAmt: this.purchaseForm.value.toBillAmt,
        companyID: this.purchaseForm.value.companyID,
        userID: this.purchaseForm.value.userID,
        userName: this.purchaseForm.value.userName,
        type : this.purchaseForm.value.type
      }
      this.service.API_POST("PurchaseMain/AddPurchaseMain", formData).subscribe(res => {
        if (res.isSuccess) {
          const formData = new FormData();
          for (var i = 0; i < this.selectedFiles.length; i++) {
            formData.append("postedFiles", this.selectedFiles[i]);
          }
          let id = res.lstPurchaseMain[0].purchaseMainID;
          let url = "PurchaseMain/UploadFiles/" + id;
          this.service.API_POST(url, formData).subscribe(res => {
            if (res.isSuccess) {
              this.service.showMessage('success', 'Purchase Added Successfully!')
              this.purchaseForm.reset();
              this.selectedFiles = [];
              this.route.navigateByUrl("/purchase")
            }
          })
        }
      })
    }else{
      if(this.selectedFiles.length  === 0){
        this.service.showMessage("error","Please upload file");
      }
    }
  }
  fileChange(event) {
    this.selectedFiles =[];
    const files: FileList = event.target.files;
    const fileList = new Array<File>();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files.item(i).name, files.item(i));
      fileList.push(files.item(i));
    }
    this.selectedFiles = fileList;
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
      if (this.vendorForm.value['vendorID'] === null) {
        if(this.vendorList.length > 0){
          this.vendorList.forEach((element:any) => {
            if (element.VendorName.toLowerCase() === this.vendorForm.value['vendorName'].toLowerCase()) {
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
          this.vendorList.forEach((element :any) => {
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
  openModel() {
    this.isVisible = !this.isVisible;
    if(!this.isVisible){
      this.vendorForm.reset();
      this.getVendorList();
    }
  }
}
