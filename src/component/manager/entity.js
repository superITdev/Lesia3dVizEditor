import * as THREE from 'three'
import { EntitySize } from '../common';
import { editManager } from './editManager';

export default class Entity {
    mesh;

    create() {
        const size = EntitySize
        const geometry = new THREE.BoxGeometry(size, size, size)

        const matInfo = {
            color: 0xfeb74c,
            opacity: 0,
            transparent: true,
        }
        const material = new THREE.MeshBasicMaterial(matInfo)
        this.mesh = new THREE.Mesh(geometry, material)

        this.mesh.position.set(0, size / 2, 0)

        new THREE.TextureLoader().load('textures/square-outline-textured.png', (texture) => {
            const material = new THREE.MeshLambertMaterial({
                ...matInfo,
                opacity: 0.9,
                map: texture
            })
            this.mesh.material = material

            editManager.renderViews()
        })
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