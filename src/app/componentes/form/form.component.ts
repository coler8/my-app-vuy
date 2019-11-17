import { Location } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';
import moment = require('moment');
import {ProductoInterface} from '../../models/producto';
import {ProductoPujaInterface} from '../../models/producto_puja';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  message;
  showMessage = false;
  editMode = false;
  currentProductId;
  dataSubscription;
  productData = {};
  user;
  today;
  producto:ProductoPujaInterface = {
    name:'',
    photo: '',
    category:'',
    base_val:'',
    increment:'',
    desc:'',
    endtime:''
  };


  constructor(
    private router: Router,
    private authService: AuthService,
    private fService: FirestoreService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private location: Location) {
  }

  ngOnInit() {
    console.log(this.producto);
    this.today=moment().add(1, 'days').format('YYYY-MM-DD');
    this.authService.getAuth().subscribe(data => {
      if (data) {
        this.user = data;
      }
    });
    //si es la url edit_product
    if (this.router.url.indexOf('edit_product') > -1) {
      this.editMode = true;
      this.currentProductId = this.route.snapshot.params.id;
      this.auth.getAuth().subscribe(data => {
        if (data) {
          this.user = data;
        }
      });
      this.dataSubscription = this.fService.getDocuments(this.currentProductId).subscribe(data => {
        if (data && data.length) {
          this.productData = data[0];
          const inputs = document.querySelectorAll('input');
          const descField = document.querySelector('textarea');
          const category = document.querySelector('select');

          inputs[0].value = this.productData['name'];
          inputs[1].value = this.productData['photo'];
          inputs[2].value = this.productData['base_price'];
          inputs[3].value = this.productData['increment'];
          (document.querySelector('input[type="date"]') as HTMLInputElement).value = this.productData['endtime'];
          descField.value = this.productData['desc'];
          category.value = this.productData['category'].charAt(0).toUpperCase() + this.productData['category'].slice(1);

          this.producto = {
            name:inputs[0].value,
            photo: inputs[1].value,
            category: category.value,
            base_val:inputs[2].value,
            increment:inputs[3].value,
            desc:descField.value,
            endtime:(document.querySelector('input[type="date"]') as HTMLInputElement).value
          };

          console.log(this.producto);

        }
      });
    } else {
      this.editMode = false;
    }
  }

  addProduct(name, photo, category, base_val, increment, desc, endtime) {
    if (name && photo && category && base_val && increment && desc && endtime) {

      const endTime = new Date(endtime);
      if (endTime < new Date()) {
        this.showError({'message': 'La fecha de finalización de la subasta no debe ser anterior a la fecha actual'});
        return;
      }
      let postObj;
      if (this.editMode) {
        postObj = {
          'name': name,
          'photo': photo,
          'desc': desc,
          'base_price': Number(base_val),
          'increment': Number(increment),
          'category': category.toLowerCase(),
          'endtime': endtime
        };
      } else {
        postObj = {
          'name': name,
          'desc': desc,
          'base_price': Number(base_val),
          'increment': Number(increment),
          'photo': photo,
          'category': category.toLowerCase(),
          'curr_val': null,
          'author_uid': this.user.uid,
          'product_id': Math.random().toString(36).slice(2),
          'bid_count': 0,
          'author_email': this.user.email,
          'author_name': this.user.displayName,
          'endtime': endtime
        };
      }

      if (this.editMode) {
        this.fService.updateDocument(this.currentProductId, 'edit', postObj);
      } else {
        this.fService.addDocument(postObj).then(res => {
          this.router.navigate(['producto_pujas']);
        }).catch(err => {
          this.showError(err);
        });
      }
    } else {
      this.showError({'message': 'Comprueba los campos introducidos.'});
    }
  }
  formCancel() {
    if (this.editMode) {
      this.location.back();
    } else {
      this.router.navigate(['/producto_pujas']);
    }
  }
  showError(err) {
    if (err) {
      this.message = err.message;
      this.showMessage = true;
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
