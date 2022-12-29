import * as THREE from 'three'
import { EntitySize } from '../common';

export default class Entity {
    mesh;

    create() {
        const size = EntitySize

        const geometry = new THREE.BoxGeometry(size, size, size)
        // const material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.8, transparent: true })
        const material = new THREE.MeshLambertMaterial({
            color: 0xfeb74c,
            opacity: 0.9,
            transparent: true,
            map: new THREE.TextureLoader().load('textures/square-outline-textured.png')
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.set(0, size / 2, 0)
    }

    addToScene(scene) {
        scene.add(this.mesh)
    }

    hitTest(raycaster) {
        const intersects = raycaster.intersectObject(this.mesh, false)
        if (intersects.length > 0) {
            const intersect = intersects[0]
            if (intersect.object === this.mesh) {
                return { ...intersect, entity: this }
            }
        }
        return null
    }
}