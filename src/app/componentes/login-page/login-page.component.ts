import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  email;
  password;
  loginForm: FormGroup;
  submitted = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMensaje: FlashMessagesService,
    private formBuilder: FormBuilder
  ) { }

  //get para acceder a los campos del formulario
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSubmitLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }else{
      this.authService.loginEmail(this.loginForm.value.email, this.loginForm.value.password).then( () => {
        this.flashMensaje.show('Usuario logueado correctamente.',
          {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/perfil']);
      }).catch((err) => {
        this.flashMensaje.show(err.message,
          {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/login']);
      });
    }


  }

  onClickGoogleLogin() {
    this.authService.loginGoogle()
      .then(() => {
        this.router.navigate(['/perfil']);
      }).catch( err => console.log(err.message));
  }

  onClickFacebookLogin() {
    this.authService.loginFacebook()
      .then(() => {
        this.router.navigate(['/perfil']);
      }).catch( err => console.log(err.message));
  }

  onClickTwitterLogin() {
    this.authService.loginTwitter()
      .then(() => {
        this.router.navigate(['/perfil']);
      }).catch (err => console.log(err.message));
  }

}
