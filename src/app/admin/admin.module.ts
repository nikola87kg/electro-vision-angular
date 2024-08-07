/* Core modules */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* App modules */
import { AdminRoutingModule } from './admin-routing.module';
/* App compontents */
import { AdminComponent } from './admin.component';
import { AdminMaterialModule } from './admin.material.module';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { EmploymentAdminComponent } from './employment/employment-admin.component';
import { GalleryAdminComponent } from './gallery/gallery-admin.component';
import { GroupsComponent } from './groups/groups.component';
import { OrdersAdminComponent } from './orders/orders-admin.component';
import { PdfComponent } from './pdf/pdf.component';
import { PreviewComponent } from './preview/preview.component';
import { PricelistAdminComponent } from './pricelist/pricelist-admin.component';
import { ProductsComponent } from './products/products.component';
import { SlidesComponent } from './slides/slides.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    AdminMaterialModule,
    FontAwesomeModule,
  ],
  declarations: [
    AdminComponent,
    PdfComponent,
    SlidesComponent,
    ProductsComponent,
    CategoriesComponent,
    BrandsComponent,
    GroupsComponent,
    GalleryAdminComponent,
    PricelistAdminComponent,
    OrdersAdminComponent,
    PreviewComponent,
    EmploymentAdminComponent,
  ]
})
export class AdminModule { }
