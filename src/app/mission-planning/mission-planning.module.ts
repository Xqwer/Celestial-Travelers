import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionPlanningComponent } from './mission-planning.component';



@NgModule({
  declarations: [
    MissionPlanningComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MissionPlanningComponent,
  ]
})
export class MissionPlanningModule { }
