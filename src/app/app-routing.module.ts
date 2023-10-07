import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MissionPlanningComponent } from './mission-planning/mission-planning.component';
import { MissionSimulationComponent } from './mission-simulation/mission-simulation.component';

const routes: Routes = [
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
