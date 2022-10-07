import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  bigBanner: boolean = true;
  viewPassword: boolean = false;
  viewPasswordModal: boolean = false;
  enableOpenToWork: boolean = false;

  roleId: number = 0;

  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  login(form: any) {
    let user = form.value.userLogin;
    let password = form.value.passwordLogin;
    if (user == '' || password == '') {
      Swal.fire({
        text: 'Preencha todos os campos para fazer o login!',
        icon: 'warning',
      });
    } else {
      let login = {
        username: user,
        password: password,
      };

      this.authService.login(login).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);
          this.authService.userLogged().subscribe({
            next: (response) => {
              localStorage.setItem('role', response.role.authority);
              this.router.navigate(['/home']);
            },
          });
        },
        error: (error) => {
          Swal.fire({
            text: 'Usuário não cadastrado, por favor se cadastre!',
            icon: 'error',
          });
        },
      });
    }
  }

  createAccount(form: any) {
    let email = form.value.emailModal;
    let password = form.value.passwordModal;
    let firstName = form.value.firstNameModal;
    let lastName = form.value.lastNameModal;
    let cpf = form.value.cpfModal;
    let roleType = form.value.roleTypeModal;
    let openToWork = form.value.openToWorkModal;

    if (
      email == '' ||
      password == '' ||
      firstName == '' ||
      lastName == '' ||
      cpf == '' ||
      roleType == '' ||
      openToWork == ''
    ) {
      Swal.fire({
        text: 'Preencha todos os campos para criar uma conta',
        icon: 'warning',
      });
    } else {
      openToWork == 'true' ? true : false;
      roleType == 'ROLE_WORKER' ? (this.roleId = 1) : (this.roleId = 2);

      let request = {
        cpf: cpf,
        email: email,
        firstName: firstName,
        lastName: lastName,
        openToWork: openToWork,
        password: password,
        role: {
          authority: roleType,
          id: this.roleId,
        },
      };

      this.authService.userCreate(request).subscribe({
        next: (response) => {
          Swal.fire({
            text: 'Usuário cadastrado com sucesso!',
            icon: 'success',
          });
          this.closeModal();
        },
        error: (error) => {
          Swal.fire({
            text: 'Usuário já cadastrado!',
            icon: 'error',
          });
        },
      });
    }
  }

  showModal() {
    let modal = document.getElementById('modal');
    if (modal != undefined) {
      modal.style.display = 'flex';
    }
  }

  closeModal() {
    let modal = document.getElementById('modal');
    if (modal != undefined) {
      modal.style.display = 'none';
    }
  }
}
