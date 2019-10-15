import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, UserService } from 'src/app/services';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UiSwitchComponent } from 'ngx-ui-switch';
@Component({
    selector: 'app-user-manage',
    templateUrl: './user-manage.component.html',
    styles: []
})

export class UserManagementComponent implements OnInit {
    page: number = 1;
    total: number;

    addForm: FormGroup;
    perPage = new FormControl(15);
    users: any;
    modalRef: BsModalRef;
    loading: boolean = false;
    submitted = false;
    config = {
        keyboard: false,
        ignoreBackdropClick: true
    };
    editable: boolean;
    edit_index: any;
    id: any;
    firstname: any;
    lastname: any;
    email: any;
    /**
     * Class constructor
     * 
     * @param router
     * @param DS 
     */
    constructor(private router: Router, 
                private DS: DashboardService, 
                private MS: BsModalService,
                private FB: FormBuilder,
                private formBuilder: FormBuilder,
                private US: UserService) { 

        this.addForm = this.FB.group({
            firstname: null,
            lastname: null,
            email: null,
            password: null,
            confirm_pass: null
        });
        this.editable = false;
    }

    get f() {
        return this.addForm.controls;
    }

    passwordMatchValidator(password: string): ValidatorFn {
        return (control: FormControl) => {
          console.log(control);
          this.submitted = false;
          if (!control || !control.parent) {
            return null;
          }
          return control.parent.get(password).value === control.value ? null : { mismatch: true };
        };
     }
    /**
     * get all users
     * 
     * 
     */
    getUsers() {
        this.US.getUsers().subscribe(
            (res)=>{
                this.users = res['data'];
            }
        )
    }

    addNewUser() {
        this.submitted = true;
        if(this.addForm.invalid) {
            return;
        }
        let data = {
            firstname: this.f.firstname.value,
            lastname: this.f.lastname.value,
            email:this.f.email.value,
            password: this.f.password.value
        }
        this.US.addNewUser(data).subscribe(
            (res) =>{
                if(res == "success") {
                    this.getUsers();
                }else {
                    alert("Something went gone error.");
                }
            }
        )
        this.clear();
        this.MS.hide(1);
        this.submitted = false;
    }

    deleteUser(id: any) {
        this.US.deleteUserById(id).subscribe((res)=> {
            if(res['status_code'] == 200) {
                this.getUsers();
            }
        })
    }

    openModal(e: any, template: TemplateRef<any>) {
        e.preventDefault();
        this.modalRef = this.MS.show(template, this.config);
    }

    clear() {
        this.addForm.reset();
    }
    editUser(id: any, value: any) {
        this.edit_index = id;
        this.editable = !this.editable;
        this.id = value['id'];
        this.firstname = value['firstname'];
        this.lastname = value['lastname'];
        this.email = value['email'];
    }

    updateUser() {
        let data = {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
        }
        this.US.updateUserById(data).subscribe((res) => {
            if(res['status_code'] == 200) {
                this.getUsers();
            }
        });
        this.editable =! this.editable;
    }

    onChangeActive(event: Event, id: any) {
        let data = {
            id: id,
            status: event
        };

        this.US.activeUser(data).subscribe((res)=> {
            if(res['status_code'] == 200) {

            }
        });
    }
    /**
     * OnInit callback
     */
    ngOnInit() {
        this.addForm = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirm_pass: ['', [Validators.required, this.passwordMatchValidator('password')]],
        })
        this.getUsers();
    }
}
