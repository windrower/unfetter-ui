import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadComponent } from './file-upload.component';
import { UploadService } from './upload.service';
import { MdIconModule, MdInputModule, MdButtonModule, MdProgressBarModule, MdCardModule, MdListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

const components = [
  FileUploadComponent,
];

const mdComponents = [
    MdButtonModule,
    MdCardModule,
    MdListModule,
    MdIconModule,
    MdInputModule,
    MdProgressBarModule,
];

const services = [
  UploadService,
];

@NgModule({
  declarations: [
    ...components,
],
imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ...mdComponents,
  ],
  providers: [
    ...services
  ],
  exports: [
      ...components
  ]
})
export class FileUploadModule { }