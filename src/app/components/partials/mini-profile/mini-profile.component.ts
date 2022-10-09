import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.less'],
})
export class MiniProfileComponent implements OnInit {
  id: number = 0;
  image: any = null;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  cpf: string = '';
  openToWork: string = '';
  roleType: string = '';
  academicFormation = [];
  certificates = [];
  jobExperiences = [];
  skills = [];
  tests = [];

  jobs = {};

  modalType: string = '';

  numberVacancies: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLogged();
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.id = response.id;
        this.cpf = response.cpf;
        this.email = response.email;
        this.lastName = response.lastName;
        this.firstName = response.firstName;
        this.roleType = response.role.authority;
        this.getVacancies(this.roleType);

        if (this.roleType == 'ROLE_WORKER') {
          this.authService.userInfos(this.id).subscribe({
            next: (response) => {
              this.academicFormation = response.academicFormation;
              this.certificates = response.certificates;
              this.jobExperiences = response.jobExperiences;
              this.skills = response.skills;
              this.tests = response.tests;
              this.openToWork = response.openToWork == false ? 'Não' : 'Sim';
            },
            error: (error) => {
              Swal.fire({
                text: 'Não foi possível carregar as informações do usuário!',
                icon: 'error',
              });
            },
          });
        }
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível obter o usuário!',
          icon: 'error',
        });
      },
    });
  }

  getVacancies(role: string) {
    if (role == 'ROLE_RECRUITER') {
      this.authService.vacanciesRecruiter().subscribe({
        next: (response) => {
          this.numberVacancies = response.length;
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

  saveUser(form: any) {
    let firstName = form.value.firstNameModal;
    let lastName = form.value.lastNameModal;
    let email = form.value.emailModal;
    let cpf = form.value.cpfModal;

    let id = this.id;
    let image = this.image;

    let request = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      cpf: cpf,
    };

    this.authService.userUpdate(id, request, image).subscribe({
      next: (responde) => {
        console.log(responde);
      },
      error: (error) => {
        console.log(error);
      },
    });
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
    this.userLogged();
  }
}
