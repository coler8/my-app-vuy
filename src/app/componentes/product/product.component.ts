import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  currentProductId;
  productData;
  dataSubscription;
  currentUid;
  isAuthor = false;
  isBidding = false;
  showMessage = false;
  isError = false;
  message;
  adminUsers;
  pujante;
  isAdmin = false;
  isLogin: boolean;

  constructor(
    private fService: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location
  ) {
    this.currentProductId = this.route.snapshot.params.id;
    this.adminUsers  = this.auth.getAdmins();

    this.auth.getAuth().subscribe(data => {
      if (data) {
        if (this.adminUsers.indexOf(data['uid']) > -1) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        this.currentUid = data['uid'];
      }
    });
  }

  ngOnInit() {
    this.onComprobarUserLogin();
    this.dataSubscription = this.fService.getDocuments(this.currentProductId).subscribe(data => {
      if (data && data.length) {
        this.productData = data[0];
        this.isAuthor = this.currentUid === this.productData['author_uid'];
      }
    });
  }

  onComprobarUserLogin(){
    this.auth.getAuth().subscribe(user =>{
      if(user){
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
    });
  }

  navigateBack() {
    this.location.back();
  }

  editOffer() {
    this.router.navigate(['/edit_product', this.currentProductId]);
  }
  deleteOffer() {
    if(confirm('¿Estás seguro de eliminar el producto?')){
      this.fService.deleteDocument(this.currentProductId);
      this.router.navigate(['/producto_pujas']);
    }
  }
  updateDocument(key, value) {
    this.fService.updateDocument(this.currentProductId, key, value);
  }
  bidNow(value?) {
    this.showMessage = false;
    const currentDate = new Date();
    const bidEndDate = new Date(<any>this.productData['endtime']);
    console.log(bidEndDate + '   ' + currentDate);
    if (bidEndDate <= currentDate) {
      console.log('Ha finalizado el plazo');
      return;
    }

    if (this.isBidding) {
      this.isBidding = false;
      console.log(this.productData['curr_val']);
      if (this.productData['curr_val'] && value - this.productData['curr_val'] >= this.productData['increment']) {
        this.updateDocument('curr_val', [value, this.productData['bid_count']]);
        this.pujante = this.auth.authState.displayName;
      } else if (!this.productData['curr_val'] && value > this.productData['base_price']) {
        this.pujante = this.auth.authState.displayName;
        this.updateDocument('curr_val', [value, this.productData['bid_count']]);
      } else {
        this.showError({'message': 'Por favor, verifique el valor que ha ingresado. O el valor es menor que el precio base,o el valor incrementado no es correcto.'});
      }
    } else {
      this.isBidding = true;
    }
  }

  showError(err) {
    if (err) {
      this.message = err.message;
      this.showMessage = true;
    }
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
