// src/app/settings/user-roles-permissions/user-roles-permissions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Role {
  name: string;
  description: string;
  permissions: {
    viewClients: boolean;
    editClients: boolean;
    viewServices: boolean;
    editServices: boolean;
    manageUsers: boolean;
    manageSettings: boolean;
    viewReports: boolean;
  };
}

@Component({
  selector: 'app-user-roles-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-roles-permissions.component.html',
  styleUrls: ['./user-roles-permissions.component.scss']
})
export class UserRolesPermissionsComponent implements OnInit {
  roles: Role[] = [
    {
      name: 'Administrador',
      description: 'Acceso total al sistema y gestión de usuarios.',
      permissions: {
        viewClients: true, editClients: true,
        viewServices: true, editServices: true,
        manageUsers: true, manageSettings: true,
        viewReports: true
      }
    },
    {
      name: 'Supervisor',
      description: 'Supervisión de operaciones, acceso a reportes.',
      permissions: {
        viewClients: true, editClients: true, // Puede editar clientes para reasignaciones
        viewServices: true, editServices: true,
        manageUsers: false, manageSettings: false,
        viewReports: true
      }
    },
    {
      name: 'Técnico',
      description: 'Gestión de servicios asignados.',
      permissions: {
        viewClients: true, editClients: false, // Solo ver clientes para servicios
        viewServices: true, editServices: true, // Puede actualizar sus servicios
        manageUsers: false, manageSettings: false,
        viewReports: false
      }
    },
    {
      name: 'Atención a Cliente',
      description: 'Gestión de clientes y creación de servicios.',
      permissions: {
        viewClients: true, editClients: true,
        viewServices: true, editServices: true,
        manageUsers: false, manageSettings: false,
        viewReports: false
      }
    },
  ];

  selectedRole: Role | null = null;
  newRoleName: string = '';
  newRoleDescription: string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.roles.length > 0) {
      this.selectedRole = this.roles[0]; // Seleccionar el primer rol por defecto
    }
  }

  selectRole(role: Role): void {
    this.selectedRole = role;
  }

  addNewRole(): void {
    if (this.newRoleName.trim() && !this.roles.find(r => r.name === this.newRoleName.trim())) {
      const newRole: Role = {
        name: this.newRoleName.trim(),
        description: this.newRoleDescription.trim(),
        permissions: {
          viewClients: false, editClients: false,
          viewServices: false, editServices: false,
          manageUsers: false, manageSettings: false,
          viewReports: false
        }
      };
      this.roles.push(newRole);
      this.selectedRole = newRole;
      this.newRoleName = '';
      this.newRoleDescription = '';
      alert('Nuevo rol añadido (simulado).');
      console.log('Roles actualizados:', this.roles);
    } else {
      alert('El nombre del rol es inválido o ya existe.');
    }
  }

  saveRolePermissions(): void {
    if (this.selectedRole) {
      // Aquí enviarías los cambios de permisos para el selectedRole a tu API
      console.log('Guardando permisos para el rol:', this.selectedRole.name, this.selectedRole.permissions);
      alert(`Permisos para el rol '${this.selectedRole.name}' guardados (simulado).`);
    }
  }
}