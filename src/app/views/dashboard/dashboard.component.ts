import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit {

    is_admin: any;

    /**
     * Class constructor
     * 
     * @param auth 
     * @param router 
     */

    constructor() { }

    /**
     * On Init callback
     */
    ngOnInit() {
        this.is_admin = localStorage.getItem('admin') ? localStorage.getItem('admin') : 0;
        console.log("admin", this.is_admin);
    }
}
