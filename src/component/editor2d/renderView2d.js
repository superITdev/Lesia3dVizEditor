import * as THREE from 'three'
import { CameraNF, DraftSize, EditToolMode } from '../common'
import { editManager } from '../manager/editManager';
import RenderView, { RenderViewType } from '../manager/renderView'
import { camera_scs2wcs } from '../util';

export default class RenderView2d extends RenderView {
    editToolMode;
    editToolCmd = null;

    initialize() {
        const viewW = this.wViewWidth
        const viewH = this.wViewHeight

        // camera
        this.camera = new THREE.OrthographicCamera(-viewW / 2, viewW / 2, viewH / 2, -viewH / 2, 1, CameraNF)
        switch (this.viewType) {
            case RenderViewType.XY:
                this.camera.position.set(0, 0, DraftSize)
                this.camera.rotation.set(0, 0, 0)
                break
            case RenderViewType.YZ:
                this.camera.position.set(-DraftSize, 0, 0)
                this.camera.rotation.set(0, -Math.PI / 2, 0)
                break
            case RenderViewType.ZX:
                this.camera.position.set(0, DraftSize, 0)
                this.camera.rotation.set(-Math.PI / 2, 0, 0)
                break
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

    changeEditToolMode(editToolMode) {
        this.editToolMode = editToolMode
    }

    onMouseDown = (event) => {
        const { offsetX: scx, offsetY: scy } = event

        switch (this.editToolMode) {
            case EditToolMode.translateEntity.value:
            case EditToolMode.scaleEntity.value:
            case EditToolMode.rotateEntity.value:
                {
                    const hit = editManager.hitEntity(this.raycaster)
                    if (!hit) {
                        return
                    }

                    const { object: mesh } = hit
                    const { vcs } = camera_scs2wcs(scx, scy, this.viewWidth, this.viewHeight, this.camera)

                    const { geometry } = mesh
                    geometry.computeBoundingBox()

                    this.editToolCmd = {
                        mesh,

                        matrixWorldInv0: mesh.matrixWorld.clone().invert(),
                        position0: mesh.position.clone(),
                        scale0: mesh.scale.clone(),
                        rotation0: mesh.rotation.clone(),
                        boundingBox0: geometry.boundingBox.clone(),

                        scs0: new THREE.Vector2(scx, scy),
                        local0: mesh.worldToLocal(vcs.clone())
                    }
                    break
                }
            case EditToolMode.camerFov.value: {
                const mainCamera = editManager.mainCamera

                this.editToolCmd = {
                    mainCamera,
                    fov0: mainCamera.fov,
                    aspect0: mainCamera.aspect,
                    scs0: new THREE.Vector2(scx, scy)
                }
                break
            }
            case EditToolMode.cameraMove.value: {
                const { vcs } = camera_scs2wcs(scx, scy, this.viewWidth, this.viewHeight, this.camera)
                const mainCamera = editManager.mainCamera

                this.editToolCmd = {
                    mainCamera,
                    matrixWorldInv0: mainCamera.matrixWorld.clone().invert(),
                    position0: mainCamera.position.clone(),
                    local0: mainCamera.worldToLocal(vcs.clone())
                }
                break
            }
            default: {
                console.warn('onMouseDown: unhandled editToolMode', this.editToolMode)
                break
            }
        }
    }
    onMouseDrag = (event) => {
        // console.log('onMouseDrag', this.viewType, event)
        if (!this.editToolCmd) {
            return
        }

        const { offsetX: scx, offsetY: scy } = event

        switch (this.editToolMode) {
            case EditToolMode.translateEntity.value:
            case EditToolMode.scaleEntity.value:
            case EditToolMode.rotateEntity.value:
                {
                    const { mesh, matrixWorldInv0, position0, scale0, local0 } = this.editToolCmd
                    const { vcs } = camera_scs2wcs(scx, scy, this.viewWidth, this.viewHeight, this.camera)
                    const local = vcs.applyMatrix4(matrixWorldInv0)

                    switch (this.editToolMode) {
                        case EditToolMode.translateEntity.value: {
                            const distance = local0.distanceTo(local)
                            const direction = local.sub(local0).normalize()
                            direction.multiply(scale0)

                            mesh.position.copy(position0)
                            mesh.translateOnAxis(direction, distance)
                            break
                        }
                        case EditToolMode.scaleEntity.value: {
                            const { boundingBox0: { max }, scale0 } = this.editToolCmd
                            const bx = max.x
                            const by = max.y
                            const bz = max.z

                            const diff = local.sub(local0)
                            const dx = diff.x
                            const dy = diff.y
                            const dz = diff.z

                            const sx = dx / bx + scale0.x
                            const sy = dy / by + scale0.y
                            const sz = dz / bz + scale0.z

                            mesh.scale.set(sx, sy, sz)
                            // let sx = diff.x / max.x
                            // let sy = diff.y / max.y
                            // let sz = diff.z / max.z

                            // const dx = Math.abs(sx)
                            // const dy = Math.abs(sy)
                            // const dz = Math.abs(sz)

                            // const md = Math.max(dx, dy, dz)
                            // let ds = 0
                            // if (md === dx) ds = sx
                            // else if (md === dy) ds = sy
                            // else ds = sz

                            // const mins = 0.1
                            // sx = Math.max(ds + scale0.x, mins)
                            // sy = Math.max(ds + scale0.y, mins)
                            // sz = Math.max(ds + scale0.z, mins)

                            // mesh.scale.set(sx, sy, sz)
                            break
                        }
                        case EditToolMode.rotateEntity.value: {
                            const { scs0, rotation0 } = this.editToolCmd
                            let angle = (scy - scs0.y) / this.wViewHeight * Math.PI

                            const axis = new THREE.Vector3()
                            this.camera.getWorldDirection(axis)
                            axis.transformDirection(matrixWorldInv0)

                            mesh.rotation.copy(rotation0)
                            mesh.rotateOnAxis(axis, angle)
                            break
                        }
                        default: {
                            console.warn('onMouseDrag: unhandled editToolMode', this.editToolMode)
                            break
                        }
                    }

                    editManager.renderViews()
                    break
                }
            case EditToolMode.camerFov.value: {
                const maxFov = 90
                const minFov = 20

                const maxAspect = 4
                const minAspect = 0.2

                // fov (vert)
                const { mainCamera, fov0, aspect0, scs0 } = this.editToolCmd
                const dfov = (scs0.y - scy) / this.viewHeight * maxFov
                const fov = fov0 + dfov
                mainCamera.fov = Math.min(Math.max(minFov, fov), maxFov)

                // aspect (horz)
                const daspect = (scx - scs0.x) / this.viewWidth * maxAspect
                const aspect = aspect0 + daspect
                mainCamera.aspect = Math.min(Math.max(minAspect, aspect), maxAspect)

                // update
                mainCamera.updateProjectionMatrix()
                editManager.mainCameraHelper.update()
                editManager.resetMainViewport()

                editManager.renderViews()
                break
            }
            case EditToolMode.cameraMove.value: {
                const { mainCamera, matrixWorldInv0, position0, local0 } = this.editToolCmd
                const { vcs } = camera_scs2wcs(scx, scy, this.viewWidth, this.viewHeight, this.camera)
                const local = vcs.applyMatrix4(matrixWorldInv0)

                const distance = local0.distanceTo(local)
                const direction = local.sub(local0).normalize()

                mainCamera.position.copy(position0)
                mainCamera.translateOnAxis(direction, distance)

                editManager.renderViews()
                break
            }
            default: {
                console.warn('onMouseDrag: unhandled editToolMode', this.editToolMode)
                break
            }
        }
    }
    onMouseUp = (event) => {
        // console.log('onMouseUp', this.viewType, event)
        this.editToolCmd = null
    }
}