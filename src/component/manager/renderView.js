import * as THREE from 'three'
import { BorderThick } from '../common'
import { camera_scs2ncs } from '../util';
import { editManager } from './editManager'

export const RenderViewType = {
    Perspective: 'Perspective',
    XY: 'X-Y',
    YZ: 'Y-Z',
    ZX: 'Z-X',
}

export default class RenderView {
    viewType = RenderViewType.Perspective;
    fullSized = false;

    editorDom;
    renderViewDom;

    renderer;
    camera;

    raycaster = new THREE.Raycaster()

    constructor(editorDom, renderViewDom, viewerType = RenderViewType.Perspective) {
        this.editorDom = editorDom
        this.renderViewDom = renderViewDom

        this.viewType = viewerType

        editManager.registerView(this)
    }
    get canvas() { return this.renderer.domElement }
    get viewWidth() { return this.renderViewDom.clientWidth }
    get viewHeight() { return this.renderViewDom.clientHeight }

    get wViewWidth() {
        const size = this.fullSized ? window.innerWidth : window.innerWidth / 2
        return Math.round(size - BorderThick * 2)
    }
    get wViewHeight() {
        const size = this.fullSized ? window.innerHeight : window.innerHeight / 2
        return Math.round(size - BorderThick * 2)
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

        this.renderViewDom.appendChild(this.renderer.domElement)

        // { event handler
        this.renderViewDom.addEventListener('pointerdown', this.onPointerDown)
        this.renderViewDom.addEventListener('pointermove', this.onPointerMove)
        this.renderViewDom.addEventListener('pointerup', this.onPointerUp)

        this.renderViewDom.addEventListener('keydown', this.onKeyDown)
        this.renderViewDom.addEventListener('keyup', this.onKeyUp)

        window.addEventListener('resize', this.onWindowResize)
        // }
    }
    destruct() {
        this.canvas.remove()

        // { event handler
        this.renderViewDom.removeEventListener('pointerdown', this.onPointerDown)
        this.renderViewDom.removeEventListener('pointermove', this.onPointerDrag)
        this.renderViewDom.removeEventListener('pointermove', this.onPointerMove)
        this.renderViewDom.removeEventListener('pointerup', this.onPointerUp)

        this.renderViewDom.removeEventListener('keydown', this.onKeyDown)
        this.renderViewDom.removeEventListener('keyup', this.onKeyUp)

        window.removeEventListener('resize', this.onWindowResize)
        // }
    }

    render = () => {
        editManager.renderView(this)
    }

    updateRayCaster(event) {
        const ncs = camera_scs2ncs(event.offsetX, event.offsetY, this.viewWidth, this.viewHeight)
        this.raycaster.setFromCamera(ncs, this.camera)
    }

    onWindowResize = () => {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        this.camera.aspect = viewW / viewH
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(viewW, viewH)

        this.render()
    }

    onPointerDown = (event) => {
        this.renderViewDom.setPointerCapture(event.pointerId)
        this.renderViewDom.addEventListener('pointermove', this.onPointerDrag)

        if (this.onMouseDown) {
            this.updateRayCaster(event)
            this.onMouseDown(event)
        }
    }
    onPointerDrag = (event) => {
        if (this.onMouseDrag) {
            this.updateRayCaster(event)
            this.onMouseDrag(event)
        }
    }
    onPointerMove = (event) => {
        if (this.onMouseMove) {
            this.updateRayCaster(event)
            this.onMouseMove(event)
        }
    }
    onPointerUp = (event) => {
        this.renderViewDom.releasePointerCapture(event.pointerId)
        this.renderViewDom.removeEventListener('pointermove', this.onPointerDrag)

        if (this.onMouseUp) {
            this.updateRayCaster(event)
            this.onMouseUp(event)
        }
    }

    onKeyDown = (event) => {
    }
    onKeyUp = (event) => {
    }

    showView(show = true) {
        const editorDomStyle = this.editorDom.style
        editorDomStyle.visibility = show ? 'visible' : 'hidden'
    }
    fullSizeView(fullSize) {
        this.fullSized = fullSize

        const editorDomStyle = this.editorDom.style
        editorDomStyle.width = fullSize ? '100%' : '50%'

        this.onWindowResize()
    }
}