import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.less'],
})
export class WorkersComponent implements OnInit {
  roleType: string = '';

  arrayWorkers: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLogged();
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.roleType = response.role.authority;
        this.getWorkers(this.roleType);
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível obter o usuário!',
          icon: 'error',
        });
      },
    });
  }

  getWorkers(role: string) {
    if (role == 'ROLE_RECRUITER') {
      this.authService.userOpenToWork().subscribe({
        next: (response) => {
          this.arrayWorkers = response;
        },
        error: (error) => {
          Swal.fire({
            text: 'Não foi possível carregar as vagas que você criou!',
            icon: 'error',
          });
        },
      });
    }
  }
}
