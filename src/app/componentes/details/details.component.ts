import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params } from '@angular/router';

import {ProductoInterface} from '../../models/producto';
import {ProductoService} from '../../services/producto.service';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore} from 'angularfire2/firestore';
import {ChatService} from '../../services/chat.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public isLogin: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;
  public fotoUsuario: string;

  isAdmin = false;
  adminUsers;

  idProducto: string;
  idUsuarioLogueado: string;

  public chats: Observable<any[]>;

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
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    public chatService: ChatService
  ) {
    this.chats = db.collection('chats').valueChanges();

  }

  ngOnInit() {
    this.onComprobarUserLogin();
    this.getDetallesProducto();
  }

  onComprobarUserLogin(){
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLogin = true;
        this.nombreUsuario = auth.displayName;
        this.emailUsuario = auth.email;
        this.fotoUsuario = auth.photoURL;
        this.idUsuarioLogueado = auth.uid;
        this.adminUsers  = this.authService.getAdmins();

        if (this.adminUsers == this.idUsuarioLogueado) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });
  }


  getDetallesProducto(){
    this.idProducto = this.route.snapshot.params['id'];
    this.productoService.getProduct(this.idProducto).subscribe(producto => this.producto = producto);
  }

  onClickDelete(){
    if(confirm('¿Estás seguro de eliminar el producto?')){
      this.productoService.deleteProduct(this.producto);
      this.router.navigate(['/perfil']);
    }
  }
}
