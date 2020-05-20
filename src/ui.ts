import './ui.css'
import {MERCHANT_LIST} from './data.js'

console.log(MERCHANT_LIST);

document.querySelector('#cancel').addEventListener('click', () => {
  parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
})

document.querySelector('.tab-item[data-tab-1]').addEventListener('click', () => {
  openTab('term-card');
})
document.querySelector('.tab-item[data-tab-2]').addEventListener('click', () => {
  openTab('merchant-card');
})
document.querySelector('.tab-item[data-tab-3]').addEventListener('click', () => {
  openTab('cool-stuff');
})

function getInputElement(selector) {
  return(document.querySelector(selector) as HTMLInputElement);
}

document.querySelector('#fill').addEventListener('click', () => {
  const principle = getInputElement('#principle').value;
  const term = getInputElement('#term').value;
  const apr = getInputElement('#apr').value;
  parent.postMessage({ pluginMessage: { type: 'text-change',principle,term,apr } }, '*')
})

document.querySelector('#create').addEventListener('click', () => {
  //Get count of selection
  parent.postMessage({ pluginMessage: { type: 'get-count'} }, '*')
  onmessage = async (event) => {
    //console.log("got this from the plugin code", event.data.pluginMessage)
    const SelectionCount = event.data.pluginMessage;
    console.log(SelectionCount)
    MERCHANT_LIST.sort(() => Math.random() - .5);
    let result = [];
    for (let i = 0; i < SelectionCount ; i++){
      console.log(i);
      result.push({
        name: MERCHANT_LIST[i].Name,
        HeroImage: await getAnImage(MERCHANT_LIST[i].HeroImageURL),
        Logo: await getAnImage(MERCHANT_LIST[i].LogoURL),
      });
    }
    parent.postMessage({ pluginMessage: { type: 'create-rectangles', data: result} }, '*')
  }
})

async function getAnImage(url) {
  console.log(url)
  const r = await fetch(url);
  if((r.status+"")[0] != "2") throw Error ('error')
  const arrayBuffer = await r.arrayBuffer()
  return new Uint8Array(arrayBuffer);
}

function openTab(tabName) {
  var i;
  var x = Array.from(document.querySelectorAll(".tab-page")) as HTMLElement[];
  var y= document.querySelectorAll(".tab-item")
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
    y[i].classList.remove("tab-item-active");
  }
  document.getElementById(tabName).style.display = "block";  
  (event.target as HTMLElement).classList.add("tab-item-active");
}
