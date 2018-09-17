export interface ProductoInterface {
  //?:no es un campo requerido
  id?:string;
  nombre?: string;
  fotoProducto?:string;
  descripcion?:string;
  categoria?:string;
  ciudad?:string;
  fechaPublicacion?:any;
  precio?:string;
  numTlf?:string;
  userId?:string;
  userNombre?:string;
}
