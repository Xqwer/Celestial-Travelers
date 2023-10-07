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
  flightStep = 2;
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);

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

    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(1100),
      jupiterMaterial
    );
    jupiter.position.x = flightData.jupiterCoordinates.X -7100;
    jupiter.position.y = flightData.jupiterCoordinates.Y;
    jupiter.position.z = flightData.jupiterCoordinates.Z-1300;
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
      100000000
    );
    camera.position.setX(flightData.flightCoordinates[0].X );
    camera.position.setY(flightData.flightCoordinates[0].Y);
    camera.position.setZ(flightData.flightCoordinates[0].Z);
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
    console.log(this.totalFlightSteps);

    const drawingInterval = setInterval(() => {
      camera.position.x +=50;
      camera.position.y+=50;
      camera.position.z +=50;
      const points = [];
      points.push(new THREE.Vector3(
        flightData.flightCoordinates[this.flightStep - 1].X + - 7100,
        flightData.flightCoordinates[this.flightStep - 1].Y,
        flightData.flightCoordinates[this.flightStep - 1].Z - 1300)
      );
      points.push(new THREE.Vector3(
        flightData.flightCoordinates[this.flightStep].X + - 7100,
        flightData.flightCoordinates[this.flightStep].Y,
        flightData.flightCoordinates[this.flightStep].Z - 1300,
      ));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
      this.flightStep++;
      console.log(this.flightStep);
     
    }, 300);

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animation objects

      earth.rotation.x = 90 * this.radianConversion;
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
