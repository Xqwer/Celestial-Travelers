import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import flightData from '../../assets/GMAT_Earth_to_Jupiter.json';
import moonC from '../../assets/moon.json';

@Component({
  selector: 'app-mission-simulation',
  templateUrl: './mission-simulation.component.html',
  styleUrls: ['./mission-simulation.component.scss']
})
export class MissionSimulationComponent implements OnInit {
  radianConversion = 0.01745328627927;
  totalFlightSteps = flightData.flightCoordinates.length;
  flightStep = 2;
  moonStep = 1;
  date = new Date().getTime();
  arrivalDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 3;
  dateDifference = this.arrivalDate - this.date;
  dateStep = this.dateDifference / this.totalFlightSteps;
  points = [];

  constructor(private location: Location) { }
  ngOnInit(): void {
    this.createThreeJsBox();
  }

  createThreeJsBox(): void {

    const canvas = document.getElementById('canvas-box');
    const scene = new THREE.Scene();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    // scene.add(new THREE.AxesHelper(5000));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/earth2.jpg'),
    });
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(250),
      earthMaterial
    );
    earth.position.x = -7100;
    earth.position.y = 0;
    earth.position.z = -1300;

    const jupiterMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/jupiterHD.jpg'),
    });
    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(1320),
      jupiterMaterial
    );
    jupiter.position.x = flightData.jupiterCoordinates.X - 1000;
    jupiter.position.y = - flightData.jupiterCoordinates.Z;
    jupiter.position.z = flightData.jupiterCoordinates.Y;

    const europaMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/europa.jpg'),
    });
    const europa = new THREE.Mesh(
      new THREE.SphereGeometry(5 * 1.2 * 1100 / 44.79),
      europaMaterial
    );
    europa.position.x = flightData.jupiterCoordinates.X - 7100;
    europa.position.y = - flightData.jupiterCoordinates.Z;
    europa.position.z = flightData.jupiterCoordinates.Y - 1300;

    const moonMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/moon.jpg'),
    });
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(/*37.5*/100),
      moonMaterial
    );
    moon.position.x = (moonC.coordinates[0].X) / 3.3 + earth.position.x;
    moon.position.y = (-moonC.coordinates[0].Z) / 2.3;
    moon.position.z = (moonC.coordinates[0].Y) / 2.3 + earth.position.z;

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const camera = new THREE.PerspectiveCamera(
      350,
      canvasSizes.width / canvasSizes.height,
      0.001,
      100000000
    );
    camera.position.setX(earth.position.x - 13000);
    camera.position.setY(earth.position.y);
    camera.position.setZ(earth.position.z - 2000);

    scene.add(earth, jupiter, moon, europa, camera);

    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;
      camera.aspect = canvasSizes.width / canvasSizes.height;
      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });
    const clock = new THREE.Clock();
    new OrbitControls(camera, renderer.domElement);

    const drawingInterval = setInterval(() => {

      const points = [];
      points.push(new THREE.Vector3(
        flightData.flightCoordinates[this.flightStep - 1].X + - 7100,
        -flightData.flightCoordinates[this.flightStep - 1].Z,
        flightData.flightCoordinates[this.flightStep - 1].Y - 1300)
      );
      points.push(new THREE.Vector3(
        flightData.flightCoordinates[this.flightStep].X + - 7100,
        -flightData.flightCoordinates[this.flightStep].Z,
        flightData.flightCoordinates[this.flightStep].Y - 1300,
      ));

      this.date += this.dateStep;
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
      this.flightStep++;
      if (this.flightStep === this.totalFlightSteps) {
        clearInterval(drawingInterval);
      }
    }, 70);

    setInterval(() => {
      moon.position.x = (moonC.coordinates[this.moonStep % moonC.coordinates.length].X) / 3.3 + earth.position.x;
      moon.position.y = (-moonC.coordinates[this.moonStep % moonC.coordinates.length].Z) / 2.3;
      moon.position.z = (moonC.coordinates[this.moonStep % moonC.coordinates.length].Y) / 2.3 + earth.position.z;

      this.moonStep++;
    }, 50);


    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects
      if (this.flightStep !== this.totalFlightSteps) {
        camera.position.x -= 70 * elapsedTime;
        camera.position.z -= (2 + 9 * elapsedTime + 5 * elapsedTime ^ 2);
      }
      earth.rotation.x = 180 * this.radianConversion;
      earth.rotation.y = elapsedTime * this.radianConversion * 50;
      earth.rotation.z = 12.5 * this.radianConversion;

      jupiter.rotation.x = 0;
      jupiter.rotation.y = elapsedTime * this.radianConversion * 10;
      jupiter.rotation.z = 12.5 * this.radianConversion;

      // Render
      renderer.render(scene, camera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }

  goBack() {
    this.location.back();
  }
}