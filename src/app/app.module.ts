import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/compiler/src/core';
import {FlashMessagesModule, FlashMessagesService} from 'angular2-flash-messages';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFirestoreModule} from 'angularfire2/firestore';

import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AuthGuard} from './guards/auth.guard';

//Componentes
import { ProductosComponent } from './componentes/productos/productos.component';
import {NotFoundComponent} from './componentes/not-found/not-found.component';
import {DetailsComponent} from './componentes/details/details.component';
import {EditComponent} from './componentes/edit/edit.component';
import {FooterComponent, HeaderComponent} from './componentes/layout';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import {HomeComponent} from './componentes/home/home.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { NovedadesComponent } from './componentes/novedades/novedades.component';
import { NuevoProductoComponent } from './componentes/nuevo-producto/nuevo-producto.component';
import {FormComponent} from './componentes/form/form.component';
import {ProductComponent} from './componentes/product/product.component';
import {ProductsListComponent} from './componentes/products-list/products-list.component';
import {RegisterPageComponent} from './componentes/register-page/register-page.component';
import {LoginPageComponent} from './componentes/login-page/login-page.component';

//Servicios
import {AuthService} from './services/auth.service';
import {ProductoService} from './services/producto.service';
import {ChatService} from './services/chat.service';
import {FirestoreService} from './services/firestore.service';
import { FiltrarTextoPipe } from './pipes/filtrar-texto.pipe';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([]);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RegisterPageComponent,
    LoginPageComponent,
    FooterComponent,
    ProductosComponent,
    DetailsComponent,
    EditComponent,
    NotFoundComponent,
    NovedadesComponent,
    NuevoProductoComponent,
    PerfilComponent,
    ChatComponent,
    FormComponent,
    ProductComponent,
    ProductsListComponent,
    FiltrarTextoPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    rootRouting,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    FlashMessagesModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [
    AuthService,
    AuthGuard,
    FlashMessagesService,
    ProductoService,
    ChatService,
    FirestoreService
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
