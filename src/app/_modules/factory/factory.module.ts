import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { EditorComponent } from './_components/navbar/editor/editor.component';
import { EditorWrapperComponent } from './_components/navbar/editor-wrapper/editor-wrapper.component';
import { CardWrapperComponent } from './_components/navbar/card-wrapper/card-wrapper.component';
import { SearchComponent } from './_components/search/search.component';


const EXPORTABLE_COMPONENTS = [
  NavbarComponent,
  EditorComponent,
  EditorWrapperComponent,
  CardWrapperComponent,
  SearchComponent
]

@NgModule({
  declarations: [
    ...EXPORTABLE_COMPONENTS
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    ...EXPORTABLE_COMPONENTS
  ]
})
export class FactoryModule { }
