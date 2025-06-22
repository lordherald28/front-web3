import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScanBlockComponent } from './scan-block/scan-block.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, 
  { path: 'dashboard', component: DashboardComponent },
  { path: 'scan', component: ScanBlockComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
