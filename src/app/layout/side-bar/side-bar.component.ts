import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  isCollapsed = false;
  sidebarOpenOnMobile = false;

  toggleSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarOpenOnMobile = !this.sidebarOpenOnMobile;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }
}
