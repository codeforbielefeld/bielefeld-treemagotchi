import './app.css'
import App from './App.svelte'
import Map from "./components/Map.svelte"

const app = new Map({
  target: document.getElementById('app'),
})

export default app
