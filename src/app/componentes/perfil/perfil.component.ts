import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from 'firebase';
import {AuthService} from '../../services/auth.service';
import {ProductoInterface} from '../../models/producto';
import {ProductoService} from '../../services/producto.service';
import { } from '@types/googlemaps';
import {el} from '@angular/platform-browser/testing/src/browser_util';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  public isLogin: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;
  public fotoUsuario: string;

  idUsuarioLogueado: string;
  isAdmin = false;
  adminUsers;

  productos;
  hasProducts: boolean = false;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  isTracking = false;

  currentLat: any;
  currentLong: any;

  marker: google.maps.Marker;

  constructor(
    public authService: AuthService,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.onComprobarLoginUser();
    this.onComprobarUserLogin1();
    this.getAllMyProducts();
    this.productos=[];

    var mapProp = {
      center: new google.maps.LatLng(38.3792700, -0.4814900),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  onComprobarLoginUser(){
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.nombreUsuario = auth.displayName;
        this.emailUsuario = auth.email;
        this.fotoUsuario = auth.photoURL;

        this.idUsuarioLogueado=auth.uid;

        this.adminUsers  = this.authService.getAdmins();
        this.isAdmin = this.adminUsers == this.idUsuarioLogueado;
      } else {
        this.isLogin = false;
      }
    });
  }

  onComprobarUserLogin1(){
    this.authService.getAuth().subscribe(user =>{
      if(user) {
        this.idUsuarioLogueado = user.uid;
      }
    });
  }

  getAllMyProducts(){
      this.productoService.getAllProducts().subscribe(productos => {
        if(productos && productos.length) {
          for (let producto of productos) {
            if (this.idUsuarioLogueado == producto.userId && !this.isAdmin) {
              this.productos.push(producto);
              this.hasProducts = this.productos.some(prod => prod.userId == this.idUsuarioLogueado);
            }else if(this.isAdmin){
              this.productos=productos;
            }
          }
        }else {
          this.productos = [];
        }
      });
  }


  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.showPosition(position);
        console.log(position.coords.longitude,position.coords.latitude)
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Te encontré!'
      });
    }
    else {
      this.marker.setPosition(location);
    }
  }

  trackMe() {
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!'
      });
    }
    else {
      this.marker.setPosition(location);
    }
  }

}
