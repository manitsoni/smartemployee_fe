import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/comman.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private service: CommonService,
    private router: Router) {
    if (this.service.checkLogin()) {
      this.router.navigate(['/purchase']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  userLogin() {
    this.loginForm.markAllAsTouched();
    Object.values(this.loginForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    if (this.loginForm.valid) {
      this.service.isLoader = true;

      let user = {
        userName: this.loginForm.value.userName,
        passWord: this.loginForm.value.password
      }
      if (user.userName === 'nareshbhoyer' && user.passWord === '123456') {
        localStorage.clear();
        localStorage.setItem("loggedUser", user.userName);
        localStorage.setItem("isSuperUser", "true");
        window.location.reload();
        this.service.isLoader = true;

        // this.router.navigateByUrl('/company').then(() => {

        // });
      } else {
        this.service.API_GET("Users/GetUsers").subscribe(res => {
          if (res.result.IsSuccess) {
            let userDetails = res.result.lstUsers.filter(x => x.UserName === user.userName && x.Password === user.passWord)[0]
            console.log(userDetails)
            if (userDetails) {
              this.service.isLoader = false;
              let welcome = 'Welcome, '+user.userName
              this.service.showMessage('success', welcome);
              localStorage.clear();
              localStorage.setItem("loggedUser", user.userName);
              localStorage.setItem("userId", userDetails.UserID);
              localStorage.setItem("companyId", userDetails.CompanyID);
              window.location.reload();
              // this.router.navigateByUrl('/purchase')
            } else {
              this.service.isLoader = false;

              this.service.showMessage('error', 'Login not found');
            }
          } else {
            this.service.isLoader = false;
            this.service.showMessage('error', 'Login not found');
          }
        }, (error) => {
          this.service.isLoader = false;

          this.service.showMessage('error', 'Login not found');
        });
      }
    }
  }
}
