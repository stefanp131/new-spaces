import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MaterialModule]
})
export class SharedModule {}
