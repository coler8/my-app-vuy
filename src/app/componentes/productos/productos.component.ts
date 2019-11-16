import { Component, OnInit } from '@angular/core';
import {ProductoService} from '../../services/producto.service';
import {ProductoInterface} from '../../models/producto';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireDatabase} from 'angularfire2/database';
import * as _ from 'lodash';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  productos: ProductoInterface[];

  filteredProducts: any;

  /// filter-able properties
  categoria:string;
  ciudad:string;
  precio:number;
  /// Active filter rules
  filters = {};

  constructor(private productoService: ProductoService)
  {}

  ngOnInit() {
    this.allProducts();
  }


  allProducts() {
    this.productoService.getAllProducts().subscribe(productos => {this.productos = productos;this.applyFilters()});
  }


  private applyFilters() {
    this.filteredProducts = _.filter(this.productos, _.conforms(this.filters))
  }

  filterExact(property: string, rule: any) {
    this.filters[property] = val => val == rule;
    this.applyFilters()
  }

  filterLessThan(property: string, rule: number) {
    this.filters[property] = val => val < rule;
    this.applyFilters()
  }

  filterMoreThan(property: string, rule: number) {
    this.filters[property] = val => val > rule;
    this.applyFilters()
  }


  removeFilter(property: string) {
    delete this.filters[property];
    this[property] = null;
    this.applyFilters()
  }



}
