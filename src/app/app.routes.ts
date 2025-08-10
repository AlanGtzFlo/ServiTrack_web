import { Routes } from '@angular/router';
import { authGuard } from './auth.guard'; // Importamos el nuevo guardian de ruta

// Componentes de autenticación y principales
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { DashboardComponent } from './inicio/dashboard/dashboard.component';

// Componentes de Clientes
import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { NewClientComponent } from './clients/new-client/new-client.component';

// Componentes de Políticas
import { PoliciesComponent } from './policies/policies.component';
import { PolicyDetailComponent } from './policies/policy-detail/policy-detail.component';
import { NewPolicyComponent } from './policies/new-policy/new-policy.component';

// Componentes de Servicios
import { ServicesComponent } from './services/services.component';
import { ServiceDetailComponent } from './services/service-detail/service-detail.component';
import { NewServiceComponent } from './services/new-service/new-service.component';

// Componentes de Usuarios
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { NewUserComponent } from './users/new-user/new-user.component';

// Componentes de Refacciones
import { RefaccionesListComponent } from './refacciones/refacciones-list/refacciones-list.component';
import { NuevaRefaccionComponent } from './refacciones/nueva-refaccion/nueva-refaccion.component';
import { RefaccionDetailComponent } from './refacciones/refaccion-detail/refaccion-detail.component';

// Componentes de Reportes
import { ReportsComponent } from './reports/reports.component';
import { NewReportComponent} from './reports/new-report/new-report.component';
import { MessageReportFormComponent } from './reports/message-report-form/message-report-form.component';

// Componentes de Configuración
import { SettingsComponent } from './settings/settings.component';
import { GeneralSettingsComponent } from './settings/general-settings/general-settings.component';
import { UserRolesPermissionsComponent } from './settings/user-roles-permissions/user-roles-permissions.component';
import { ServiceMasterDataComponent } from './settings/service-master-data/service-master-data.component';
import { NotificationsSettingsComponent } from './settings/notifications-settings/notifications-settings.component';

// Componente de Satisfacción
import { SatisfactionComponent } from './satisfaction/satisfaction.component';

// Componentes del PORTAL PÚBLICO
import { PublicLayoutComponent } from './public-portal/public-layout/public-layout.component';
import { HomePageComponent } from './public-portal/home-page/home-page.component';
import { ServiceStatusComponent } from './public-portal/service-status/service-status.component';
import { FeedbackFormComponent } from './public-portal/feedback-form/feedback-form.component';
import { AboutPageComponent } from './public-portal/about-page/about-page.component';

// NUEVO: Componentes de Ubicaciones
import { UbicacionesListComponent } from './ubicaciones/ubicaciones-list/ubicaciones-list.component';
import { UbicacionFormComponent } from './ubicaciones/ubicacion-form/ubicacion-form.component';
import { UbicacionDetailComponent } from './ubicaciones/ubicacion-detail/ubicacion-detail.component';

export const routes: Routes = [
  // Ruta raíz y login
  { path: '', redirectTo: '/public/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Rutas accesibles por todos (admin y tecnico)
  { path: 'inicio', component: InicioComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  
  // Clientes y Políticas
  { path: 'clients', component: ClientsComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'clients/new', component: NewClientComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'clients/edit/:id', component: NewClientComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'clients/:id', component: ClientDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } }, // Acceso a detalle para técnico

  { path: 'policies', component: PoliciesComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'policies/new', component: NewPolicyComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'policies/:id', component: PolicyDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } }, // Acceso a detalle para técnico

  // Servicios y Reportes (accesibles por todos)
  { path: 'services', component: ServicesComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'services/new', component: NewServiceComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'services/:id', component: ServiceDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },

  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard],
    data: { roles: ['admin', 'tecnico'] },
    children: [
      { path: 'new', component: NewReportComponent },
      { path: 'message-report-form', component: MessageReportFormComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  },

  // Usuarios y Refacciones
  { path: 'users', component: UsersComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'users/new', component: NewUserComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } }, // Acceso a detalle para técnico

  { path: 'refacciones', component: RefaccionesListComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'refacciones/nueva', component: NuevaRefaccionComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } },
  { path: 'refacciones/:id', component: RefaccionDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } }, // Acceso a detalle para técnico
  
  // Ubicaciones, Satisfacción y Configuración
  { path: 'satisfaction', component: SatisfactionComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  
  { path: 'ubicaciones', component: UbicacionesListComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'ubicaciones/nueva', component: UbicacionFormComponent, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'ubicaciones/:id', component: UbicacionDetailComponent, canActivate: [authGuard], data: { roles: ['admin', 'tecnico'] } }, // Acceso a detalle para técnico
  
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'user-roles', component: UserRolesPermissionsComponent },
      { path: 'service-master-data', component: ServiceMasterDataComponent },
      { path: 'notifications', component: NotificationsSettingsComponent },
      { path: '**', redirectTo: 'general' }
    ]
  },

  // Rutas del portal público (sin protección)
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePageComponent },
      { path: 'status', component: ServiceStatusComponent },
      { path: 'feedback', component: FeedbackFormComponent },
      { path: 'about', component: AboutPageComponent }
    ]
  },

  // Ruta comodín (redirección por defecto si no hay coincidencias)
  { path: '**', redirectTo: '/dashboard' }
];
