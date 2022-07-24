import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/comman.services';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyList = [];
  isVisible = false;
  isExists = false;
  isValidation = false;
  companyForm: FormGroup;
  constructor(private service: CommonService, private fb: FormBuilder, private router: Router) {
    if (!this.service.checkLogin()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.getCompanyList();
    this.companyForm = this.fb.group({
      companyId: [0],
      companyName: ['', [Validators.required]]
    });
  }
  getCompanyList() {
    this.service.isLoader = true;
    this.service.API_GET("Company/GetCompany").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.companyList = result.lstCompany;
        this.service.isLoader = false;
      }
    })
  }
  openModel() {
    this.isVisible = !this.isVisible;
  }
  patchRecords(id) {
    if (id) {
      var data = this.companyList.filter(x => x.CompanyID === id)[0];
      if (data) {
        this.companyForm.controls.companyId.setValue(data.CompanyID);
        this.companyForm.controls.companyName.setValue(data.CompanyName);
        this.openModel();
      }
    }
  }
  get companyFormControl() {
    return this.companyForm.controls;
  }
  saveCompany() {
    this.companyForm.markAllAsTouched();
    if (this.companyForm.valid) {
      if (this.companyForm.value['companyId'] === 0) {
        this.companyList.forEach(element => {
          if (element.CompanyName === this.companyForm.value['companyName']) {
            this.isExists = true;
          }
        });
        if (!this.isExists) {
          var data = {
            CompanyName: this.companyForm.value['companyName']
          }
          this.service.isLoader = true;

          this.service.API_POST("Company/AddCompany", data).subscribe(response => {
            let result = response;
            if (result.isSuccess) {
              this.openModel();
              this.service.showMessage('success', 'Company Added Successfully!')
              this.getCompanyList();
              this.companyForm.reset();
              this.service.isLoader = false;

            }
            this.isExists = false;
          }, (error) => {
            this.openModel();
            this.companyForm.reset();
            this.isExists = false;
            this.service.isLoader = false;
            this.service.showMessage('error', 'Error while adding data, please try again!')
          })
        } else {
          this.service.showMessage('info', 'Company Already Exists!');
          this.isExists = false;
        }
      } else {
        if (this.companyForm.value['companyId'] > 0) {
          this.companyList.forEach(element => {
            if (element.CompanyName === this.companyForm.value['companyName']) {
              if (element.CompanyID !== this.companyForm.value['companyId']) {
                this.isExists = true;
              }
            }
          });
          if (!this.isExists) {
            var form = {
              CompanyID: this.companyForm.value['companyId'],
              CompanyName: this.companyForm.value['companyName']
            }
            this.service.isLoader = true;

            this.service.API_POST("Company/AddCompany", form).subscribe(response => {
              let result = response;
              if (result.isSuccess) {
                this.openModel();
                this.service.showMessage('success', 'Company Update Successfully!')
                this.getCompanyList();
                this.service.isLoader = false;

                this.companyForm.reset();
              }
              this.isExists = false;
            }, (error) => {
              this.openModel();
              this.companyForm.reset();
              this.isExists = false;
              this.service.isLoader = false;

              this.service.showMessage('error', 'Error while updating data, please try again!')
            })
          } else {
            this.service.showMessage('info', 'Company Already Exists!');
            this.isExists = false;
          }
        }
      }
    }
  }
  deleteRecord(id) {
    if (id) {
      var data = {
        CompanyID: parseInt(id)
      }
      this.service.isLoader = true;

      this.service.API_DELETE("Company/DeleteCompany", data).subscribe(response => {
        let result = response;
        if (result.isSuccess) {
          this.service.isLoader = false;

          this.service.showMessage('success', 'Company Delete Successfully!')
          this.getCompanyList();
          this.companyForm.reset();
        }
      }, (error) => {
        this.companyForm.reset();
        this.service.showMessage('error', 'Error while deleting data, please try again!')
      })
    }
  }
}
