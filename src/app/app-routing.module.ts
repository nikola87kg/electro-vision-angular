/* Core modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* App components */
import { ContactComponent } from './pages/contact/contact.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PricelistComponent } from './pages/pricelist/pricelist.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { SearchComponent } from './pages/search/search.component';

/* Guards */
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
    { path: 'pocetna', component: HomepageComponent },
    { path: 'kontakt', component: ContactComponent },
    { path: 'galerija', component: GalleryComponent },
    { path: 'cenovnik', component: PricelistComponent },
    { path: 'proizvod/:slug', component: ProductPageComponent },
    { path: 'pretraga/:level/:slug', component: SearchComponent },
    { 
        path: 'admin',                
        loadChildren: './admin/admin.module#AdminModule', 
        canLoad: [AdminGuard] 
    },
    { 
        path: '',                    
        redirectTo: '/pocetna', 
        pathMatch: 'full' 
    },
    { 
        path: '**',                   
        redirectTo: '/pocetna' 
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
