import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxMaskPipe } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxMaskPipe],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  users = signal<UserResponse[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  availableRoles = signal<string[]>([]);
  selectedUser = signal<UserResponse | null>(null);
  isUpdatingRole = signal(false);

  ngOnInit() {
    this.loadUsers();
    this.loadAvailableRoles();
  }

  loadUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.errorMessage.set('No se pudieron cargar los usuarios. Verifica tus permisos.');
        this.loading.set(false);
      }
    });
  }

  loadAvailableRoles() {
    this.userService.getAvailableRoles().subscribe({
      next: (roles) => this.availableRoles.set(roles),
      error: (err) => console.error('Error cargando roles disponibles', err)
    });
  }

  onManageRoles(user: UserResponse) {
    if (this.selectedUser()?.id === user.id) {
      this.selectedUser.set(null);
    } else {
      this.selectedUser.set(user);
    }
  }

  hasRole(user: UserResponse, role: string): boolean {
    return user.roles.includes(role);
  }

  toggleRole(user: UserResponse, role: string) {
    if (this.isUpdatingRole()) return;

    const hasRole = this.hasRole(user, role);

    if (hasRole) return;

    this.isUpdatingRole.set(true);

    const request$ = hasRole
      ? this.userService.removeRole(user.id, role)
      : this.userService.assignRole(user.id, role);

    request$.subscribe({
      next: () => {
        this.users.update(allUsers =>
          allUsers.map(u => u.id === user.id
            ? { ...u, roles: [role] }
            : u
          )
        );

        const updatedUser = this.users().find(u => u.id === user.id);
        if (updatedUser) {
          this.selectedUser.set({ ...updatedUser });
        }

        this.toastr.success(`Rol asignado correctamente`);
        this.isUpdatingRole.set(false);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error al actualizar roles');
        this.isUpdatingRole.set(false);
      }
    });
  }
}
