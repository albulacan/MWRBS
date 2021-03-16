import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + userId);
  }

  enrollUser(user: User) {
    const url = `${this.baseUrl}user/enroll`;
    return this.http.post(url, user);
  }

  updateUser(user: User) {
    const url = `${this.baseUrl}user/update`;
    return this.http.post(url, user);
  }

  delete(userMasterId: number) {
    const url = `${this.baseUrl}user/delete`;
    return this.http.post(url, { userMasterId });
  }

}
