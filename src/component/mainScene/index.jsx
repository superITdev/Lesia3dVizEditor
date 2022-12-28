import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const borderThick = 1

export default function MainScene() {
    const container = useRef()

    useEffect(() => {
        const renderManager = new RenderManager(container.current)
        renderManager.initialize()
        renderManager.render()

        return () => {
            renderManager.destruct()
        }
    }, [])

    return (
        <div ref={container} tabIndex={0} style={{
            width: '50%',
            border: `${borderThick}px solid grey`,
            outline: 'none'
        }}>
        </div>
    )
}

class RenderManager {
    container;
    renderer;
    camera;
    scene;

    plane;
    pointer;
    raycaster;
    isShiftDown = false;

    rollOverMesh;
    rollOverMaterial;
    cubeGeo;
    cubeMaterial;

    objects = [];
    //
    constructor(container) {
        this.container = container
    }
    get renderViewer() { return this.renderer.domElement }
    get viewWidth() { return this.container.clientWidth }
    get viewHeight() { return this.container.clientHeight }

    get wViewWidth() {
        return Math.round(window.innerWidth / 2 - borderThick * 2)
    }
    get wViewHeight() {
        return Math.round(window.innerHeight / 2 - borderThick * 2)
    }

    initialize() {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        this.camera = new THREE.PerspectiveCamera(45, viewW / viewH, 1, 10000);
        this.camera.position.set(0, 500, 1000);
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // roll-over helpers
        const rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
        this.rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        this.rollOverMesh = new THREE.Mesh(rollOverGeo, this.rollOverMaterial);
        this.scene.add(this.rollOverMesh);

        // cubes
        this.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
        this.cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.8, transparent: true });

        // grid
        const gridHelper = new THREE.GridHelper(1000, 20);
        this.scene.add(gridHelper);

        //
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        const geometry = new THREE.PlaneGeometry(1000, 1000);
        geometry.rotateX(- Math.PI / 2);

        this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        this.scene.add(this.plane);

        this.objects = []
        this.objects.push(this.plane);

        // lights
        const ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(viewW, viewH);

        this.container.appendChild(this.renderer.domElement);

        // { event handler
        this.container.addEventListener('pointermove', this.onPointerMove);
        this.container.addEventListener('pointerdown', this.onPointerDown);
        this.container.addEventListener('keydown', this.onKeyDown);
        this.container.addEventListener('keyup', this.onKeyUp);

        window.addEventListener('resize', this.onWindowResize);
        // }
    }

    onWindowResize = () => {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        this.camera.aspect = viewW / viewH;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(viewW, viewH);

        this.render();
    }

    onPointerMove = (event) => {
        const vw = this.viewWidth
        const vh = this.viewHeight

        this.pointer.set((event.offsetX / vw) * 2 - 1, - (event.offsetY / vh) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {

            const intersect = intersects[0];

            this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

            this.render();
        }
    }

    onPointerDown = (event) => {
        const vw = this.viewWidth
        const vh = this.viewHeight

        this.pointer.set((event.offsetX / vw) * 2 - 1, - (event.offsetY / vh) * 2 + 1);

        this.raycaster.setFromCamera(this.pointer, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            if (this.isShiftDown) {
                if (intersect.object !== this.plane) {
                    // delete cube
                    this.scene.remove(intersect.object);
                    this.objects.splice(this.objects.indexOf(intersect.object), 1);
                }
            } else { // create cube
                const voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
                this.scene.add(voxel);

                this.objects.push(voxel);
            }

            this.render();
        }
    }

    onKeyDown = (event) => {
        switch (event.keyCode) {
            case 16: this.isShiftDown = true;
                break;
            default:
                break;
        }
    }

    onKeyUp = (event) => {
        switch (event.keyCode) {
            case 16: this.isShiftDown = false;
                break;
            default:
                break;
        }
    }

    render = () => {
        this.renderer.render(this.scene, this.camera);
    }

    destruct() {
        this.renderViewer.remove()

        // { event handler
        this.container.removeEventListener('pointermove', this.onPointerMove);
        this.container.removeEventListener('pointerdown', this.onPointerDown);
        this.container.removeEventListener('keydown', this.onKeyDown);
        this.container.removeEventListener('keyup', this.onKeyUp);

        window.removeEventListener('resize', this.onWindowResize);
        // }
    }
}