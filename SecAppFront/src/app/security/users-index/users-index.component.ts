import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { GenericListComponent } from '../../shared/components/generic-list/generic-list.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UserProfileDTO } from '../userCredentialsDTO';
import { SecurityService } from '../security.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";


@Component({
  selector: 'app-users-index',
  imports: [MatButtonModule, MatTableModule, GenericListComponent, MatPaginatorModule, SweetAlert2Module, NgIf, MatIconModule],
  templateUrl: './users-index.component.html',
  styleUrl: './users-index.component.css'
})
export class UsersIndexComponent {
  columnsToDisplay = ['email', 'actions'];
  pagination = { page: 1, recordsPerPage: 10 };
  totalRecords = 0;

  users:UserProfileDTO[]=[];
  securityService = inject(SecurityService);

  constructor() {

  }

  getUsers() {
    this.securityService.getUsers(this.pagination)
    .subscribe(response => {
      this.users = response.body as UserProfileDTO[];
      const header = response.headers.get('totalRecords') as string;
      this.totalRecords = parseInt(header, 10);
    });
  }

  onPaginateChange(data:PageEvent) {
    this.pagination = {
      page: data.pageIndex + 1, // PageEvent is zero-based
      recordsPerPage: data.pageSize,
    };
    this.getUsers();
  }

  makeAdmin(email: string){
    this.securityService.makeAdmin(email)
    .subscribe(()=>{
      Swal.fire("Listo!", `El usuario ${email} fue promovido a administrador`, 'success');
    });
  }

  removeAdmin(email: string) {
    this.securityService.removeAdmin(email)
    .subscribe(()=>{
      Swal.fire("Ok!", `El usuario ${email} fue removido de los privilegios Administrador`, 'success');
    });
  }
}
