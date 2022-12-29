import * as THREE from 'three'
import { CameraNF, DraftSize } from '../common'
import { editManager } from '../manager/editManager'
import RenderView from '../manager/renderView'

export default class RenderView3d extends RenderView {
    initialize() {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        // camera
        this.camera = new THREE.PerspectiveCamera(45, viewW / viewH, 1, CameraNF)
        this.camera.position.set(0, DraftSize / 2, DraftSize)
        this.camera.lookAt(0, 0, 0)

        editManager.setMainCamera(this.camera)

        super.initialize(this.camera)
    }
    onMouseDown = (event) => {
        const hit = editManager.hitEntity(this.raycaster)
        if (hit) {
            editManager.toggleSizeMain3d()
        }
    }
}