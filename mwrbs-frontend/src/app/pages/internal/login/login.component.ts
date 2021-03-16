import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IHttpResponse } from 'src/app/_interfaces/http-response';
import { User } from 'src/app/_interfaces/user';
import { AuthService } from 'src/app/_services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  user = {} as User;
  isProcessing = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('is_reloaded')) {
      localStorage.setItem('is_reloaded', 'no reload');
      location.reload();
    } else {
      localStorage.removeItem('is_reloaded');
    }
  }

  login() {
    this.isProcessing = true;
    let httpResponse: IHttpResponse;
    this.authService.login(this.user)
      .pipe(finalize(() => {
        if (httpResponse?.success) {
          const body = httpResponse.body;
          if (body?.username === 'admin') {
            body.userTypeId = 1;
          }
          sessionStorage.setItem('user', JSON.stringify(body));
          this.router.navigate(['/internal/dashboard']);
        } else {
          Swal.fire('Unable to Sign in', httpResponse?.message, 'error');
        }
        this.isProcessing = false;
      }))
      .subscribe((response: IHttpResponse) => httpResponse = response,
        error => {
          this.isProcessing = false;
          console.log(error);
        });
  }

  ngOnDestroy() { }
}
