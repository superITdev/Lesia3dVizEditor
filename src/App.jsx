import { Stack } from '@mui/material';
import './App.scss';
import MainScene from './component/mainScene';

function App() {
  return (
    <Stack direction='row' flexWrap='wrap'>
      <MainScene />
      <MainScene />
      <MainScene />
      <MainScene />
    </Stack>
  );
}

export default App;
