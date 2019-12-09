import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from 'firebase';


@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit {
  isLogin: boolean;
  nombreUsuario: string;
  emailUsuario: string;
  fotoUsuario: string;
  numTlf: string;
  isAdmin = false;
  adminUsers;
  idUsuarioLogueado: string;

  constructor(
    public authService: AuthService
  ) {}

  currentUser: User;

  ngOnInit() {
    this.onComprobarLoginUser();
  }

  onComprobarLoginUser(){
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.nombreUsuario = auth.displayName;
        this.emailUsuario = auth.email;
        this.fotoUsuario = auth.photoURL;
        this.numTlf= auth.phoneNumber;
        this.idUsuarioLogueado=auth.uid;

        this.adminUsers  = this.authService.getAdmins();
        this.isAdmin = this.adminUsers == this.idUsuarioLogueado;
      } else {
        this.isLogin = false;
      }
    });
  }

  onClickLogout(){
      this.authService.logout();
    }
}

