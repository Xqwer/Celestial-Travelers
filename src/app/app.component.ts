import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import flightData from '../assets/GMAT_Earth_to_Jupiter.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  radianConversion = 0.01745328627927;
  totalFlightSteps = flightData.flightCoordinates.length;
  points = [];
  ngOnInit(): void {
    this.createThreeJsBox();
  }

  createThreeJsBox(): void {

    const canvas = document.getElementById('canvas-box');
    const scene = new THREE.Scene();
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/earth2.jpg'),
    });
    const jupiterMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/jupiterHD.jpg'),
    });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

    const geometry = new THREE.BufferGeometry();
    var positions = new Float32Array(this.totalFlightSteps * 3); // 3 vertices per point
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(2),
      earthMaterial
    );
    earth.position.x = 0;
    earth.position.y = 0;
    earth.position.z = 0;
    // earth.position.x = flightData.earthCoordinates.X;
    // earth.position.y = flightData.earthCoordinates.Y;
    // earth.position.z = flightData.earthCoordinates.Z;

    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      jupiterMaterial
    );
    jupiter.position.x = -100;
    jupiter.position.y = -0;
    jupiter.position.z = -100;
    // jupiter.position.x = flightData.jupiterCoordinates.X;
    // jupiter.position.y = flightData.jupiterCoordinates.Y;
    // jupiter.position.z = flightData.jupiterCoordinates.Z;

    scene.add(earth, jupiter);

    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      350,
      canvasSizes.width / canvasSizes.height,
      0.001,
      10000
    );
    camera.position.setX(flightData.flightCoordinates[0].X - flightData.earthCoordinates.X + 25);
    camera.position.setY(flightData.flightCoordinates[0].Y - flightData.earthCoordinates.Y);
    camera.position.setZ(flightData.flightCoordinates[0].Z - flightData.earthCoordinates.Z + 25);
    scene.add(camera);

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
      camera.updateProjectionMatrix();

      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
    });
    const clock = new THREE.Clock();
    const controls = new OrbitControls(camera, renderer.domElement);
    let flightStep = 1;
    setInterval(() => {
      // console.log(camera.position);
      // console.log(camera.rotation);
      // console.log('Jupiter', jupiter.position);
      // console.log('Distance to Jupiter.');
      console.log(
        // Math.abs(jupiter.position.x - camera.position.x),
        // Math.abs(jupiter.position.y - camera.position.y),
        // Math.abs(jupiter.position.z - camera.position.z)
      );
      // camera.position.setX(flightData.flightCoordinates[flightStep].X - flightData.flightCoordinates[flightStep - 1].X);
      // camera.position.setY(flightData.flightCoordinates[flightStep].Y - flightData.flightCoordinates[flightStep - 1].Y);
      // camera.position.setZ(flightData.flightCoordinates[flightStep].Z - flightData.flightCoordinates[flightStep - 1].Z);
      flightStep++;
    }, 10000);
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
