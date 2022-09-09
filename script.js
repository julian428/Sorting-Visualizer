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
    render().info();
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
                    self.insertion()
                    break;
                case 'heap':
                    window.alert('To jeszcze nie dziala')
                    //self.heap()
                    break;
                case 'quick':
                    window.alert('To jeszcze nie dziala')
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
        heap: (array = unsortedArray) => {
            let parentIndex = (index) => Math.floor((index-1)/2);
            let leftChildIndex = (index) => 2*index+1;
            let rightChildIndex = (index) => 2*index+2;
            let swap = (a, b) => {
                let temp = array[a];
                array[a] = array[b];
                array[b] = temp;
            }

            let insert = (item) => {
                array.push(item);
                let index = array.length - 1;
                let parent = parentIndex(index);
                while(array[parent] && array[parent] < array[index]){
                    swap(parent, index);
                    index = parentIndex(index);
                    parent = parentIndex(index);
                }
            }

            let del = () => {
                let item = array.shift();
                array.unshift(array.pop());
                let index = 0;
                let leftChild = leftChildIndex(index);
                let rightChild = rightChildIndex(index);
                while(array[leftChild] && array[leftChild] > array[index] || array[rightChild] > array[index]){
                    let max = leftChild;
                    if(array[rightChild] && array[rightChild] > array[max]) max = rightChild;
                    swap(max, index);
                    index = max;
                    leftChild = leftChildIndex(max);
                    rightChild = rightChildIndex(max);
                }
                return item;
            }

            let sorted = [];
            for(let i = 0; i < array.length; i++)   insert(array[i]);
            for(let i = 0; i < array.length; i++)   sorted.push(del());
            render().bars(sorted);
        }
    }
    return self;
}

