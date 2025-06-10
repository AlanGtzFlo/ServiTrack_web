import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { Menubar } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { SideBarComponent } from "../side-bar/side-bar.component";
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [Menubar,
     BadgeModule,
      AvatarModule,
       InputTextModule,
        Ripple,
         CommonModule,
          SideBarComponent,
           DrawerModule,
            ButtonModule,
             Ripple,
              AvatarModule,
               StyleClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e: any): void {
        this.drawerRef.close(e);
    }

    visible: boolean = false;
   items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
            },
            {
                label: 'Projects',
                icon: 'pi pi-search',
                badge: '3',
                items: [
                    {
                        label: 'Core',
                        icon: 'pi pi-bolt',
                        shortcut: '⌘+S',
                    },
                    {
                        label: 'Blocks',
                        icon: 'pi pi-server',
                        shortcut: '⌘+B',
                    },
                    {
                        separator: true,
                    },
                    {
                        label: 'UI Kit',
                        icon: 'pi pi-pencil',
                        shortcut: '⌘+U',
                    },
                ],
            },
        ];
    }
}
