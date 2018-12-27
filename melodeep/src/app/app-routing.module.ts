import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GenerateFormComponent} from './generate-form/generate-form.component';

const routes: Routes = [
  { path: 'generate-form', component: GenerateFormComponent },
  { path: '',
      redirectTo: '/generate-form',
      pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
