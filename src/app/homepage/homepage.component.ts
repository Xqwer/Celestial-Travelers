import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const videoRef = document.getElementById('myVideo');
    (videoRef as any).muted = true;
    (videoRef as any).play();
  }

  goToPlanning() {
    this.router.navigate(['mission_planning'])
  }
}
