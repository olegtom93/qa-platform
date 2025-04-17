import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import AuthForm from './components/AuthForm'

const App = () => (
  <div>
    <h1>Добро пожаловать в QA-платформу</h1>
    <AuthForm />
  </div>
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
