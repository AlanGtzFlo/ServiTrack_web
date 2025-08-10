import { Routes } from '@angular/router';

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
import { MessageReportFormComponent } from './reports/message-report-form/message-report-form.component'; // Importación necesaria

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

export const routes: Routes = [
  // Ruta raíz
  { path: '', redirectTo: '/public/home', pathMatch: 'full' },

  // Login
  { path: 'login', component: LoginComponent },

  // Panel administrativo
  { path: 'inicio', component: InicioComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Clientes
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/new', component: NewClientComponent },
  { path: 'clients/edit/:id', component: NewClientComponent },
  { path: 'clients/:id', component: ClientDetailComponent },

  // Políticas
  { path: 'policies', component: PoliciesComponent },
  { path: 'policies/new', component: NewPolicyComponent },
  { path: 'policies/:id', component: PolicyDetailComponent },

  // Servicios
  { path: 'services', component: ServicesComponent },
  { path: 'services/new', component: NewServiceComponent },
  { path: 'services/:id', component: ServiceDetailComponent },

  // Usuarios
  { path: 'users', component: UsersComponent },
  { path: 'users/new', component: NewUserComponent },
  { path: 'users/:id', component: UserDetailComponent },

  // Refacciones
  { path: 'refacciones', component: RefaccionesListComponent },
  { path: 'refacciones/nueva', component: NuevaRefaccionComponent },
  { path: 'refacciones/:id', component: RefaccionDetailComponent },

  // Satisfacción
  { path: 'satisfaction', component: SatisfactionComponent },

  // 🔧 RUTAS DE REPORTES (anidadas)
  {
    path: 'reports',
    component: ReportsComponent, // Este componente tiene un <router-outlet> para sus rutas hijas
    children: [
      { path: 'new', component: NewReportComponent },
      { path: 'message-report-form', component: MessageReportFormComponent }, // ¡Aquí debe ir! Como ruta hija.
      // Puedes añadir una ruta por defecto para cuando se navegue solo a /reports
      { path: '', redirectTo: 'overview', pathMatch: 'full' } // Asumiendo que 'overview' sería la vista principal de reportes
      // NOTA: Para que 'overview' funcione como un componente real, necesitarías un componente OverviewReportComponent
      // o manejar la lógica de 'overview' directamente en ReportsComponent si no es una ruta separada.
      // Si 'overview' es solo un estado del selector, esta ruta no sería para un componente.
    ]
  },

  // Configuración
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'general', pathMatch: 'full' },
      { path: 'general', component: GeneralSettingsComponent },
      { path: 'user-roles', component: UserRolesPermissionsComponent },
      { path: 'service-master-data', component: ServiceMasterDataComponent },
      { path: 'notifications', component: NotificationsSettingsComponent },
      { path: '**', redirectTo: 'general' }
    ]
  },

  // Portal público
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

  // Ruta comodín (para cualquier ruta no definida)
  { path: '**', redirectTo: '/dashboard' }
];