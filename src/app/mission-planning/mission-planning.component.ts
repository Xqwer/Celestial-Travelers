import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import flightData from '../../assets/GMAT_Earth_to_Jupiter.json';

@Component({
  selector: 'app-mission-planning',
  templateUrl: './mission-planning.component.html',
  styleUrls: ['./mission-planning.component.scss']
})
export class MissionPlanningComponent implements AfterViewInit {

  constructor(
    private router: Router
  ) { }

  radianConversion = 0.01745328627927;

  sideCanvasSizes = {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
  };
  blCamera = new THREE.PerspectiveCamera(
    50,
    this.sideCanvasSizes.width / this.sideCanvasSizes.height,
    0.001,
    100
  );
  ngAfterViewInit(): void {
    this.createThreeJsBox();
  }

  createThreeJsBox(): void {

    const canvas = document.getElementById('canvas-box');
    const blCanvas = document.getElementById('bottom_left_canvas');
    const brCanvas = document.getElementById('bottom_right_canvas');
    const scene = new THREE.Scene();
    const blScene = new THREE.Scene();
    const brScene = new THREE.Scene();

    const galaxyGeometry = new THREE.SphereGeometry(8000);
    const galaxyMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../../assets/stars_and_milky.jpg'),
      side: THREE.BackSide,
    })
    const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    scene.add(ambientLight);
    scene.add(pointLight);
    scene.add(galaxyMesh);

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../../assets/earth2.jpg'),
    });
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      earthMaterial
    );
    earthMesh.rotation.set(-0.4, -0.3, 0.8);
    earthMesh.position.set(15, 5, 5)
    const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    blScene.add(ambientLight2);
    blScene.add(pointLight2);
    blScene.add(earthMesh);

    const europaMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../../assets/europa.jpg'),
    });
    const europaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      europaMaterial
    );
    europaMesh.position.set(15, 5, 5)
    const ambientLight3 = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight3 = new THREE.PointLight(0xffffff, 0.5);
    brScene.add(ambientLight3);
    brScene.add(pointLight3);
    brScene.add(europaMesh);

    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    const canvasSizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const camera = new THREE.PerspectiveCamera(
      50,
      canvasSizes.width / canvasSizes.height,
      0.001,
      100000
    );

    this.blCamera.position.x = -10;
    this.blCamera.position.y = -10;
    this.blCamera.position.z = -10;
    this.blCamera.lookAt(earthMesh.position);
    const brCamera = new THREE.PerspectiveCamera(
      50,
      this.sideCanvasSizes.width / this.sideCanvasSizes.height,
      0.001,
      100
    );
    brCamera.position.x = -10;
    brCamera.position.y = -10;
    brCamera.position.z = -10;
    brCamera.lookAt(europaMesh.position);

    camera.position.setX(flightData.flightCoordinates[0].X - flightData.earthCoordinates.X + 1000);
    camera.position.setY(flightData.flightCoordinates[0].Y - flightData.earthCoordinates.Y);
    camera.position.setZ(flightData.flightCoordinates[0].Z - flightData.earthCoordinates.Z + 1000);

    scene.add(camera);
    blScene.add(this.blCamera);
    brScene.add(brCamera);

    if (!canvas || !blCanvas || !brCanvas) {
      console.error('Canvas HTML elements not rendered.');
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    const blRenderer = new THREE.WebGLRenderer({
      canvas: blCanvas,
      alpha: true,
    });
    const brRenderer = new THREE.WebGLRenderer({
      canvas: brCanvas,
    });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    blRenderer.setClearColor(0x000000, 0);
    blRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
    brRenderer.setClearColor(0x000000, 0);
    brRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);

    // new OrbitControls(this.blCamera, blRenderer.domElement);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;
      this.sideCanvasSizes.width = window.innerWidth / 2;
      this.sideCanvasSizes.height = window.innerHeight / 2;
      camera.aspect = canvasSizes.width / canvasSizes.height;
      this.blCamera.aspect = this.sideCanvasSizes.width / this.sideCanvasSizes.height;
      brCamera.aspect = this.sideCanvasSizes.width / this.sideCanvasSizes.height;
      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
      blRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
      blRenderer.render(blScene, this.blCamera);
      brRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
      brRenderer.render(brScene, brCamera);
    });
    const clock = new THREE.Clock();

    const animateGeometry = () => {
      earthMesh.rotateY(0.005);
      europaMesh.rotateY(0.005);
      camera.rotateX(0.001);
      camera.rotateY(0.001);
      camera.rotateZ(0.001);
      renderer.render(scene, camera);
      blRenderer.render(blScene, this.blCamera);
      brRenderer.render(brScene, brCamera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };
    animateGeometry();
  }

  goToSimulation() {
    this.router.navigate(['mission_simulation']);
  }
}