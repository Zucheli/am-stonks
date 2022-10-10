import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit {
  roleType: string = '';
  arrayVacancies: any[] = [];
  arrayContract: any[] = [];
  arrayCountries: any[] = [];

  nameModalAdd: string = '';
  descriptionModalAdd: string = '';
  countryModalAdd: string = '';
  contractModalAdd: string = '';

  idModalEdit: number = 0;
  nameModalEdit: string = '';
  descriptionModalEdit: string = '';
  countryModalEdit: string = '';
  contractModalEdit: string = '';
  switchModalEdit: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLogged();
    this.getInfosForVacancies();
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.roleType = response.role.authority;
        this.getVacancies(this.roleType);
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
          this.arrayVacancies = response;
        },
        error: (error) => {
          Swal.fire({
            text: 'Não foi possível carregar as vagas que você criou!',
            icon: 'error',
          });
        },
      });
    } else {
      this.authService.vacanciesWorkers().subscribe({
        next: (response) => {
          this.arrayVacancies = response;
        },
        error: (error) => {
          Swal.fire({
            text: 'Não foi possível carregar as vagas abertas!',
            icon: 'error',
          });
        },
      });
    }
  }

  getInfosForVacancies() {
    this.authService.contractTypes().subscribe({
      next: (response) => {
        this.arrayContract = response;

        this.authService.countries().subscribe({
          next: (response) => {
            this.arrayCountries = response;
          },
          error: (error) => {
            Swal.fire({
              text: 'Não foi possível carregar os países!',
              icon: 'error',
            });
          },
        });
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível carregar os tipos de contrato!',
          icon: 'error',
        });
      },
    });
  }

  createVacancy(form: any) {
    let name = form.value.nameModalAdd;
    let description = form.value.descriptionModalAdd;
    let country = form.value.countryModalAdd;
    let contract = form.value.contractModalAdd;

    if (name == '' || description == '' || country == '' || contract == '') {
      Swal.fire({
        text: 'Preencha e selecione todos os campos!',
        icon: 'warning',
      });
    } else {
      let request = {
        name: name,
        description: description,
        country: country,
        contractType: contract,
      };

      this.authService.vacancyCreate(request).subscribe({
        next: (response) => {
          Swal.fire({
            text: 'Vaga criada com sucesso!',
            icon: 'success',
          });

          this.nameModalAdd = '';
          this.descriptionModalAdd = '';
          this.countryModalAdd = '';
          this.contractModalAdd = '';

          this.closeModalAdd();
        },
        error: (error) => {
          Swal.fire({
            text: 'Erro ao criar vaga!',
            icon: 'error',
          });
        },
      });
    }
  }

  saveVacancy(form: any) {
    let id = this.idModalEdit;
    let name = form.value.nameModalEdit;
    let description = form.value.descriptionModalEdit;
    let country = form.value.countryModalEdit;
    let contract = form.value.contractModalEdit;
    let concluded = form.value.switchModalEdit == '' ? false : true;

    let request = {
      name: name,
      description: description,
      country: country,
      contractType: contract,
      concluded: concluded,
    };

    this.authService.vacancyUptade(id, request).subscribe({
      next: (response) => {
        Swal.fire({
          text: 'Alteraçãoes realizadas!',
          icon: 'success',
        });
        this.closeModalEdit();
      },
      error: (error) => {
        Swal.fire({
          text: 'Erro ao realizar alteraçãoes!',
          icon: 'error',
        });
      },
    });
  }

  applyVacancy(vacancy: any) {
    let id = vacancy.id;

    this.authService.vacancyApply(id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  showModalAdd() {
    let modal = document.getElementById('modalAdd');
    if (modal != undefined) {
      modal.style.display = 'flex';
    }
  }

  closeModalAdd() {
    let modal = document.getElementById('modalAdd');
    if (modal != undefined) {
      modal.style.display = 'none';
    }
    this.userLogged();
  }

  showModalEdit(vacancy: any) {
    this.idModalEdit = vacancy.id;
    this.nameModalEdit = vacancy.name;
    this.descriptionModalEdit = vacancy.description;
    this.countryModalEdit = vacancy.country.toUpperCase();
    this.contractModalEdit = vacancy.contractType
      .toUpperCase()
      .replace('-', '');
    this.switchModalEdit = vacancy.concluded;

    if (this.contractModalEdit == 'PARTTIME') {
      this.contractModalEdit = this.contractModalEdit.replace('T', '');
    }

    let modal = document.getElementById('modalEdit');
    if (modal != undefined) {
      modal.style.display = 'flex';
    }
  }

  closeModalEdit() {
    let modal = document.getElementById('modalEdit');
    if (modal != undefined) {
      modal.style.display = 'none';
    }
    this.userLogged();
  }
}
