import { Injectable } from '@angular/core';

import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {ProductoInterface} from '../models/producto';
import {FlashMessagesService} from 'angular2-flash-messages';

@Injectable()
export class ProductoService {
  productoCollection: AngularFirestoreCollection<ProductoInterface>; //cargara todas las tablas en esta coleccion
  productoDoc: AngularFirestoreDocument<ProductoInterface>;
  productos: Observable<ProductoInterface[]>; //recuperar todos los productos
  producto:Observable<ProductoInterface>;  //recuperar un producto por id, para editar

  constructor(
    private afs:AngularFirestore,
    public flashMensaje: FlashMessagesService
  ) {
    this.productoCollection=this.afs.collection('productos',ref => ref);
  }


  addNewProduct(producto:ProductoInterface){
    this.productoCollection.add(producto);
    this.flashMensaje.show('Producto añadido correctamente.',
      {cssClass: 'alert-success', timeout: 4000});
  }

  getProduct(idProducto:string){
    this.productoDoc=this.afs.doc<ProductoInterface>(`productos/${idProducto}`);
    this.producto = this.productoDoc.snapshotChanges().map(action=>{
      if (action.payload.exists===false){//comprobar si existe producto con ese id
        return null;
      }else {
        const data=action.payload.data() as ProductoInterface;
        data.id=action.payload.id;
        return data;
      }
    });
    return this.producto;
  }


  getAllProducts():Observable<ProductoInterface[]>{
    this.productos=this.productoCollection.snapshotChanges()
      .map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as ProductoInterface;
          data.id = action.payload.doc.id;
          return data;
        });
      });
     return this.productos;
  }


  updateProduct(producto:ProductoInterface){
    this.productoDoc=this.afs.doc(`productos/${producto.id}`);
    this.productoDoc.update(producto);
    this.flashMensaje.show('Producto actualizado correctamente.',
      {cssClass: 'alert-success', timeout: 4000});
  }

  deleteProduct(producto:ProductoInterface){
    this.productoDoc=this.afs.doc(`productos/${producto.id}`);
    this.productoDoc.delete();
    this.flashMensaje.show('Producto eliminado correctamente.',
      {cssClass: 'alert-success', timeout: 4000});
  }
}
