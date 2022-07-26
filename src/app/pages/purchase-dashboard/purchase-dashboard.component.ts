import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/comman.services';
import * as FileSaver from 'file-saver'
import { NzImageService } from 'ng-zorro-antd/image';
import { HttpClient } from '@angular/common/http';
import { SearchModel } from './purchase-model';
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
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  p: number = 1;
  isVisible: boolean = false;
  isMobile: boolean = false;
  imageUrl: any[] = [];
  currentUpload: string = "";
  selectedFiles: Array<File> = [];
  popupDetails: any;
  isMoreVisible: boolean;
  isAdvSearch: boolean = false;
  selectedCompany: string = "";
  selectedVendor: string = "";
  selectedUser: string = "";
  fromDate: Date;
  toDate: Date;
  model: SearchModel = new SearchModel();
  isDateFiltered = false;
  total = 0;
  constructor(private service: CommonService, private nzImageService: NzImageService, public http: HttpClient) {
    this.isSuperAdmin = localStorage.getItem("isSuperUser") && localStorage.getItem("isSuperUser").length > 0 ? true : false;
    if (window.innerWidth < 560) {
      this.isMobile = true
    }
  }

  ngOnInit(): void {
    this.service.isLoader = true;
    this.getCompanyList();
    this.userId = localStorage.getItem("userId");
  }
  refresh() {
    this.service.isLoader = true;
    this.getCompanyList();
    this.userId = localStorage.getItem("userId");
  }
  openView(purchaseId) {
    this.service.isLoader = true;
    var url = "PurchaseMain/GetFiles/" + purchaseId
    this.imageUrl = [];
    this.service.API_POST(url, null).subscribe(res => {
      // this.imageUrl = res;
      this.service.isLoader = false;
      this.nzImageService.preview(res, { nzZoom: 1.5, nzRotate: 0, nzNoAnimation: true });
    });

    // const images = [
    //   {
    //     src: 'https://www.mculine.com/s3image/banner/Img_1658477001219.png',
    //     width: 'auto',
    //     height: 'auto',
    //     alt: 'ng-zorro'
    //   },
    //   {
    //     src: 'https://www.mculine.com/s3image/banner/Img_1658570632268.png',
    //     width: 'auto',
    //     height: 'auto',
    //     alt: 'angular'
    //   }
    // ];
  }
  getCompanyList() {
    this.service.API_GET("Company/GetCompany").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.companyList = result.lstCompany;
        this.getVendorList();
      } else {
        this.service.isLoader = false
        this.service.showMessage("warning", result.Message)
      }
    })
  }
  getVendorList() {
    this.service.API_GET("Vendor/GetVendors").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.vendorList = result.lstVendor;
        this.getUserList();
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
    this.isDateFiltered = false;
    this.service.API_GET("PurchaseMain/GetPurchaseMain").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.service.isLoader = false;
        if (localStorage.getItem("isSuperUser")) {
          this.purchaseList = result.lstPurchaseMain.reverse();
        } else {
          this.purchaseList = result.lstPurchaseMain.filter(x => x.UserID === Number.parseInt(this.userId)).reverse();
        }
      }
      
      this.purchaseList.forEach((element: any) => {
        let companyObj = this.companyList.filter(x => x.CompanyID === element.CompanyID)[0]
        element['CompanyName'] = companyObj.CompanyName
        element['PurchaseDateClone'] = new Date(element.PurchaseDate).toLocaleDateString("en-In")
        let vendorObj = this.vendorList.filter(x => x.VendorID === element.VendorID)[0]
        element['VendorName'] = vendorObj.VendorName
        let userObj = this.userList.filter(x => x.UserID === element.UserID)[0]
        element['UserName'] = userObj.UserName
      });
      this.purchaseListClone = [...this.purchaseList];
    })
  }
  searchByDate(event) {
    console.log(this.fromPurchaseDate)
    if (this.fromPurchaseDate.length == 2) {
      let d1 = new Date(this.fromPurchaseDate[0]).toLocaleDateString("en-In")
      let d2 = new Date(this.fromPurchaseDate[1]).toLocaleDateString("en-In")
      this.purchaseList = this.purchaseListClone.filter(x => x.PurchaseDateClone >= d1 && x.PurchaseDate <= d2)
    } else {
      this.purchaseList = this.purchaseListClone;
    }
  }
  searchPurchase() {
    if (this.searchValue.length > 2) {
      if (this.isDateFiltered) {
        this.purchaseList = this.purchaseList.filter(x => (x.UserName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          (x.CompanyName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (x.VendorName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (x.Type.toLowerCase().includes(this.searchValue.toLowerCase()))));
      } else {
        this.purchaseList = this.purchaseListClone.filter(x => (x.UserName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          (x.CompanyName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (x.VendorName.toLowerCase().includes(this.searchValue.toLowerCase())) ||
          (x.Type.toLowerCase().includes(this.searchValue.toLowerCase()))));
      }
    } else {
      if(this.isDateFiltered){
        this.advanceSearch();
      }else{
        this.purchaseList = this.purchaseListClone;

      }
    }
  }
  downloadFile(id) {
    const url = "PurchaseMain/DownloadFiles/" + id
    this.service.API_FILE_DOWNLOAD(url, '').subscribe((response: Blob) => {
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
  openMore(id) {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.currentUpload = id
    } else {
      this.currentUpload = "";
    }
  }
  fileChange(event) {
    this.selectedFiles = [];
    const files: FileList = event.target.files;
    const fileList = new Array<File>();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files.item(i).name, files.item(i));
      fileList.push(files.item(i));
    }
    this.selectedFiles = fileList;
  }
  uploadFile() {
    if (this.currentUpload) {
      const formData = new FormData();
      for (var i = 0; i < this.selectedFiles.length; i++) {
        formData.append("postedFiles", this.selectedFiles[i]);
      }
      let id = this.currentUpload;
      let url = "https://smartemployee20220718194837.azurewebsites.net/api/PurchaseMain/UploadFiles/" + id;
      this.service.isLoader = true;
      this.http.post(url, formData).subscribe((res: any) => {
        console.log(res)
        if (typeof (res) === 'object') {
          this.service.showMessage('success', 'File Uploaded Successfully!')
          this.selectedFiles = [];
          this.service.isLoader = false;
          this.openMore('');
        }
      }, (error => {
        if (error.status === 200) {
          this.service.showMessage('success', 'File Uploaded Successfully!')
          this.selectedFiles = [];
          this.service.isLoader = false;
          this.openMore('');
        }
      }))
    }
  }
  openShowMore(id) {
    if (id !== '' && this.purchaseList) {
      this.popupDetails = this.purchaseList.filter(x => x.PurchaseMainID === id)[0]
      this.isMoreVisible = true;
    } else {
      this.popupDetails = null;
      this.isMoreVisible = false;
    }
  }
  showSearch() {
    this.isAdvSearch = !this.isAdvSearch
    // if (!this.isAdvSearch) {
    //   this.model = new SearchModel();
    //   this.fromDate = null;
    //   this.toDate = null;
    // }
  }
  advanceSearch() {
    if (this.purchaseList) {
      // if (!this.purchaseList || this.purchaseList.length === 0) {
      //   return this.purchaseList = this.purchaseListClone
      // };
      // if (!this.model || !this.model.selectedUser && !this.model.selectedVendor && !this.model.selectedCompany && !this.fromDate && !this.toDate) {
      //   return this.purchaseList = this.purchaseListClone
      // };
      let d1 = Date.parse(this.model.selectedFromDate.toDateString())
      let d2 = Date.parse(this.model.selectedToDate.toDateString())
      if (d1 && d2) {
        this.purchaseList = this.purchaseListClone.filter((data) => {          
          return ((!d1 || Date.parse(data.PurchaseDate) >= d1) &&
                  (!d2 || Date.parse(data.PurchaseDate) <= d2));
        })
        this.isDateFiltered = true;
        this.isAdvSearch = false;
      } else {
        this.purchaseList = this.purchaseListClone;
        this.service.showMessage("info", "Please, Select Date")
      }

    }
  }
}
