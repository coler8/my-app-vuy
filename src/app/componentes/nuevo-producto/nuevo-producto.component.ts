import { Component, OnInit } from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {AuthService} from '../../services/auth.service';
import { Router} from '@angular/router';
import {ProductoInterface} from '../../models/producto';


@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {
  message;
  showMessage = false;
  producto:ProductoInterface = {
    id:'',
    nombre: '',
    fotoProducto:'',
    descripcion:'',
    categoria:'',
    ciudad:'',
    fechaPublicacion:'',
    precio:'',
    numTlf:'',
    userId:'',
    userNombre:'',
  };

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  onGuardarProducto({value}:{value: ProductoInterface}){
    console.log(value.nombre + value.ciudad + value.descripcion + value.categoria + value.ciudad + value.numTlf + value.precio);
    if(value.nombre && value.ciudad && value.descripcion && value.categoria && value.ciudad && value.numTlf && value.precio){
      value.fechaPublicacion=(new Date()).getTime();
      this.authService.getAuth().subscribe(user=>{
        value.userId=user.uid;
        value.userNombre=user.displayName;
        this.productoService.addNewProduct(value);
        console.log(value);
      });
      this.router.navigate(['/']);
    }else{
        this.showError({'message': 'Todos los campos son obligatorios .Inténtalo de nuevo.'});
    }
  }

  showError(err) {
    if (err) {
      this.message = err.message;
      this.showMessage = true;
    }
  }

}
