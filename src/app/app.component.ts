import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from './services/comman.services';
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = false;
  isLogin =false;
  isSuperAdmin = false;
  constructor(private service : CommonService,private route : Router,private router:ActivatedRoute,
    public platform: Platform){
      this.loadModalPwa();
    if(this.service.checkLogin()){
      this.isLogin = true;
    }else{
      this.isLogin = false;
    }
    if(localStorage.getItem("isSuperUser")){
      this.isSuperAdmin = true
    }
  }
  logout(){
    localStorage.clear();
    this.route.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
  modalPwaPlatform: string|undefined;
  modalPwaEvent: any;

  loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

    if (this.platform.IOS && this.platform.SAFARI) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.modalPwaPlatform = 'IOS';
      }
    }
  }

  public addToHomeScreen(): void {
    this.modalPwaEvent.prompt();
    this.modalPwaPlatform = undefined;
  }

  public closePwa(): void {
    this.modalPwaPlatform = undefined;
  }
} 
