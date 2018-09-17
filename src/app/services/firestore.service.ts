import { Router } from '@angular/router';
import { getCollection } from '@angular/cli/utilities/schematics';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';


@Injectable()
export class FirestoreService {
  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;
  updateSubscription;
  private base = 'producto_pujas';
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    public flashMensaje: FlashMessagesService
  ) {
    this.itemsCollection = this.afs.collection(this.base);
    this.items = this.itemsCollection.valueChanges();
  }

  addDocument(docData: Object) {
    return this.itemsCollection.add({
      ...docData,
      createdAt: this.timestamp
    });
  }
  get timestamp() {
    //si contiene nulo para un campo con la anotación @ ServerTimestamp, se reemplazará con una marca de tiempo generada por el servidor.
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  getDocuments(filter, isCategory?, isCategoryPage?, sortOption?) {
    if (isCategory) {
      if (filter) {
        if (isCategoryPage) {
          return this.afs.collection(this.base, ref =>
            ref.where('category', '==', filter).orderBy(sortOption, 'desc')).valueChanges();
        }
      } else if (!isCategoryPage) {
        return this.afs.collection(this.base, ref => ref.where('author_uid',
          '==', this.auth.authState.uid)
        .orderBy(sortOption, 'desc'))
        .valueChanges();
      }
      return this.afs.collection(this.base, ref =>ref.orderBy(sortOption, 'desc')).valueChanges();
    } else {
      return this.afs.collection(this.base, ref => ref.where('product_id', '==', filter)).valueChanges();
    }
  }
  updateDocument(product_id, key, val) {
    this.updateSubscription = this.afs.collection(this.base, ref => ref.where('product_id', '==', product_id)).stateChanges()
      .subscribe(data => {
        if (data) {
          this.updateSubscription.unsubscribe();
          const docId = data[0]['payload']['doc']['id'];
          if (key === 'edit') {
            this.afs.collection(this.base).doc(docId).update(val)
            .then(res => {
              this.flashMensaje.show('Producto actualizado correctamente.',
                {cssClass: 'alert-success', timeout: 4000});
              this.router.navigate(['/product', product_id]);
            }).catch(err => {
              console.log('Error : ', err.message);
            });
          } else if (key === 'curr_val') {
            this.afs.collection(this.base).doc(docId).update({ 'curr_val': val[0], 'bid_count': val[1]})
            .then(res => {
                return this.afs.collection(`${this.base}/${docId}/bid-collection`).add({
                  'bidder_uid': this.auth.authState.uid,
                  'bidder_email': this.auth.authState.email,
                  'bidder_name': this.auth.authState.displayName,
                  'bid_time': this.timestamp,
                  'bid_value': val[0]
                });
            }).then(res => {
              this.flashMensaje.show('Producto pujado correctamente.',
                {cssClass: 'alert-success', timeout: 4000});
            }).catch(err => {
              console.log('Error : ', err.message);
            });
          }
        }
      });
  }


  deleteDocument(product_id) {
    this.updateSubscription = this.afs.collection(this.base, ref => ref.where('product_id', '==', product_id)).stateChanges()
    .subscribe(data => {
      if (data) {
        this.updateSubscription.unsubscribe();
        const docId = data[0]['payload']['doc']['id'];
      this.afs.collection(this.base).doc(docId).delete()
      .then(res => {
          this.flashMensaje.show('Producto borrado correctamente.',
          {cssClass: 'alert-success', timeout: 4000});
          this.router.navigate(['/producto_pujas']);
        }).catch(err => {
          console.log('Error : ', err.message);
        });
      }
    });
  }
}
