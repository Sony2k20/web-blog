import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { SideNavService } from 'src/app/side-nav.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private sideNavService: SideNavService, public authServ: AuthService) {}

  ngOnInit(): void {}

  goToSlider() {
    this.router.navigate(['/blog']);
    setTimeout(
      () =>
        document.getElementById('site-content')!.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        }),
      50
    );
  }

  clickMenu() { 
    this.sideNavService.toggle();
  }

}
