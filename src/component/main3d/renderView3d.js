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

    onWindowResize = () => {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight
        const viewAspect = viewW / viewH

        // keep aspect
        let vx = 0, vy = 0, vw = viewW, vh = viewH
        this.renderer.setSize(vw, vh) // three.js bug: setViewport(0, 0, vw, vh)

        const { aspect: cameraAspect } = this.camera
        if (cameraAspect < viewAspect) {
            vw = vh * cameraAspect
            vx = (viewW - vw) / 2
        } else if (viewAspect < cameraAspect) {
            vh = vw / cameraAspect
            vy = (viewH - vh) / 2
        }
        this.renderer.setViewport(vx, vy, vw, vh)

        this.render()
    }

    onMouseDown = (event) => {
        const hit = editManager.hitEntity(this.raycaster)
        if (hit) {
            editManager.toggleSizeMain3d()
        }
    }
}