import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiUrl + 'user/';
  currentUser: User;

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  login(user: User) {
    return this.http.post(this.baseUrl + 'login', user);
  }

  changePassword(user: User) {
    return this.http.post(this.baseUrl + 'change-password', user);
  }

  logout() {
    // insert code here
  }
}
