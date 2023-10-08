import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MissionPlanningModule } from './mission-planning/mission-planning.module';
import { MissionSimulationModule } from './mission-simulation/mission-simulation.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MissionPlanningModule,
    MissionSimulationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
