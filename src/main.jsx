import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AtendimentoProvider } from './context/AtendimentoContext'
import App from './App'
import './styles/index.css'
import './styles/App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AtendimentoProvider>
        <App />
      </AtendimentoProvider>
    </BrowserRouter>
  </React.StrictMode>
)