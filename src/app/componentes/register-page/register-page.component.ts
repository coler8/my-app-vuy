import { Component, OnInit } from '@angular/core';

import {Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {AuthService} from '../../services/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  public email: string;
  public password: string;
  public username:string;
  public fotoPerfil:string;

  message;
  showMessage = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMensaje: FlashMessagesService,
    public af: AngularFireAuth,
  ) { }

  ngOnInit() {

  }

  onSubmit(formData) {
    if(formData.valid) {
      this.af.auth.createUserWithEmailAndPassword(
        formData.value.email,
        formData.value.password
      ).then(
        (success) => {
          success.updateProfile({
            displayName:formData.value.username,
            photoURL:formData.value.fotoPerfil
          }).catch(
            (err) => {
              this.flashMensaje.show(err.message,
                {cssClass: 'alert-danger', timeout: 4000});
            });
          this.router.navigate(['/perfil'])
        }).catch(
        (err) => {
          this.flashMensaje.show(err.message,
            {cssClass: 'alert-danger', timeout: 4000});
        })
    }else {
      this.showError({'message': 'Todos los campos son obligatorios .Inténtalo de nuevo.'});
    }
  }

  onSubmitAddUser() {
    this.authService.registerUser(this.email, this.password)
    .then((res) => {
      this.flashMensaje.show('Usuario creado correctamente.',
      {cssClass: 'alert-success', timeout: 4000});
     this.router.navigate(['/privado']);
    }).catch( (err) => {
      this.flashMensaje.show(err.message,
      {cssClass: 'alert-danger', timeout: 4000});
    });
  }

  showError(err) {
    if (err) {
      this.message = err.message;
      this.showMessage = true;
    }
  }



}
