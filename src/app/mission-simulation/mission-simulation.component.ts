import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import flightData from '../../assets/GMAT_Earth_to_Jupiter.json'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Stats from 'three/examples/jsm/libs/stats.module'

@Component({
  selector: 'app-mission-simulation',
  templateUrl: './mission-simulation.component.html',
  styleUrls: ['./mission-simulation.component.scss']
})
export class MissionSimulationComponent implements OnInit {
  radianConversion = 0.01745328627927;
  totalFlightSteps = flightData.flightCoordinates.length;
  flightStep = 2;
  points = [];
  ngOnInit(): void {
    this.createThreeJsBox();
  }

  createThreeJsBox(): void {

    const canvas = document.getElementById('canvas-box');
    const scene = new THREE.Scene();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    scene.add(new THREE.AxesHelper(2000));

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
      new THREE.SphereGeometry(100),
      earthMaterial
    );
    earth.position.x = -7100;
    earth.position.y = 0;
    earth.position.z = -1300;
    // earth.position.x = flightData.earthCoordinates.X;
    // earth.position.y = flightData.earthCoordinates.Y;
    // earth.position.z = flightData.earthCoordinates.Z;

    const jupiterMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/jupiterHD.jpg'),
    });
    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(1100),
      jupiterMaterial
    );
    jupiter.position.x = flightData.jupiterCoordinates.X - 7100;
    jupiter.position.y = - flightData.jupiterCoordinates.Z;
    jupiter.position.z = flightData.jupiterCoordinates.Y;

    const europaMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/europa.jpg'),
    });
    const europa = new THREE.Mesh(
      new THREE.SphereGeometry(1100 / 44.79),
      europaMaterial
    );
    europa.position.x = flightData.jupiterCoordinates.X + 2000;
    europa.position.y = flightData.jupiterCoordinates.Y + 2000;
    europa.position.z = flightData.jupiterCoordinates.Z + 2000;

    const moonMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/moon.jpg'),
    });
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(25),
      moonMaterial
    );
    moon.position.x = earth.position.x - 1500;
    moon.position.y = earth.position.y;
    moon.position.x = earth.position.z - 1500;
    // jupiter.position.x = flightData.jupiterCoordinates.X;
    // jupiter.position.y = flightData.jupiterCoordinates.Y;
    // jupiter.position.z = flightData.jupiterCoordinates.Z;

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
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;
      camera.aspect = canvasSizes.width / canvasSizes.height;
      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });
    const clock = new THREE.Clock();
    const controls = new OrbitControls(camera, renderer.domElement);

    const drawingInterval = setInterval(() => {
      // camera.position.x += 50;
      // camera.position.y += 50;
      // camera.position.z += 50;
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
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
      this.flightStep++;
      if (this.flightStep === this.totalFlightSteps) {
        console.log(flightData.flightCoordinates[this.flightStep - 1].X)
        console.log(flightData.flightCoordinates[this.flightStep - 1].Y)
        console.log(flightData.flightCoordinates[this.flightStep - 1].Z)
        console.log(flightData.jupiterCoordinates.X)
        console.log(flightData.jupiterCoordinates.Y)
        console.log(flightData.jupiterCoordinates.Z)
        clearInterval(drawingInterval);
      }
    }, 50);

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects

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

    // camera.position.x += 1;
    // camera.position.y += 1;

    animateGeometry();
  }
}