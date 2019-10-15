import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DashboardService, FundsService } from 'src/app/services';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-dailyfunds',
    templateUrl: './dailyfunds.component.html',
})

export class DailyfundsComponent implements OnInit {
    // Define variables
    page: number = 1;
    total: number;

    perPage = new FormControl(15);
    status = new FormControl('');
    date = new FormControl('');

    funds: any;

    editable: boolean;
    edit_index: any;
    price: any;
    // Datepicker Variables
    datepickerConfig: Partial<BsDatepickerConfig>;

    loading: boolean = false;
    /**
     * Class constructor
     * 
     * @param router
     * @param DS 
     */
    constructor(private router: Router, private DS: DashboardService, private FS: FundsService) { 
        this.editable = false;
    }

    /**
     * Sets datepicker config
     */
    setDatepickerConfig() {
        this.datepickerConfig = Object.assign({},
            {
                containerClass: 'theme-dark-blue datepicker-container-wrap',
                showWeekNumbers: false,
                dateInputFormat: 'DD MMM YYYY',
                dateOutputFormat: 'YYYY-MM-DD',
                isAnimated: true,
                adaptivePosition: true,
            }
        );
    }

    /**
     * Loads current page data
     * 
     * @param page 
     */
    getPage(page: number) {
        var date = this.date.value;
        var params = {
            offset: page - 1,
            per_page: this.perPage.value,
            status: this.status.value == '' ? '' : this.status.value.toString(),
            date: date == '' || date == null ? '' : moment(date).format('YYYY-MM-DD'),
        };

        this.loading = true;

        this.DS.getAllDailyFunds(params)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(
                (res: any) => {
                    this.funds = res.items;
                    this.total = res.total;
                    this.page = page;
                },
                () => {
                    this.router.navigate(['/dashboard']);
                }
            )
    }

    /**
     * Values changes callback
     */
    onChange() {
        this.date.valueChanges.subscribe(() => this.getPage(1));
        this.status.valueChanges.subscribe(() => this.getPage(1));
        this.perPage.valueChanges.subscribe(() => this.getPage(this.page));
    }

    /**
     * Clears date field
     */
    clearDate() {
        if (this.date.value != '' && this.date.value != null) {
            this.date.reset();
        }
        return;
    }

    /**
     * OnInit callback
     */
    ngOnInit() {
        this.setDatepickerConfig();
        this.getPage(1);
        this.onChange();
    }

    /**
     * Returns rowspan
     * 
     * @param date 
     */
    getRowSpan(date: string) {
        return this.funds.filter((obj: any) => obj.as_at === date).length;
    }

    /**
     * Status change callback
     * 
     * @param date 
     * @param status 
     */
    statusChange(date: any, status: number) {
        date = moment(date, 'DD MMM YYYY').format('YYYY-MM-DD');
        this.DS.statusChange(date, status)
            .subscribe(
                () => {
                    this.getPage(this.page);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }
    /**
     * edit funds price
     * 
     * @param ID
     * @param value
     */
    editFunds(id: any, value: any) {
        this.edit_index = id;
        this.editable = !this.editable;
        this.price = value.price;
    }

    /**
     * save funds price
     * 
     * @param ID
     */
    saveFunds(id: any, value: any) {
        let data = {
            id: value['id'],
            price: parseFloat(this.price)
        }
        this.FS.saveFundPrice(data)
            .subscribe(
                (res) => {
                    if(res['status_code'] == 200) {
                        this.getPage(1);
                    }
                }
            );
        this.editable =! this.editable;
    }
    
}
