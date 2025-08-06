import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for common directives like *ngFor, *ngIf
import { RouterOutlet } from '@angular/router'; // Only if you plan to use <router-outlet> within InicioComponent
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple'; // Corrected import for Ripple
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer'; // Corrected import for Drawer type

// Import SideBarComponent
import { SideBarComponent } from '../side-bar/side-bar.component'; // Correct import path for SideBarComponent

@Component({
  selector: 'app-inicio',
  standalone: true, // Mark component as standalone
  imports: [
    CommonModule, // Add CommonModule here
    RouterOutlet, // Only if needed in this component's template
    DrawerModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    SideBarComponent // Add SideBarComponent to imports
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss' // Use styleUrl for standalone components
})
export class InicioComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  visible: boolean = false;
}