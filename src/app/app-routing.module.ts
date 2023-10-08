import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { MissionPlanningComponent } from './mission-planning/mission-planning.component';
import { MissionSimulationComponent } from './mission-simulation/mission-simulation.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'mission_planning',
    component: MissionPlanningComponent,
  },
  {
    path: 'mission_simulation',
    component: MissionSimulationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
