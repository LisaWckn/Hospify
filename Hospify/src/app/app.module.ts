import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderLinesComponent } from './components/header/header-lines/header-lines.component';
import { HeaderTitleComponent } from './components/header/header-title/header-title.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderLinesComponent,
    HeaderTitleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
