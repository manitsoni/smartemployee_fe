import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, catchError, count } from "rxjs/operators";
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root",
})
export class CommonService {
    constructor(private _http: HttpClient,
        private message: NzMessageService) {

    }
    showMessage(type: string,message): void {
        this.message.create(type,message);
    }
    environmentUrl = "http://localhost:16940/api/"
    API_POST(URL: string, data: any) : Observable<any>{
        const httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
            })
        };

        return this._http
            .post<any>(
                `${this.environmentUrl}${URL}`,
                data
            )
            .pipe(
                map(data => {
                    return data
                }),
                catchError(err => {
                    return err;
                })
            );
    }
    API_GET(URL: string) : Observable<any> {
        return this._http
            .get<any>(
                `${this.environmentUrl}${URL}`
            )
            .pipe(
                map(data => {
                    return data
                }),
                catchError(err => {
                    return err;
                })
            );
    }
    API_DELETE(Url,data:any): Observable<any> {
        
        return this._http
          .post<any>(
            `${this.environmentUrl}${Url}`,
            data    
          )
          .pipe(
            map(data => {
              return data;
            }),
            catchError(err => {
              return err
            })
          );
      }
    checkLogin() : boolean{
        if(localStorage.getItem("loggedUser")){
            return true;
        }
        else{
            return false;
        }
    }
    API_FILE_DOWNLOAD(URL, configurations, Options?): Observable<any> {
        var responseType = "blob";
        let path = `${this.environmentUrl}${URL}`;
        return this._http
          .post<Blob>(
            path,
            configurations,
            responseType ? {responseType: responseType } : (Options ? Options : {  })
              .pipe);
      }
}