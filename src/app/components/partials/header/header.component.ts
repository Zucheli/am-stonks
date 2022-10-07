import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
})
export class HeaderComponent implements OnInit {
  roleType: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLogged();
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.roleType = response.role.authority;
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível obter o usuário!',
          icon: 'error',
        });
      },
    });
  }
}
