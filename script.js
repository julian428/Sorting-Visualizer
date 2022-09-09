let sortId = 'sortVisual';
let sortButtonId = 'sort';
let randomizeId = 'randomize';
let speedSelectorId = 'speed';
let sizeSelectorId = 'size';
let sortSelectorId = 'sortSelect';
let infoNum = {'bubble': 0, 'selection': 1, 'insertion': 2, 'heap': 3, 'quick': 4};
let getId = (id) => document.getElementById(id);
let bars = parseInt(getId(sizeSelectorId).value);
let speed = getId(speedSelectorId).value;
let sortAlgo = getId(sortSelectorId).value;
let oldSortAlgo = sortAlgo;
let unsortedArray = new Array(bars);

window.onload = () => {
    getId(randomizeId).addEventListener('click', () => {
        unsortedArray = array().randomize();
        render().bars();
    });
    getId(sortButtonId).addEventListener('click', () => {
        sort().start();
        render().bars();
    });
    getId(speedSelectorId).addEventListener('input', () => speed = getId(speedSelectorId).value);
    getId(sizeSelectorId).addEventListener('input', () => {
        bars = parseInt(getId(sizeSelectorId).value);
        unsortedArray = new Array(bars)
    });
    getId(sortSelectorId).addEventListener('input', () => {
        oldSortAlgo = sortAlgo;
        sortAlgo = getId(sortSelectorId).value;
        render().info()
    });
    render().info();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function render(){
    const self = {
        bars: (array = unsortedArray) => {
            getId(sortId).innerHTML = "";
            for(i = 0; i < unsortedArray.length; i++){
                let bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.width = 100 / array.length + 'vw';
                bar.style.height = array[i] + "px";
                getId(sortId).appendChild(bar);
            }
        },
        info: (algo = sortAlgo, oldAlgo = oldSortAlgo) => {
            let info = document.getElementsByClassName('info');
            let old = infoNum[oldAlgo];
            let now = infoNum[algo];
            info[old].style.display = 'none';
            info[now].style.display = 'flex';
        }
    }
    return self;
}

function array(){
    const self = {
        randomize: (array = unsortedArray) => {
            for(i = 0; i < array.length; i++){
                array[i] = Math.floor((Math.random()*400)+1)
            }
            return array;
        }
    }
    return self;
}

function sort(){
    const self = {
        start: (sortType = sortAlgo) => {
            switch(sortType){
                case 'bubble':
                    self.bubble();
                    break;
                case 'selection':
                    self.selection();
                    break;
                case 'insertion':
                    self.insertion();
                    break;
                case 'heap':
                    self.heap();
                    break;
                case 'quick':
                    self.quick();
                    break;
                default:
                    self.bubble();
                    break;
            }
        },
        bubble: async (array = unsortedArray) => {
            let bars = document.getElementsByClassName("bar");
            for(let i = 0; i < array.length; i++){
                for(let j = 0; j < (array.length - i - 1); j++)
                {
                    bars[j].style.backgroundColor = "lightgreen";
                    bars[j + 1].style.backgroundColor = "red";
                    await sleep(speed);
                    render().bars();
                    if(array[j] > array[j+1]){
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j+1] = temp;
                        bars[j+1].style.backgroundColor = "lightgreen";
                        bars[j].style.backgroundColor = "red";
                        render().bars();
                        await sleep(speed);
                    }
                }
                render().bars();
            }
        },
        selection: async (array = unsortedArray) => {
            let bars = document.getElementsByClassName("bar");
            for(let i = 0; i < array.length; i++){
                let min = i;
                bars[min].style.backgroundColor = 'red';
                await sleep(speed);
                render().bars()
                for(let j = i+1; j < array.length; j++){
                    if(array[j]<array[min]){
                        min = j;
                        bars[min].style.backgroundColor = 'red';
                        render().bars()
                    }
                    bars[j].style.backgroundColor = 'lightgreen';
                    bars[min].style.backgroundColor = 'red';
                    await sleep(speed);
                    render().bars();
                }
                if(min != i){
                    let temp = array[i];
                    array[i] = array[min];
                    array[min] = temp;
                    bars[min].style.backgroundColor = 'red';
                }
                render().bars();
            }
            render().bars();
        },
        insertion: async (array = unsortedArray) => {
            let bars = document.getElementsByClassName("bar");
            for(let i = 1; i < array.length; i++){
                let current = array[i];
                bars[i].style.backgroundColor = 'red';
                await sleep(speed);
                render().bars();
                let j = i-1;
                while((j > -1) && (current < array[j])){
                    bars[i].style.backgroundColor = 'red';
                    bars[j+1].style.backgroundColor = 'lightgreen';
                    await sleep(speed);
                    render().bars();
                    array[j+1] = array[j];
                    j--;
                }
                array[j+1] = current;
            }
        },
        heap: async (array = unsortedArray) => {
            let bars = document.getElementsByClassName("bar");
            const maxHeapify = (arr, n, i) => {
                let largest = i;
                let l = 2 * i + 1; //left child index
                let r = 2 * i + 2; //right child index
                
                 if (l < n && arr[l] > arr[largest]) {
                       largest = l;
                 }

                 if (r < n && arr[r] > arr[largest]) {
                      largest = r;
                 }

                 if (largest != i) { 
                        let temp = arr[i]; 
                        arr[i] = arr[largest]; 
                        arr[largest] = temp;
                        maxHeapify(arr, n, largest); 
                  } 
              }

                for (let i = parseInt(array.length / 2 - 1); i >= 0; i--) {
                    bars[i].style.backgroundColor = 'red';
                    await sleep(speed);
                    render().bars();
                    maxHeapify(array, array.length, i); 
                }
                for (let i = array.length - 1; i >= 0; i--) {
                    let temp = array[0]; 
                    array[0] = array[i]; 
                    array[i] = temp;
                    bars[i].style.backgroundColor = 'red';
                    await sleep(speed);
                    render().bars();
                    maxHeapify(array, i, 0); 
                }
            render().bars();
        },
        quick: (array = unsortedArray) => {
            console.log(array)
            const self = {
                partitionLow: (arr, low, high) => {
                    let pivot = arr[low];
                    let i = low;

                    for(let j = low; j <= high; j++){
                        if(arr[j] <= pivot){ 
                            let temp = arr[i];
                            arr[i] = arr[j];
                            arr[j] = temp;
                            i++;
                        }
                    }
                
                    let temp = arr[i-1];
                    arr[i-1] = arr[low];
                    arr[low] = temp;
                    
                    return i - 1;
                },
                quicksort: async (arr, low, high) => {
                    let bars = document.getElementsByClassName("bar");
                    if (low >= high) {
                        return;
                    }

                    bars[low].style.backgroundColor = 'red';
                    bars[high].style.backgroundColor = 'lightgreen';
                    await sleep(speed);
                    render().bars();
                    const pivot = self.partitionLow(arr, low, high);

                    self.quicksort(arr, low, pivot - 1);

                    self.quicksort(arr, pivot + 1, high);
                },
            }
            self.quicksort(unsortedArray, 0, unsortedArray.length - 1);
            render().bars()
            return self;
            let low = 0;
            let high = unsortedArray - 1;
            if (low >= high) {
                return;
            }

            //partitionLow
            let pivott = array[low];
            let i = low;

            for(let j = low; j <= high; j++){
                if(array[j] <= pivott){ 
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    i++;
                }
            }
                
            let temp = array[i-1];
            array[i-1] = array[low];
            array[low] = temp;
                    
            let pivot = i-1;
            //partitionLow End

            //quick sort 1
            low = low;
            high = pivot - 1;
            if (low >= high) {
                return;
            }

            //partitionLow
            pivott = array[low];
            i = low;

            for(let j = low; j <= high; j++){
                if(array[j] <= pivott){ 
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    i++;
                }
            }

            temp = array[i-1]
            array[i-1] = array[low];
            array[low] = temp;

            pivot = i - 1
            //partitionLow End

            //quick sort 2
            low = pivot + 1;
            high = high;
            if (low >= high) {
                return;
            }

            //partitionLow
            pivott = array[low];
            i = low;

            for(let j = low; j <= high; j++){
                if(array[j] <= pivott){ 
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                    i++;
                }
            }

            temp = array[i-1]
            array[i-1] = array[low];
            array[low] = temp;

            pivot = i - 1
            //partitionLow End
        }
    }
    return self;
}

