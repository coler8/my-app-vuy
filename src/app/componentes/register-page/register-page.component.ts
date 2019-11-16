import { Component, OnInit } from '@angular/core';

import {Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  email: string;
  password: string;
  username:string;
  fotoPerfil:string;
  registerForm: FormGroup;
  submitted = false;
  message;
  showMessage = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMensaje: FlashMessagesService,
    public af: AngularFireAuth,
    private formBuilder: FormBuilder
  ) { }

  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      fotoPerfil: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitUser() {
    this.submitted = true;
    if(this.registerForm.invalid) {
      return;
    }else{
      this.af.auth.createUserWithEmailAndPassword(
        this.registerForm.value.email,
        this.registerForm.value.password
      ).then(
        (success) => {
          success.updateProfile({
            displayName:this.registerForm.value.username,
            photoURL:this.registerForm.value.fotoPerfil
          }).catch(
            (err) => {
              this.flashMensaje.show(err.message,
                {cssClass: 'alert-danger', timeout: 4000});
            });
          this.router.navigate(['/perfil'])
        }).catch(
        (err) => {
          this.flashMensaje.show(err.message,
            {cssClass: 'alert-danger', timeout: 4000});//TODO quitarlo
        })
    }
  }


  showError(err) {
    if (err) {
      this.message = err.message;
      this.showMessage = true;
    }
  }



}
