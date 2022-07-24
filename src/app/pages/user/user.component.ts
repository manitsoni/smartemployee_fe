import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/comman.services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isVisible = false;
  userList = []
  userListClone = [];
  isExists = false;
  companyList = [];
  searchValue: string = "";
  selectedCompany;
  constructor(private service: CommonService, private fb: FormBuilder, private router: Router) {
    if (!this.service.checkLogin()) {
      this.router.navigate(['/login']);
    }
  }
  user: FormGroup;
  ngOnInit(): void {
    this.getCompanyList();
    this.getUserList();
    this.userForm();
  }
  openModel() {
    this.isVisible = !this.isVisible;
  }
  getCompanyList() {
    this.service.isLoader = true;

    this.service.API_GET("Company/GetCompany").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.service.isLoader = false;

        this.companyList = result.lstCompany;
      }
    })
  }
  getUserList() {
    this.service.isLoader = true;
    this.service.API_GET("Users/GetUsers").subscribe(response => {
      let result = response.result;
      if (result.IsSuccess) {
        this.userList = result.lstUsers;
        this.service.isLoader = false;

      }
      this.userList.forEach(element => {
        var companyObj = this.companyList.filter(x => x.CompanyID === element.CompanyID)[0]
        element['CompanyName'] = companyObj.CompanyName
      });
      this.userListClone = [...this.userList]
    })
  }
  userForm() {
    this.user = this.fb.group({
      userId: [null],
      userName: ['', [Validators.required]],
      companyId: [0, [Validators.required]],
      password: [null, [Validators.required]],
      isMultiUser: [false]
    });
  }
  get userFormControl() {
    return this.user.controls;
  }
  patchRecords(id) {
    this.userForm();
    if (id) {
      var data = this.userList.filter(x => x.UserID === id)[0];
      if (data) {
        this.user.controls.userId.setValue(data.UserID);
        this.user.controls.userName.setValue(data.UserName);
        this.selectedCompany = data.CompanyID;
        this.user.controls.companyId.setValue(data.CompanyID);
        this.user.controls.password.setValue(data.Password);
        this.user.controls.isMultiUser.setValue(data.IsMultiUser);
        this.openModel();
      }
    }
  }
  deleteRecord(id) {

  }
  saveUser() {
    this.user.markAllAsTouched();
    if (this.user.valid) {
      if (this.user.value['userId'] === null) {
        this.userList.forEach(element => {
          if (element.UserName === this.user.value['userName']) {
            this.isExists = true;
          }
        });
        if (!this.isExists) {
          var data = {
            UserName: this.user.value['userName'],
            CompanyID: this.user.value['companyId'],
            Password: this.user.value['password'],
            IsMultiUser: this.user.value['isMultiUser']
          }
          this.service.isLoader = true;

          this.service.API_POST("Users/AddUser", data).subscribe(response => {
            let result = response;
            if (result.isSuccess) {
              this.openModel();
              this.service.showMessage('success', 'User Added Successfully!')
              this.getUserList();
              this.user.reset();
              this.service.isLoader = false;

            }
            this.isExists = false;
          }, (error) => {
            this.openModel();
            this.user.reset();
            this.isExists = false;
            this.service.isLoader = false;

            this.service.showMessage('error', 'Error while adding data, please try again!')
          })
        } else {
          this.service.showMessage('info', 'User Already Exists!');
          this.isExists = false;
          this.service.isLoader = false;

        }
      } else {
        if (this.user.value['userId'] > 0) {
          this.userList.forEach(element => {
            if (element.UserName === this.user.value['userName']) {
              if (element.UserID !== this.user.value['userId']) {
                this.isExists = true;
              }
            }
          });
          if (!this.isExists) {
            var form = {
              UserID: this.user.value['userId'],
              UserName: this.user.value['userName'],
              CompanyID: this.user.value['companyId'],
              Password: this.user.value['password'],
              IsMultiUser: this.user.value['isMultiUser']
            }
            this.service.isLoader = true;

            this.service.API_POST("Users/AddUser", form).subscribe(response => {
              let result = response;
              if (result.isSuccess) {
                this.openModel();
                this.service.showMessage('success', 'User Update Successfully!')
                this.getUserList();
                this.user.reset();
                this.service.isLoader = false;

              }
              this.isExists = false;
            }, (error) => {
              this.openModel();
              this.user.reset();
              this.isExists = false;
              this.service.isLoader = false;

              this.service.showMessage('error', 'Error while updating data, please try again!')
            })
          } else {
            this.service.isLoader = false;

            this.service.showMessage('info', 'User Already Exists!');
            this.isExists = false;
          }
        }
      }
    }
  }
  searchUser() {
    if (this.searchValue.length > 2) {
      this.userList = this.userListClone.filter(x => (x.UserName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        (x.CompanyName.toLowerCase().includes(this.searchValue.toLowerCase()))));
    } else {
      this.userList = this.userListClone;
    }
  }
}
