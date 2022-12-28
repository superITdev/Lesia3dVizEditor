import React, { useEffect, useRef } from 'react'

import { BorderThick } from '../common'
import { RenderViewType } from '../manager/renderView'
import RenderView3d from './renderView3d'

const Main3d = () => {
    const container = useRef()

    useEffect(() => {
        const renderView = new RenderView3d(container.current, RenderViewType.Perspective)
        renderView.initialize()
        renderView.render()

        return () => {
            renderView.destruct()
        }
    }, [])

    return (
        <div ref={container} tabIndex={0} style={{
            width: '50%',
            border: `${BorderThick}px solid grey`,
            outline: 'none'
        }} />
    )
}

export default Main3d