const barsContainer = document.getElementById('bars');
const sizeInput = document.getElementById('size');
const speedInput = document.getElementById('speed');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const generateBtn = document.getElementById('generate');
const algoSelect = document.getElementById('algo');
const customArray = document.getElementById('customArray');

let array = [], originalArray = [], speed = 100, isRunning = false, stopFlag = false;

function randomArray(n){
  const a = [];
  for(let i = 0; i < n; i++) a.push(Math.floor(Math.random() * 100) + 10);
  return a;
}

function renderArray(a){
  barsContainer.innerHTML = '';
  a.forEach(v => {
    const b = document.createElement('div');
    b.className = 'bar';
    b.style.height = v * 3 + 'px';
    barsContainer.appendChild(b);
  });
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

function disableControls(b){
  startBtn.disabled = b;
  generateBtn.disabled = b;
  resetBtn.disabled = b;
  algoSelect.disabled = b;
  customArray.disabled = b;
  sizeInput.disabled = b;
}

async function bubbleSort(){
  const bars = document.querySelectorAll('.bar');
  for(let i = 0; i < array.length - 1; i++){
    for(let j = 0; j < array.length - i - 1; j++){
      if(stopFlag) return;
      bars[j].style.background = '#e91e63';   
      bars[j+1].style.background = '#e91e63';
      await sleep(speed);
      if(array[j] > array[j+1]){
        [array[j],array[j+1]] = [array[j+1],array[j]];
        [bars[j].style.height, bars[j+1].style.height] = [bars[j+1].style.height, bars[j].style.height];
        bars[j].style.background = '#ffeb3b'; 
        bars[j+1].style.background = '#ffeb3b';
      }
      await sleep(speed);
      bars[j].style.background = '#00bcd4';   
      bars[j+1].style.background = '#00bcd4';
    }
    bars[array.length - i - 1].style.background = '#4caf50'; 
  }
  bars[0].style.background = '#4caf50'; 
}

async function insertionSort(){
  const bars = document.querySelectorAll('.bar');
  for(let i = 1; i < array.length; i++){
    if(stopFlag) return;
    let key = array[i], j = i - 1;
    bars[i].style.background = '#e91e63';
    await sleep(speed);
    while(j >= 0 && array[j] > key){
      if(stopFlag) return;
      bars[j].style.background = '#e91e63';
      array[j + 1] = array[j];
      bars[j + 1].style.height = array[j] * 3 + 'px';
      j--;
      await sleep(speed);
    }
    array[j + 1] = key;
    bars[j + 1].style.height = key * 3 + 'px';
    for(let k = 0; k <= i; k++) bars[k].style.background = '#4caf50';
  }
}

async function mergeSort(){
  await mergeSortHelper(array, 0, array.length - 1);
  if(stopFlag) return;
  const bars = document.querySelectorAll('.bar');
  bars.forEach(b => b.style.background = '#4caf50');
}

async function mergeSortHelper(a, l, r){
  if(l >= r || stopFlag) return;
  const m = Math.floor((l + r) / 2);
  await mergeSortHelper(a, l, m);
  await mergeSortHelper(a, m + 1, r);
  await merge(a, l, m, r);
}

async function merge(a, l, m, r){
  const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  const bars = document.querySelectorAll('.bar');
  while(i < L.length && j < R.length){
    if(stopFlag) return;
    bars[l+i].style.background = '#e91e63';   
    bars[m+1+j].style.background = '#e91e63';
    await sleep(speed);
    if(L[i] <= R[j]){
      a[k] = L[i];
      bars[k].style.height = L[i] * 3 + 'px';
      i++;
    } else {
      a[k] = R[j];
      bars[k].style.height = R[j] * 3 + 'px';
      j++;
    }
    bars[k].style.background = '#ffeb3b';  
    k++;
    await sleep(speed);
  }
  while(i < L.length){
    if(stopFlag) return;
    a[k] = L[i];
    bars[k].style.height = L[i] * 3 + 'px';
    i++; k++; await sleep(speed);
  }
  while(j < R.length){
    if(stopFlag) return;
    a[k] = R[j];
    bars[k].style.height = R[j] * 3 + 'px';
    j++; k++; await sleep(speed);
  }
}

generateBtn.onclick = () => {
  array = randomArray(sizeInput.value);
  originalArray = [...array];
  renderArray(array);
};

startBtn.onclick = async () => {
  if(isRunning) return;
  stopFlag = false;
  isRunning = true;
  disableControls(true);
  speed = 220 - speedInput.value;  
  if(algoSelect.value === 'bubble') await bubbleSort();
  else if(algoSelect.value === 'insertion') await insertionSort();
  else await mergeSort();
  disableControls(false);
  isRunning = false;
};

stopBtn.onclick = () => {
  stopFlag = true;
  disableControls(false);
  isRunning = false;
};

resetBtn.onclick = () => {
  stopFlag = true;
  isRunning = false;
  array = [...originalArray];
  renderArray(array);
  const bars = document.querySelectorAll('.bar');
  bars.forEach(b => b.style.background = '#00bcd4');
};

customArray.addEventListener('change', () => {
  const values = customArray.value.split(/[\s,]+/).map(Number).filter(x => !isNaN(x));
  if(values.length){
    array = values;
    originalArray = [...array];
    renderArray(array);
  }
});

sizeInput.oninput = () => {
  if(!isRunning){
    array = randomArray(sizeInput.value);
    originalArray = [...array];
    renderArray(array);
  }
};

array = randomArray(sizeInput.value);
originalArray = [...array];
renderArray(array);
