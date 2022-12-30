import * as THREE from 'three'

export default class MainCamera extends THREE.PerspectiveCamera {
    setViewport(viewW, viewH) {
        const aspect = viewW / viewH
    }
}