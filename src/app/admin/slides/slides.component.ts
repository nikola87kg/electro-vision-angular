import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faArrowCircleLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as slugify from 'speakingurl/speakingurl.min';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { SharedService } from '../../_services/shared.service';
import { SlideInterface, SlidesService } from './../../_services/slides.service';

@Component({
    selector: 'px-slides',
    templateUrl: './slides.component.html'
})
export class SlidesComponent implements OnInit {

    /* Constructor */
    constructor(
        private slideService: SlidesService,
        public sharedService: SharedService,
        public snackBar: MatSnackBar,
    ) { }

    faTimes = faTimes;
    faArrowCircleLeft = faArrowCircleLeft;

    slide: SlideInterface;
    displayedColumns = ['position', 'image', 'title', 'subtitle', 'created'];

    screenSize: string;
    slideList: Array<SlideInterface>;
    currentIndex: number;
    dataSource;

    isAddDialogOpen: boolean;
    isDialogEditing: boolean;
    isImageDialogOpen: boolean;
    dialogTitle;

    imageFile: File;
    imagePreview;
    imageID;
    imageindex: number;
    existingImage: string;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    /* INIT */
    ngOnInit(): void {
        this.sharedService.screenSize$$.subscribe(
            (result => this.screenSize = result)
        );
        this.getSlides();
    }

    fixSlug(text: string): void {
        const options = { maintainCase: false, separator: '-' };
        const mySlug = slugify.createSlug(options);
        const slug = mySlug(text);
        return slug;
    }

    /* Dialog  */
    openDialog(editing, singleSlide?, index?): void {
        if (editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = true;
            this.dialogTitle = 'Ažuriranje kategorije';
            this.slide = Object.assign({}, singleSlide);
            if (index !== undefined) {
                const pageSize = this.paginator.pageSize;
                const pageIndex = this.paginator.pageIndex;
                const realIndex = pageSize * pageIndex + index;
                this.currentIndex = realIndex;
            }
        }
        if (!editing) {
            this.isAddDialogOpen = true;
            this.isDialogEditing = false;
            this.dialogTitle = 'Dodavanje kategorije';
            this.clearForm();
        }
    }

    closeDialog(event): void {
        event.stopPropagation();
        this.isAddDialogOpen = false;
        this.clearForm();
    }

    openImageDialog(event, index): void {
        event.stopPropagation();
        const pageSize = this.paginator.pageSize;
        const pageIndex = this.paginator.pageIndex;
        const realIndex = pageSize * pageIndex + index;
        this.imageFile = null;
        this.imagePreview = null;
        this.isImageDialogOpen = true;
        this.imageID = this.slideList[realIndex]._id;
        this.existingImage = this.slideList[realIndex].image;
        this.imageindex = realIndex;
        this.dialogTitle = 'Dodavanje slike';
    }

    closeImageDialog(): void {
        this.isImageDialogOpen = false;
        this.existingImage = null;
        this.imagePreview = null;
    }

    clearForm(): void {
        this.slide = {
            _id: '',
            title: '',
            subtitle: '',
            image: '',
            createdAt: null
        };
    }
    /* Add new slide */
    postSlide(slide, event): void {
        const fixedSlug = this.fixSlug(slide.slug);
        slide.slug = fixedSlug;
        this.slideService.post(slide).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getSlides();
                this.openSnackBar({
                    action: 'create2',
                    type: 'slide'
                });
            });
    }

    /* Update slide */
    putSlide(slide, event): void {
        const fixedSlug = this.fixSlug(slide.slug);
        slide.slug = fixedSlug;
        this.slideService.put(slide._id, slide).subscribe(
            (response) => {
                this.closeDialog(event);
                this.getSlides();
                this.openSnackBar({
                    action: 'update2',
                    type: 'slide'
                });
            }
        );
    }

    /* Delete slide */
    deleteSlide(id, event): void {
        this.slideService.delete(id).subscribe(
            (response) => {
                this.slideList.splice(this.currentIndex, 1);
                this.dataSource = new MatTableDataSource(this.slideList);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.closeDialog(event);
                this.openSnackBar({
                    action: 'delete2',
                    type: 'slide'
                });
            }
        );
    }

    /* Get Sldies */
    getSlides(): void {
        this.slideService.get().subscribe(response => {
            this.slideList = response;
            this.dataSource = new MatTableDataSource(this.slideList);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
    }

    /* Image upload */

    onImagePicked(event: Event): void {
        const file = (event.target as HTMLInputElement).files[0];
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
    }

    postImage(): void {
        const formData = new FormData();
        const filename = this.imageFile.name;
        formData.append('image', this.imageFile, filename);

        const thisCategory = this.slideList[this.imageindex];
        const catId = thisCategory._id;
        thisCategory.image = filename;

        this.slideService.put(catId, thisCategory).subscribe(
            (response) => {
                this.slideService.postImage(this.imageID, formData).subscribe(
                    (response2) => {
                        this.closeImageDialog();
                        this.getSlides();
                        this.openSnackBar({
                            action: 'update2',
                            type: 'image'
                        });
                    }
                );
            });
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: object,
        });
    }
}
