import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BannerComponent } from './components/partials/banner/banner.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/partials/header/header.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, BannerComponent, HomeComponent, HeaderComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
