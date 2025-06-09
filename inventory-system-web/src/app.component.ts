import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '@services';
import * as UserActions from "@store/user.actions";

import { AppState } from './app/app.reducers';
import { User } from '@models';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, ConfirmDialogModule],
    template: `
        <p-toast position="bottom-right"></p-toast>
        <p-confirmDialog key="generalConfirmDialog" [style]="{width: '50vw'}"></p-confirmDialog>
        <router-outlet></router-outlet>
    `
})
export class AppComponent implements OnInit{
    constructor(private userService: UserService, private store: Store<AppState>,private messageService: MessageService){}

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(){
        this.userService.getUsers().subscribe(e=>{
            this.store.dispatch(UserActions.setList({users: e as User[]}));
        })
    }
}
