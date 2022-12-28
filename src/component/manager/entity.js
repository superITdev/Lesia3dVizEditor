import * as THREE from 'three'
import { EntitySize } from '../common';

export default class Entity {
    mesh;

    create() {
        const size = EntitySize

        const geometry = new THREE.BoxGeometry(size, size, size)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.8, transparent: true })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(0, size / 2, 0)
    }

    addToScene(scene) {
        scene.add(this.mesh)
    }
}