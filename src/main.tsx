import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {app, analytics} from './firebase.js'
import './index.css'

console.log("Firebase App:", app);
console.log("Firebase Analytics:", analytics);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
