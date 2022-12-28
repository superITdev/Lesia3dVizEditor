import React, { useEffect, useRef } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import CameraFovIcon from '@mui/icons-material/AspectRatio'
import CameraMoveIcon from '@mui/icons-material/EmergencyRecordingOutlined'
import TranslateIcon from '@mui/icons-material/PanToolOutlined'
import RotateIcon from '@mui/icons-material/Loop'
import ScaleIcon from '@mui/icons-material/ZoomOutMap'

import { BorderThick, ToolPadding, ToolZIndex } from '../common'
import { RenderViewType } from '../manager/renderView'
import RenderView2d from './renderView2d'

const CUI = {
  ToggleButtonGroup: {
    orientation: "vertical",
    size: "small",
    exclusive: true
  }
}

const Editor2d = ({ viewerType = RenderViewType.XY }) => {
  const renderViewRef = useRef()
  const [editMode, setEditMoe] = React.useState('')

  const onEditMode = (event, nextView) => {
    setEditMoe(nextView)
  }

  useEffect(() => {
    const renderView = new RenderView2d(renderViewRef.current, viewerType)
    renderView.initialize()
    renderView.render()

    return () => {
      renderView.destruct()
    }
  }, [viewerType])

  return (
    <div style={{
      position: 'relative',
      width: '50%',
      border: `${BorderThick}px solid grey`,
    }}>
      <div ref={renderViewRef} tabIndex={0} style={{
        outline: 'none'
      }} />

      <Typography sx={{
        position: 'absolute',
        zIndex: ToolZIndex,
        right: ToolPadding,
        top: ToolPadding,
      }}>{viewerType}</Typography>

      <Stack spacing={1} sx={{
        position: 'absolute',
        zIndex: ToolZIndex,
        left: ToolPadding,
        top: ToolPadding,
      }}>
        <ToggleButtonGroup {...CUI.ToggleButtonGroup} value={editMode} onChange={onEditMode}>
          <ToggleButton value="translateEntity" title='Translate cube' placement='left'>
            <TranslateIcon />
          </ToggleButton>
          <ToggleButton value="scaleEntity" title='Scale cube'>
            <ScaleIcon />
          </ToggleButton>
          <ToggleButton value="rotateEntity" title='Rotate cube'>
            <RotateIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup {...CUI.ToggleButtonGroup} value={editMode} onChange={onEditMode}>
          <ToggleButton value="camerFov" title='Change camera viewing angle'>
            <CameraFovIcon />
          </ToggleButton>
          <ToggleButton value="cameraMove" title='Move camera'>
            <CameraMoveIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </div>
  )
}

export default Editor2d