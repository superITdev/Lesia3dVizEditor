import { Stack } from '@mui/material'
import './App.scss'
import Editor2d from './component/editor2d'
import Main3d from './component/main3d'
import { RenderViewType } from './component/manager/renderView'

function App() {
  return (
    <Stack direction='row' flexWrap='wrap'>
      <Main3d />
      <Editor2d viewerType={RenderViewType.XY} />
      <Editor2d viewerType={RenderViewType.YZ} />
      <Editor2d viewerType={RenderViewType.ZX} />
    </Stack>
  )
}

export default App
