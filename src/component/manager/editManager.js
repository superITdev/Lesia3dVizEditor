import * as THREE from 'three'
import { DraftSize, GridCellN } from '../common';
import Entity from './entity';
import { RenderViewType } from './renderView';

class EditManager {
    scene;
    entity;

    mainCamera;
    mainCameraHelper;

    views = {}

    constructor() {
        this.createScene()
    }

    createScene() {
        // scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xf0f0f0)

        // const axesHelper = new THREE.AxesHelper(DraftSize)
        // this.scene.add(axesHelper)

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
    setMainCamera(mainCamera) {
        this.mainCamera = mainCamera
        this.mainCameraHelper = new THREE.CameraHelper(mainCamera)
        this.scene.add(this.mainCameraHelper)
    }

    registerView(view) {
        this.views[view.viewType] = view
    }
    getView(viewType) {
        return this.views[viewType]
    }

    renderView(view) {
        const { renderer, camera, viewType } = view

        const visible = (viewType !== RenderViewType.Perspective)
        this.mainCameraHelper.visible = visible

        renderer.render(this.scene, camera)
    }
    renderViews() {
        for (const viewType in this.views) {
            const view = this.getView(viewType)
            this.renderView(view)
        }
    }
    resetMainViewport() {
        const view = this.getView(RenderViewType.Perspective)
        view.onWindowResize()
    }

    hitEntity(raycaster) {
        return this.entity.hitTest(raycaster)
    }

    fullSizeMain3d(fullSize) {
        const main3d = this.getView(RenderViewType.Perspective)

        for (const viewType in this.views) {
            const view = this.getView(viewType)
            view.fullSizeView(view === main3d ? fullSize : false)
        }
    }
    toggleSizeMain3d() {
        const main3d = this.getView(RenderViewType.Perspective)
        this.fullSizeMain3d(!main3d.fullSized)
    }
}

const editManager = new EditManager()
export { editManager }