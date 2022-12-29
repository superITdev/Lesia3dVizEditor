import * as THREE from 'three'

// SCS to NCS(NDC2d)
export const camera_scs2ncs = function () {
    const ncs = new THREE.Vector2()

    return (sx, sy, sw, sh) => {
        const rsw = sw / 2
        const rsh = sh / 2
        ncs.set((sx / rsw) - 1, -(sy / rsh) + 1)

        return ncs
    }
}()

// NCS(NDC2d) to WCS(ray, vcs)
export const camera_ncs2wcs = function () {
    // origin in camera(org) plane behind the near plane:
    const origin = new THREE.Vector3()
    // direction(with normalizing) to near plane: ncs(0,0,-1)
    const direction = new THREE.Vector3()
    // near plane: ncs(x,y,-1)
    const vcs = new THREE.Vector3()

    return (ncs, camera) => {
        if (camera.isPerspectiveCamera) {
            origin.setFromMatrixPosition(camera.matrixWorld)
            // 0.5: direction to near plane?
            direction.set(ncs.x, ncs.y, 0.5).unproject(camera).sub(origin).normalize()
        } else if (camera.isOrthographicCamera) {
            origin.set(ncs.x, ncs.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera)
            direction.set(0, 0, -1).transformDirection(camera.matrixWorld)
        } else {
            console.error('Unsupported camera type:', camera.type)
            return null
        }

        vcs.set(ncs.x, ncs.y, -1).unproject(camera)

        return {
            origin,
            direction,
            vcs,
        }
    }
}()

// SCS to WCS(ray, vcs)
export function camera_scs2wcs(sx, sy, sw, sh, camera) {
    const ncs = camera_scs2ncs(sx, sy, sw, sh)
    return camera_ncs2wcs(ncs, camera)
}