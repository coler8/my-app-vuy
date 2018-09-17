import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './componentes/login-page/login-page.component';
import {RegisterPageComponent} from './componentes/register-page/register-page.component';

import {AuthGuard} from './guards/auth.guard';
import {HomeComponent} from './componentes/home/home.component';
import {ProductosComponent} from './componentes/productos/productos.component';
import {NotFoundComponent} from './componentes/not-found/not-found.component';
import {DetailsComponent} from './componentes/details/details.component';
import {EditComponent} from './componentes/edit/edit.component';
import {NovedadesComponent} from './componentes/novedades/novedades.component';
import {NuevoProductoComponent} from './componentes/nuevo-producto/nuevo-producto.component';
import {PerfilComponent} from './componentes/perfil/perfil.component';
import {FormComponent} from './componentes/form/form.component';
import {ProductComponent} from './componentes/product/product.component';
import {ProductsListComponent} from './componentes/products-list/products-list.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'subir', component: NuevoProductoComponent, canActivate: [AuthGuard]},
  {path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard]},
  {path: 'productos', component: ProductosComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: 'edit/:id', component: EditComponent, canActivate: [AuthGuard]},
  {path: 'novedades', component: NovedadesComponent},
  {path: 'edit_product/:id', component: FormComponent, canActivate: [AuthGuard]},
  {path: 'add_product', component: FormComponent, canActivate: [AuthGuard]},
  {path: 'producto_pujas', component: ProductsListComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
