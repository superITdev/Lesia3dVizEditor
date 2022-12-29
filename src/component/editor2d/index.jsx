import React, { useEffect, useRef } from 'react'
import { Stack, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material'
import CameraFovIcon from '@mui/icons-material/AspectRatio'
import CameraMoveIcon from '@mui/icons-material/EmergencyRecordingOutlined'
import TranslateIcon from '@mui/icons-material/PanToolOutlined'
import RotateIcon from '@mui/icons-material/Loop'
import ScaleIcon from '@mui/icons-material/ZoomOutMap'

import { BorderThick, EditToolMode, ToolPadding, ToolZIndex } from '../common'
import { RenderViewType } from '../manager/renderView'
import RenderView2d from './renderView2d'
import { editManager } from '../manager/editManager'

const CUI = {
  ToggleButtonGroup: {
    orientation: "vertical",
    size: "small",
    exclusive: true
  }
}

const Editor2d = ({ viewType = RenderViewType.XY }) => {
  const editorRef = useRef()
  const renderViewRef = useRef()

  const [editMode, setEditMode] = React.useState('')

  const onEditToolMode = (_, value) => {
    setEditMode(value)

    const thisView = editManager.getView(viewType)
    thisView.changeEditToolMode(value)
  }

  useEffect(() => {
    const renderView = new RenderView2d(editorRef.current, renderViewRef.current, viewType)
    renderView.initialize()
    renderView.render()

    return () => {
      renderView.destruct()
    }
  }, [viewType])

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
        zIndex: ToolZIndex,
        right: ToolPadding,
        top: ToolPadding,
      }}>{viewType}</Typography>

      <Stack spacing={1} sx={{
        position: 'absolute',
        zIndex: ToolZIndex,
        left: ToolPadding,
        top: ToolPadding,
      }}>
        <ToggleButtonGroup {...CUI.ToggleButtonGroup} value={editMode} onChange={onEditToolMode}>
          <ToggleButton {...EditToolMode.translateEntity}>
            <TranslateIcon />
          </ToggleButton>
          <ToggleButton {...EditToolMode.scaleEntity}>
            <ScaleIcon />
          </ToggleButton>
          <ToggleButton {...EditToolMode.rotateEntity}>
            <RotateIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup {...CUI.ToggleButtonGroup} value={editMode} onChange={onEditToolMode}>
          <ToggleButton {...EditToolMode.camerFov}>
            <CameraFovIcon />
          </ToggleButton>
          <ToggleButton {...EditToolMode.cameraMove}>
            <CameraMoveIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </div>
  )
}

export default Editor2d