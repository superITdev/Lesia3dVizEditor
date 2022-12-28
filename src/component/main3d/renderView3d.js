import * as THREE from 'three'
import { DraftSize } from '../common'
import RenderView from '../manager/renderView'

export default class RenderView3d extends RenderView {
    initialize() {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        // camera
        this.camera = new THREE.PerspectiveCamera(45, viewW / viewH, 1, DraftSize * 10)
        this.camera.position.set(0, DraftSize / 2, DraftSize)
        this.camera.lookAt(0, 0, 0)

        super.initialize(this.camera)
    }
}