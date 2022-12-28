import React, { useEffect, useRef } from 'react'

import { BorderThick } from '../common'
import { RenderViewType } from '../manager/renderView'
import RenderView2d from './renderView2d'

const Editor2d = ({ viewerType = RenderViewType.XY }) => {
  const container = useRef()

  useEffect(() => {
    const renderView = new RenderView2d(container.current, viewerType)
    renderView.initialize()
    renderView.render()

    return () => {
      renderView.destruct()
    }
  }, [viewerType])

  return (
    <div ref={container} tabIndex={0} style={{
      width: '50%',
      border: `${BorderThick}px solid grey`,
      outline: 'none'
    }} />
  )
}

export default Editor2d