import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {MensajeInterface} from '../models/chat';
import {AngularFireAuth} from 'angularfire2/auth';


@Injectable()
export class ChatService{

  private itemsCollection: AngularFirestoreCollection<MensajeInterface>;

  public chats:MensajeInterface[]=[];
  public usuario:any={};

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
      this.afAuth.authState.subscribe((user) => {
        if(!user){
          return;
        }
        this.usuario.nombre=user.displayName;
        this.usuario.uid=user.uid;
      })
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<MensajeInterface>('chats', ref =>
      ref.orderBy('fecha', 'desc').limit(5));

    return this.itemsCollection.valueChanges().map((mensajes:MensajeInterface[])=>{
      console.log(mensajes);

      this.chats=[];
      for (let mensaje of mensajes){
        this.chats.unshift(mensaje);
      }
      return this.chats;
    });
  }

  addMensajes(texto:string){
    let mensaje:MensajeInterface={
      nombre: this.usuario.nombre,
      mensaje:texto,
      fecha:new Date().getTime(),
      uid: this.usuario.uid
    }
    return this.itemsCollection.add(mensaje);
  }

}
