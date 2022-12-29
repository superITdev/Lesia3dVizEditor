import { Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'

import { BorderThick } from '../common'
import { RenderViewType } from '../manager/renderView'
import RenderView3d from './renderView3d'

const Main3d = () => {
    const editorRef = useRef()
    const renderViewRef = useRef()

    useEffect(() => {
        const renderView = new RenderView3d(editorRef.current, renderViewRef.current, RenderViewType.Perspective)
        renderView.initialize()
        renderView.render()

        return () => {
            renderView.destruct()
        }
    }, [])

    return (
        <div ref={editorRef} style={{
            position: 'relative',
            width: '50%',
            border: `${BorderThick}px solid grey`,
        }}>
            <div ref={renderViewRef} tabIndex={0} style={{
                outline: 'none'
            }} />

            <Typography sx={{
                position: 'absolute',
                zIndex: 100,
                right: 10,
                top: 10,
            }}>{RenderViewType.Perspective}</Typography>
        </div>
    )
}

export default Main3d