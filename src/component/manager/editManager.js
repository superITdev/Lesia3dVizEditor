import * as THREE from 'three'
import { DraftSize, GridCellN } from '../common';
import Entity from './entity';

class EditManager {
    scene;
    entity;

    constructor() {
        this.initialize()
    }

    initialize() {
        // scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xf0f0f0)

        // entity
        this.entity = new Entity()
        this.entity.create()
        this.entity.addToScene(this.scene)

        // grid
        const gridHelper = new THREE.GridHelper(DraftSize, GridCellN)
        this.scene.add(gridHelper)

        const gridGeo = new THREE.PlaneGeometry(DraftSize, DraftSize)
        gridGeo.rotateX(- Math.PI / 2)
        const grid = new THREE.Mesh(gridGeo, new THREE.MeshBasicMaterial({ visible: false }))
        this.scene.add(grid)

        // lights
        const ambientLight = new THREE.AmbientLight(0x606060)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff)
        directionalLight.position.set(1, 0.75, 0.5).normalize()
        this.scene.add(directionalLight)
    }

    render(renderer, camera) {
        renderer.render(this.scene, camera)
    }
}

const editManager = new EditManager()
export { editManager }