import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// Auth
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.less'],
})
export class TestsComponent implements OnInit {
  roleType: string = '';
  arrayTests: any[] = [];

  testId: number = 0;
  testQuestions: any[] = [];
  testSkillId: number = 0;
  testSkillName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userLogged();
  }

  userLogged() {
    this.authService.userLogged().subscribe({
      next: (response) => {
        this.roleType = response.role.authority;
        this.getTests();
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível obter o usuário!',
          icon: 'error',
        });
      },
    });
  }

  getTests() {
    this.authService.tests().subscribe({
      next: (response) => {
        this.arrayTests = response;
      },
      error: (error) => {
        Swal.fire({
          text: 'Não foi possível carregar os testes!',
          icon: 'error',
        });
      },
    });
  }

  saveTest(testComplete: any) {
    let question1 = testComplete.value.questao1;
    let question2 = testComplete.value.questao2;
    let question3 = testComplete.value.questao3;
    let question4 = testComplete.value.questao4;
    let question5 = testComplete.value.questao5;

    if (
      question1 == '' ||
      question2 == '' ||
      question3 == '' ||
      question4 == '' ||
      question5 == ''
    ) {
      Swal.fire({
        text: 'Responda todas as perguntas!',
        icon: 'warning',
      });
    } else {
      let questions = [
        {
          id: 1,
          markedAnswerId: question1,
        },
        {
          id: 2,
          markedAnswerId: question2,
        },
        {
          id: 3,
          markedAnswerId: question3,
        },
        {
          id: 4,
          markedAnswerId: question4,
        },
        {
          id: 5,
          markedAnswerId: question5,
        },
      ];

      let skill = {
        id: this.testSkillId,
        skillName: this.testSkillName,
      };

      let request = {
        id: this.testId,
        questions: questions,
        skill: skill,
        title: null,
      };

      this.authService.testApply(this.testId, request).subscribe({
        next: (response) => {
          Swal.fire({
            text: 'Parabéns, você consegui o certificado!',
            icon: 'success',
          });
          this.closeTest();
        },
        error: (error) => {
          Swal.fire({
            text: 'Você não conseguiu o número mínimo de acertos!',
            icon: 'warning',
          });
          this.closeTest();
        },
      });
    }
  }

  openTest(test: any) {
    this.testId = test.testId;
    this.testSkillId = test.skill.id;
    this.testSkillName = test.skill.skillName;
    this.testQuestions = test.questions;

    let modal = document.getElementById('modalTest');
    if (modal != undefined) {
      modal.style.display = 'flex';
    }
  }

  closeTest() {
    let modal = document.getElementById('modalTest');
    if (modal != undefined) {
      modal.style.display = 'none';
    }
    this.userLogged();
  }
}
