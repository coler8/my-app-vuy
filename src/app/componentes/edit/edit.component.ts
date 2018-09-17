import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProductoInterface} from '../../models/producto';
import {ProductoService} from '../../services/producto.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  idProducto: string;
  producto:ProductoInterface = {
    id:'',
    nombre: '',
    fotoProducto:'',
    descripcion:'',
    categoria:'',
    ciudad:'',
    fechaPublicacion:'',
    precio:'',
    userId:'',
    userNombre:'',
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) { }

  ngOnInit() {
    this.getDetallesProducto();
  }

  getDetallesProducto(){
    //parametro id de la url
    this.idProducto = this.route.snapshot.params['id'];
    this.productoService.getProduct(this.idProducto).subscribe( producto => this.producto = producto);
  }

  onModificarProducto({value}:{value: ProductoInterface}){
    value.id = this.idProducto;
    this.productoService.updateProduct(value);
    this.router.navigate(['/details/'+this.idProducto]);
  }

}
