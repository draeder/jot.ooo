import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorWrapperComponent } from '../factory/_components/editor-wrapper/editor-wrapper.component';
import { LandingComponent } from './_components/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent, children: [
    { path: '', component: EditorWrapperComponent, pathMatch: 'full' },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }