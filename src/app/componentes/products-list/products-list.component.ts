import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FirestoreService} from '../../services/firestore.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {

  items = [];

  dataSubscription;
  categories = ['Movil', 'Videoconsola', 'Ordenador'];
  sortOptions = [
    {
      name: 'Reciente',
      key: 'createdAt'
    },
    {
      name: 'Precio:Más barato a más caro',
      key: 'base_price'
    },
    {
      name: 'Precio:Más caro a más barato',
      key: 'base_price'
    }
  ];
  currentUid;
  currentUsu;

  currentRoute;
  categoryPage = true;

  currentFilter;
  currentSortOption = this.sortOptions[0].key;
  isPriceLowToHigh = false;
  isAdmin = false;

    constructor(
      private route: ActivatedRoute,
      private fService: FirestoreService,
      private authService: AuthService,
      private router: Router
    ) {
    }

    ngOnInit() {
      this.authService.getAuth().subscribe(data => {
        if (data) {
          this.currentUid = data['uid'];
          this.currentUsu = data.displayName;
        }
      });
      this.currentRoute = this.router.url;
      //console.log(this.currentRoute.split('/').slice(1));
      if (this.currentRoute.indexOf('producto_pujas') > -1) {
        this.categoryPage = true;
        this.isAdmin = false;
      } else {
        this.isAdmin = false;
        this.categoryPage = false;
      }
      this.route.queryParams.subscribe(data => {
        if (data) {
          this.currentFilter = data.filter;
          if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
          }
          this.getDocuments(this.currentFilter, this.currentSortOption);//, this.isAdmin ? (!this.isPending) : true);
        }
      });
     }
  //getDocuments(filter, sort, type)
     getDocuments(filter, sort) {
      //.getDocuments(filter, true, this.categoryPage, sort, type)
       this.dataSubscription = this.fService.getDocuments(filter, true, this.categoryPage, sort).subscribe(data => {
         if (data && data.length) {
           if (this.isPriceLowToHigh) {
             this.items = data.reverse();
           } else {
             this.items = data;
           }
         } else {
           this.items = [];
           console.log(this.items);
         }
       });
     }

     showProduct(item) {
       this.router.navigate(['/product', item.product_id]);
    }

      navigate(filter?) {
        const Route = 'producto_pujas';//this.categoryPage ? (this.isAdmin ? 'admin' : 'pujas') : 'my_offers';
        if (filter) {
          this.router.navigate([`/${Route}`], {queryParams : {filter: filter}});
        } else {
          this.router.navigate([`/${Route}`]);
        }
      }
      navigateToUrl(route) {
        this.router.navigate([route]);
      }
      bid(product_id) {
        this.router.navigate([`/product/${product_id}`]);
      }

      sort(value) {
        this.sortOptions.forEach(sort => {
          if (sort.name === value) {
            this.isPriceLowToHigh = sort.name === 'Precio:Más barato a más caro'; //? true : false;
            this.currentSortOption = sort.key;
            return;
          }
        });
        this.getDocuments(this.currentFilter, this.currentSortOption);//, this.isAdmin ? (!this.isPending) : true);
        console.log(value);
      }/*
      show(type: string) {
        this.isPending = type === 'pending'; //? true : false;
        this.getDocuments(this.currentFilter, this.currentSortOption, this.isAdmin ? (!this.isPending) : true);
      }*/
      ngOnDestroy() {
        if (this.dataSubscription) {
          this.dataSubscription.unsubscribe();
        }
      }
  }
