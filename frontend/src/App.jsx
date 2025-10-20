import './styles/index.css'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'
import Header from './components/layout/Header'


function App() {

  return (
    <>
      <Header />
      
      <ButtonShowcase/>
      <Dashboard/>

      <h1>hola matias</h1>
      
    </>
  );
}

export default App