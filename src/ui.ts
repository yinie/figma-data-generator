import './ui.css'
import {MERCHANT_LIST} from './data.js'

console.log(MERCHANT_LIST);

document.getElementById('create').onclick = () => {
  const textbox = document.getElementById('count') as HTMLInputElement
  const count = parseInt(textbox.value, 10)
  parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
}
