import { Component, OnInit } from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {Subject} from 'rxjs/Subject';
import {ProductoInterface} from '../../models/producto';
import {Observable} from '../../../../node_modules/rxjs';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  title:string = 'VUY';

  productos: ProductoInterface[];
  products;
  allproducts;
  searchText:string='';

  startAt = new Subject();
  endAt = new Subject();

  lastKeypress: number = 0;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private productoService: ProductoService,
              private afs: AngularFirestore) {}

  ngOnInit() {
    this.allProducts();
    this.getallProds().subscribe((prods) => {
      this.allproducts = prods;
    });
    Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((products) => {
        this.products = products;
      })
    })
  }


  allProducts() {
    this.productoService.getAllProducts().subscribe(productos => {
      this.productos = productos;
    })
  }


  firequery(start, end) {
    return this.afs.collection('productos', ref => ref.limit(3).orderBy('nombre').startAt(start).endAt(end)).valueChanges();
  }

  getallProds() {
    return this.afs.collection('productos', ref => ref.orderBy('nombre')).valueChanges();
  }

}
