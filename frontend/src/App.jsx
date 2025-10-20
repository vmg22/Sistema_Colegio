import './styles/index.css'
import "../src/App.css"
import Navv from './components/layout/Navv'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'


function App() {

  return (
    <>
      <Navv/>
      {/* <ButtonShowcase/> */}
      <Dashboard/>
    
      
    </>
  );
}

export default App