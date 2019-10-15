import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import SimpleCrypto from "simple-crypto-js";
import { UrlService } from './url.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private _secretKey = "x9$lPGl1BWdQfVLpQd@J8r*ylY#1wu9j6OpXO7tEnM";
    private simpleCrypto: any;
    public currentUser: any = null;

    constructor(
        private http: HttpClient,
        private url: UrlService
    ) {
        this.simpleCrypto = new SimpleCrypto(this._secretKey);
    }

    public getUsers() {
        return this.http.get(this.url.get('getusers'));
    }

    public addNewUser(param: any) {
        return this.http.post(this.url.get('addnewuser'), param);
    }

    public deleteUserById(id: any) {    
        return this.http.post(this.url.get('deleteuser'), id);
    }

    public updateUserById(data: any) {
        return this.http.post(this.url.get('edituser'), data);
    }

    public update(data: any) {
        return this.http.post(this.url.get('updateuser'), data);
    }

    public activeUser(id: any) {
        return this.http.post(this.url.get('activeUser'), id);
    }
}
