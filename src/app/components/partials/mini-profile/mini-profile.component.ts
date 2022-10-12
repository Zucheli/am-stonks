import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { AcademicFormationGetResponseDto } from 'src/app/core/types/academic-formation-dto';
import { JobExperienceGetResponseDto } from 'src/app/core/types/job-experience-get-response';
import { UserUpdateDto } from 'src/app/core/types/user-update-dto';
import { SkillGetResponseDto } from 'src/app/core/types/skill-get-response-dto';
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
  openToWorkModal: boolean = false;
  roleType: string = '';

  academicFormation: any[] = [];
  certificates: any[] = [];
  jobExperiences: any[] = [];
  skills: any[] = [];
  tests = [];

  titleJob: string = '';
  companyNameJob: string = '';
  descriptionJob: string = '';
  startJob: string = '';
  endJob: string = '';

  titleStudy: string = '';
  formationStudy: string = '0';
  descriptionStudy: string = '';
  startStudy: string = '';
  endStudy: string = '';

  titleSkill: string = '';

  selectedFiles: any = null;
  numberVacancies: number = 0;
  buttonEditSkill: boolean = false;

  constructor(
    private authService: AuthService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit(): void {
    this.userLogged();
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.id = response.id;
        this.cpf = response.cpf;
        this.image = response.photo;
        this.email = response.email;
        this.lastName = response.lastName;
        this.firstName = response.firstName;
        this.roleType = response.role.authority;
        this.getVacancies(this.roleType);

        if (this.roleType == 'ROLE_WORKER') {
          this.authService.userInfos(this.id).subscribe({
            next: (response) => {
              console.log(response);
              this.academicFormation = response.academicFormation;
              this.certificates = response.certificates;
              this.jobExperiences = response.jobExperiences;
              this.skills = response.skills;
              this.tests = response.tests;
              this.openToWorkModal = response.openToWork;
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
    let openToWork = form.value.openToWorkModal;
    let image;
    let request: UserUpdateDto;

    if (this.selectedFiles == null) {
      image = this.image;
    } else {
      image = this.selectedFiles.item(0);
    }

    let id = this.id;

    if (this.roleType == 'ROLE_RECRUITER') {
      request = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        cpf: cpf,
      };
    } else {
      request = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        cpf: cpf,
        openToWork: openToWork,
        jobExperiences: this.jobExperiences,
        academicFormation: this.academicFormation,
        skills: this.skills,
      };
    }

    this.authService.userUpdate(id, request, image).subscribe({
      next: (response) => {
        Swal.fire({
          text: 'Alterações realizadas!',
          icon: 'success',
        });
        this.closeModal();
      },
      error: (error) => {
        Swal.fire({
          text: 'Erro ao realizar alterações!',
          icon: 'error',
        });
      },
    });
  }

  addJob(job: any) {
    let title = job.value.titleJob;
    let companyName = job.value.companyNameJob;
    let description = job.value.descriptionJob;
    let startDate = job.value.startJob;
    let endDate = job.value.endJob;
    let jobObject: JobExperienceGetResponseDto;

    if (title == '' || companyName == '' || startDate == '') {
      Swal.fire({
        text: 'Preencha os campos necessários!',
        icon: 'warning',
      });
    } else {
      jobObject = {
        jobTitle: title,
        companyName: companyName,
        description: description,
        startDate: startDate,
        endDate: endDate,
      };

      this.jobExperiences.push(jobObject);

      this.titleJob = '';
      this.companyNameJob = '';
      this.descriptionJob = '';
      this.startJob = '';
      this.endJob = '';
    }
  }

  deleteJob(job: any) {
    for (let i = 0; i < this.jobExperiences.length; i++) {
      if (
        this.jobExperiences[i].jobTitle === job.jobTitle &&
        this.jobExperiences[i].companyName === job.companyName &&
        this.jobExperiences[i].startDate === job.startDate
      ) {
        this.jobExperiences.splice(i, 1);
      }
    }
  }

  addStudy(study: any) {
    let title = study.value.titleStudy;
    let formation = study.value.formationStudy;
    let description = study.value.descriptionStudy;
    let startDate = study.value.startStudy;
    let endDate = study.value.endStudy;
    let studyObject: AcademicFormationGetResponseDto;

    switch (formation) {
      case '0':
        formation = 'BACHELOR_DEGREE';
        break;
      case '1':
        formation = 'TECHNICAL_DEGREE';
        break;
      case '2':
        formation = 'SCHOOL';
        break;
      case '3':
        formation = 'HIGH_SCHOOL';
        break;
      default:
        break;
    }

    if (title == '' || startDate == '') {
      Swal.fire({
        text: 'Preencha os campos necessários!',
        icon: 'warning',
      });
    } else {
      studyObject = {
        institutionName: title,
        academicFormationType: formation,
        description: description,
        startDate: startDate,
        endDate: endDate,
      };

      this.academicFormation.push(studyObject);

      this.titleStudy = '';
      this.formationStudy = '0';
      this.descriptionStudy = '';
      this.startStudy = '';
      this.endStudy = '';
    }
  }

  deleteStudy(study: any) {
    for (let i = 0; i < this.academicFormation.length; i++) {
      if (
        this.academicFormation[i].institutionName === study.institutionName &&
        this.academicFormation[i].academicFormationType ===
          study.academicFormationType &&
        this.academicFormation[i].startDate === study.startDate
      ) {
        this.academicFormation.splice(i, 1);
      }
    }
  }

  addSkill(skill: any) {
    let title = skill.value.titleSkill;
    let skillObject: SkillGetResponseDto;

    if (title == '') {
      Swal.fire({
        text: 'Preencha o campo necessário!',
        icon: 'warning',
      });
    } else {
      skillObject = {
        skillName: title,
      };

      this.skills.push(skillObject);

      this.titleSkill = '';
    }
  }

  deleteSkill(skill: any) {
    for (let i = 0; i < this.skills.length; i++) {
      if (this.skills[i].skillName === skill.skillName) {
        this.skills.splice(i, 1);
      }
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
    this.userLogged();
  }
}
