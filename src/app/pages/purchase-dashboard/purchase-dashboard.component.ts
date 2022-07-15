import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/comman.services';
import * as FileSaver from 'file-saver'
@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html',
  styleUrls: ['./purchase-dashboard.component.css']
})
export class PurchaseDashboardComponent implements OnInit {
  companyList: any[] = [];
  vendorList: any[] = [];
  userList: any[] = [];
  purchaseList: any[] = [];
  userId = null;
  isSuperAdmin = false;
  purchaseListClone = [];
  searchValue: string = "";
  fromPurchaseDate: any;
  toPurchaseDate: any;

  constructor(private service: CommonService) {
    this.isSuperAdmin = localStorage.getItem("isSuperUser") && localStorage.getItem("isSuperUser").length > 0 ? true : false;
  }

  ngOnInit(): void {
    this.getCompanyList();
    this.getVendorList();
    this.getUserList();
    this.userId = localStorage.getItem("userId");
  }
  getCompanyList() {
    this.service.API_GET("Company/GetCompany").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.companyList = result.lstCompany;
      }
    })
  }
  getVendorList() {
    this.service.API_GET("Vendor/GetVendors").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.vendorList = result.lstVendor;

      }
    })
  }
  getUserList() {
    this.service.API_GET("Users/GetUsers").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.userList = result.lstUsers;
        this.getPurchaseList();
      }
    })
  }
  getPurchaseList() {
    this.service.API_GET("PurchaseMain/GetPurchaseMain").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        if (localStorage.getItem("isSuperUser")) {
          this.purchaseList = result.lstPurchaseMain;
        } else {
          this.purchaseList = result.lstPurchaseMain.filter(x => x.UserID === Number.parseInt(this.userId));
        }
      }
      this.purchaseListClone = [...this.purchaseList];
      this.purchaseList.forEach((element: any) => {
        let companyObj = this.companyList.filter(x => x.CompanyID === element.CompanyID)[0]
        element['CompanyName'] = companyObj.CompanyName
        element['PurchaseDateClone'] = new Date(element.PurchaseDate).toLocaleDateString("en-In")
        let vendorObj = this.vendorList.filter(x => x.VendorID === element.VendorID)[0]
        element['VendorName'] = vendorObj.VendorName
        let userObj = this.userList.filter(x => x.UserID === element.UserID)[0]
        element['UserName'] = userObj.UserName
      });
    })
  }
  searchByDate(event) {
    console.log(this.fromPurchaseDate)
    if(this.fromPurchaseDate.length == 2){
      let d1 = new Date(this.fromPurchaseDate[0]).toLocaleDateString("en-In")
      let d2 = new Date(this.fromPurchaseDate[1]).toLocaleDateString("en-In")
      this.purchaseList = this.purchaseListClone.filter(x=>x.PurchaseDateClone >= d1 && x.PurchaseDate <= d2)
    }else{
      this.purchaseList = this.purchaseListClone;
    }
  }
  searchPurchase() {
    if (this.searchValue.length > 2) {
      this.purchaseList = this.purchaseListClone.filter(x => (x.UserName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        (x.CompanyName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
        (x.VendorName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
        (x.Type.toLowerCase().includes(this.searchValue.toLowerCase()))));
    } else {
      this.purchaseList = this.purchaseListClone;
    }
  }
  downloadFile(id){
    const url = "PurchaseMain/DownloadFiles/"+id
    this.service.API_FILE_DOWNLOAD(url,'').subscribe((response:Blob) =>{
      if (response) {
        if (response.type != 'application/json') {
          var blob = new Blob([response]);
          let saveAs = require('file-saver');
          let file = "Bills";
          FileSaver.saveAs(blob, response.type);
        } else {
          this.service.showMessage('warning', 'File not found');
        }
      }
    })
  }
}
