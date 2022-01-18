import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';

const EXPORTABLE_COMPONENTS = [
  NavbarComponent
]

@NgModule({
  declarations: [
    ...EXPORTABLE_COMPONENTS
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ...EXPORTABLE_COMPONENTS
  ]
})
export class FactoryModule { }
