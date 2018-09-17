import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ProductoInterface} from '../../models/producto';
import {ProductoService} from '../../services/producto.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {ChatService} from '../../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  idProducto: string;
  idUsuarioLogueado: string;

  public isLogin: boolean;
  public nombreUsuario: string;
  public emailUsuario: string;
  public fotoUsuario: string;

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

  mensaje:string="";
  elemento:any;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    public authService: AuthService,
    public chatService: ChatService
  ) {
    this.chatService.cargarMensajes().subscribe(()=>{
      setTimeout(()=>{
        this.elemento.scrollTop=this.elemento.scrollHeight;
      },20);
    });

  }

  ngOnInit() {
    this.getDetallesProducto();
    this.onComprobarLoginUser();
    this.elemento= document.getElementById('app-mensajes');
  }

  enviarMensaje(){
    if(this.mensaje.length===0){
      return;
    }
    //then si se realiza correctamente
    this.chatService.addMensajes(this.mensaje)
      .then(()=> this.mensaje="")
      .catch((err)=> console.error('Error al enviar',err));

  }

  getDetallesProducto(){
    this.idProducto = this.route.snapshot.params['id'];
    this.productoService.getProduct(this.idProducto).subscribe(producto => this.producto = producto);
  }

  onComprobarLoginUser(){
    this.authService.getAuth().subscribe( auth => {
      if (auth) {
        this.isLogin = true;
        this.nombreUsuario = auth.displayName;
        this.emailUsuario = auth.email;
        this.fotoUsuario = auth.photoURL;
      } else {
        this.isLogin = false;
      }
    });
  }



}
