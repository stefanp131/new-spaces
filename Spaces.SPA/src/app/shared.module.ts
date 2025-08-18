import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule, QuillModule.forRoot()],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule, QuillModule]
})
export class SharedModule {}
