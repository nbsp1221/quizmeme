import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

// PWA registration will be added when the plugin is properly configured
// import { registerSW } from 'virtual:pwa-register'
// const updateSW = registerSW({
//   onNeedRefresh() {
//     if (confirm('New content available. Reload?')) {
//       updateSW(true)
//     }
//   },
//   onOfflineReady() {
//     console.log('App ready to work offline')
//   },
// })

render(<App />, document.getElementById('app')!)
