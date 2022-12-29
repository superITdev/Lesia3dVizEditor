import { Stack } from '@mui/material'
import { useEffect } from 'react'
import './App.scss'
import Editor2d from './component/editor2d'
import Main3d from './component/main3d'
import { editManager } from './component/manager/editManager'
import { RenderViewType } from './component/manager/renderView'

function App() {
  useEffect(() => {
    editManager.fullSizeMain3d(true)
  }, [])
  return (
    <Stack direction='row' flexWrap='wrap'>
      <Main3d />
      <Editor2d viewType={RenderViewType.XY} />
      <Editor2d viewType={RenderViewType.YZ} />
      <Editor2d viewType={RenderViewType.ZX} />
    </Stack>
  )
}

export default App
