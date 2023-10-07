import { AfterViewInit, Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import flightData from '../../assets/GMAT_Earth_to_Jupiter.json';


@Component({
  selector: 'app-mission-planning',
  templateUrl: './mission-planning.component.html',
  styleUrls: ['./mission-planning.component.scss']
})
export class MissionPlanningComponent implements AfterViewInit {
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
    // const brScene = new THREE.Scene();

    const galaxyGeometry = new THREE.SphereGeometry(8000);
    const galaxyMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../../assets/stars_and_milky.jpg'),
      side: THREE.BackSide,
    })
    const galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load('../assets/earth2.jpg'),
    });
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      earthMaterial
    );
    earthMesh.rotation.set(-0.4, -0.3, 0.8)
    scene.add(galaxyMesh);
    blScene.add(earthMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    blScene.add(ambientLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 2;
    scene.add(pointLight);
    blScene.add(pointLight2);
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

    this.blCamera.position.x = -20;
    this.blCamera.position.y = -20;
    this.blCamera.position.z = -20;
    this.blCamera.lookAt(earthMesh.position);
    // const brCamera = new THREE.PerspectiveCamera(
    //   50,
    //   this.sideCanvasSizes.width / this.sideCanvasSizes.height,
    //   0.001,
    //   100
    // );
    camera.position.setX(flightData.flightCoordinates[0].X - flightData.earthCoordinates.X + 1000);
    camera.position.setY(flightData.flightCoordinates[0].Y - flightData.earthCoordinates.Y);
    camera.position.setZ(flightData.flightCoordinates[0].Z - flightData.earthCoordinates.Z + 1000);


    scene.add(camera);
    blScene.add(this.blCamera);
    // brScene.add(brCamera);

    if (!canvas || !blCanvas || !brCanvas) {
      console.log('Whoops');
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    const blRenderer = new THREE.WebGLRenderer({
      canvas: blCanvas,
      alpha: true,
    });
    // const brRenderer = new THREE.WebGLRenderer({
    //   canvas: brCanvas,
    // });
    renderer.setClearColor(0xe232222, 1);
    renderer.setSize(canvasSizes.width, canvasSizes.height);
    blRenderer.setClearColor(0x000000, 0);
    blRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
    // brRenderer.setClearColor(0x000000, 0);
    // brRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);

    // new OrbitControls(this.blCamera, blRenderer.domElement);

    window.addEventListener('resize', () => {
      canvasSizes.width = window.innerWidth;
      canvasSizes.height = window.innerHeight;
      this.sideCanvasSizes.width = window.innerWidth / 2;
      this.sideCanvasSizes.height = window.innerHeight / 2;
      camera.aspect = canvasSizes.width / canvasSizes.height;
      this.blCamera.aspect = this.sideCanvasSizes.width / this.sideCanvasSizes.height;
      // brCamera.aspect = this.sideCanvasSizes.width / this.sideCanvasSizes.height;
      renderer.setSize(canvasSizes.width, canvasSizes.height);
      renderer.render(scene, camera);
      blRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
      blRenderer.render(blScene, this.blCamera);
      // brRenderer.setSize(this.sideCanvasSizes.width, this.sideCanvasSizes.height);
      // brRenderer.render(brScene, brCamera);
    });
    const clock = new THREE.Clock();

    setInterval(() => {
      console.log(earthMesh.rotation);
      console.log(this.blCamera.rotation);
    }, 5000)


    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();
      // earthMesh.rotation.y = elapsedTime * this.radianConversion * 50;

      earthMesh.rotateY(0.005);
      camera.rotateX(0.001);
      camera.rotateY(0.001);
      camera.rotateZ(0.001);
      renderer.render(scene, camera);
      blRenderer.render(blScene, this.blCamera);
      // brRenderer.render(brScene, brCamera);

      // Call animateGeometry again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };
    animateGeometry();
    // camera.position.x += 1;
    // camera.position.y += 1;
  }

  rotateCamera() {
    this.blCamera.position.x -= 10;
    this.blCamera.position.y -= 10;
    this.blCamera.position.z -= 10;
  }
}