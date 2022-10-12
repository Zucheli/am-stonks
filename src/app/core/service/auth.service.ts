import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserUpdateDto } from '../types/user-update-dto';

// Envs
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = `${environment.baseUrlApi}`;

  public token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  contractTypes(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/contract-types`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  countries(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/countries`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  login(login: any): Observable<any> {
    const body = new HttpParams()
      .set('username', login.username)
      .set('password', login.password)
      .set('grant_type', 'password');

    return this.http.post(`${this.baseURL}/oauth/token`, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Basic ' + btoa('stonks:stonks123456')),
    });
  }

  userCreate(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/users/signup`, request);
  }

  userLogged(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/users/authenticated`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  userOpenToWork(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/users`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  userUpdate(id: any, request: UserUpdateDto, image: File): Observable<any> {
    const blob = new Blob([JSON.stringify(request)], {
      type: 'application/json',
    });
    const formData: FormData = new FormData();
    formData.append('image', image);
    formData.append('user', blob);

    return this.http.put<any>(`${this.baseURL}/users/${id}`, formData, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  userInfos(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/users/${id}`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  vacanciesRecruiter(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/vacancies/creator`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  vacanciesWorkers(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/vacancies`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  vacancyCreate(request: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/vacancies/create`, request, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  vacancyUptade(id: any, request: any): Observable<any> {
    return this.http.put<any>(
      `${this.baseURL}/vacancies/${id}/update`,
      request,
      {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
      }
    );
  }

  vacancyApply(id: any, resume: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('resume', resume);

    return this.http.post<any>(
      `${this.baseURL}/vacancies/${id}/apply`,
      formData,
      {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
      }
    );
  }

  tests(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/tests`, {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
    });
  }

  testApply(id: number, request: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/tests/${id}/revision`,
      request,
      {
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.token),
      }
    );
  }
}
