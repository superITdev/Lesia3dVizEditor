import * as THREE from 'three'
import { BorderThick } from '../common'
import { editManager } from './editManager'

export const RenderViewType = {
    Perspective: 0,
    XY: 1,
    YZ: 2,
    ZX: 3,
}

export default class RenderView {
    viewType = RenderViewType.Perspective

    container
    renderer
    camera

    constructor(container, viewerType = RenderViewType.Perspective) {
        this.container = container
        this.viewType = viewerType
    }
    get canvas() { return this.renderer.domElement }
    get viewWidth() { return this.container.clientWidth }
    get viewHeight() { return this.container.clientHeight }

    get wViewWidth() {
        return Math.round(window.innerWidth / 2 - BorderThick * 2)
    }
    get wViewHeight() {
        return Math.round(window.innerHeight / 2 - BorderThick * 2)
    }

    initialize(camera) {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        // camera
        this.camera = camera

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(viewW, viewH)

        this.container.appendChild(this.renderer.domElement)

        // { event handler
        this.container.addEventListener('pointermove', this.onPointerMove)
        this.container.addEventListener('pointerdown', this.onPointerDown)
        this.container.addEventListener('keydown', this.onKeyDown)
        this.container.addEventListener('keyup', this.onKeyUp)

        window.addEventListener('resize', this.onWindowResize)
        // }
    }
    destruct() {
        this.canvas.remove()

        // { event handler
        this.container.removeEventListener('pointermove', this.onPointerMove)
        this.container.removeEventListener('pointerdown', this.onPointerDown)
        this.container.removeEventListener('keydown', this.onKeyDown)
        this.container.removeEventListener('keyup', this.onKeyUp)

        window.removeEventListener('resize', this.onWindowResize)
        // }
    }

    render = () => {
        editManager.render(this.renderer, this.camera)
    }

    onWindowResize = () => {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        this.camera.aspect = viewW / viewH
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(viewW, viewH)

        this.render()
    }

    onPointerMove = (event) => {
    }

    onPointerDown = (event) => {
    }

    onKeyDown = (event) => {
    }

    onKeyUp = (event) => {
    }
}