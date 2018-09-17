import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {User} from 'firebase';


@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public isLogin: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;
  public fotoUsuario: string;
  public numTlf: string;

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
        if (this.adminUsers == this.idUsuarioLogueado) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } else {
        this.isLogin = false;
      }
    });
  }

  onClickLogout(){
      this.authService.logout();
    }
}

