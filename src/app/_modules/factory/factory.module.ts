import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { EditorComponent } from './_components/editor/editor.component';
import { EditorWrapperComponent } from './_components/editor-wrapper/editor-wrapper.component';
import { CardWrapperComponent } from './_components/card-wrapper/card-wrapper.component';
import { SearchComponent } from './_components/search/search.component';
import { UserLoginMenuComponent } from './_components/user-login-menu/user-login-menu.component';
import { AvatarComponent } from './_components/avatar/avatar.component';
import { LoginFormComponent } from './_components/login-form/login-form.component';
import { FormWrapperComponent } from './_components/form-wrapper/form-wrapper.component';
import { SharedModule } from '../shared/shared.module';


const EXPORTABLE_COMPONENTS = [
  NavbarComponent,
  EditorComponent,
  EditorWrapperComponent,
  CardWrapperComponent,
  SearchComponent,
  UserLoginMenuComponent,
  AvatarComponent,
  LoginFormComponent,
  FormWrapperComponent,
]

@NgModule({
  declarations: [
    ...EXPORTABLE_COMPONENTS,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    ...EXPORTABLE_COMPONENTS
  ]
})
export class FactoryModule { }
