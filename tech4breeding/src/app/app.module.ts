
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CoreModule } from './core/core.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { HeaderComponent } from './core/components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';  // Correct import for ToastrModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Ensure this is correct for animations


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,  // Import for animations
    HttpClientModule,
    HeaderComponent,
    CoreModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot([]),
    DataTablesModule,
    FormsModule,
    NgApexchartsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    ToastrModule.forRoot(),  // Correct usage of ToastrModule
    SidebarComponent,
    
  ],exports: [],
  providers: [],
  bootstrap: [],  // Ensure the main component is bootstrapped correctly
})
export class AppModule {}
