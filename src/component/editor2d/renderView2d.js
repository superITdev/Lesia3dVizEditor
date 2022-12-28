import * as THREE from 'three'
import { DraftSize } from '../common'
import RenderView, { RenderViewType } from '../manager/renderView'

export default class RenderView2d extends RenderView {
    initialize() {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        // camera
        this.camera = new THREE.OrthographicCamera(-viewW / 2, viewW / 2, viewH / 2, -viewH / 2, 1, DraftSize)
        switch (this.viewType) {
            case RenderViewType.XY:
                this.camera.position.set(0, 0, DraftSize)
                this.camera.rotation.set(0, 0, 0)
                break;
            case RenderViewType.YZ:
                this.camera.position.set(DraftSize, 0, 0)
                this.camera.rotation.set(0, Math.PI / 2, 0)
                break;
            case RenderViewType.ZX:
                this.camera.position.set(0, DraftSize, 0)
                this.camera.rotation.set(-Math.PI / 2, 0, 0)
                break;
            default:
                console.warn('unhandled view type', this.viewType)
                break
        }

        super.initialize(this.camera)
    }

    onWindowResize = () => {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        this.camera.left = -viewW / 2
        this.camera.right = viewW / 2
        this.camera.top = viewH / 2
        this.camera.bottom = -viewH / 2
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(viewW, viewH)

        this.render()
    }
}