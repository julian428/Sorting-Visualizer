let sortId = 'sortVisual';
let sortButtonId = 'sort';
let randomizeId = 'randomize';
let speedSelectorId = 'speed';
let sizeSelectorId = 'size';
let sortSelectorId = 'sortSelect';
let getId = (id) => document.getElementById(id);
let bars = parseInt(getId(sizeSelectorId).value);
let speed = getId(speedSelectorId).value;
let sortAlgo = getId(sortSelectorId).value;
let unsortedArray = new Array(bars);

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
                bar.style.width = 90 / array.length + 'vw';
                bar.style.height = array[i] + "px";
                bar.style.color = 'black'
                getId(sortId).appendChild(bar);
            }
        }
    }
    return self;
}

function array(){
    const self = {
        randomize: (array = unsortedArray) => {
            for(i = 0; i < array.length; i++){
                array[i] = Math.floor((Math.random()*500)+1)
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
                    if(array[j] > array[j+1]){
                        let temp = array[j];
                        array[j] = array[j + 1];
                        array[j+1] = temp;
                        bars[j].style.backgroundColor = "lightgreen";
                        bars[j + 1].style.backgroundColor = "red";
                        await sleep(speed);
                        render().bars();
                    }
                    bars[j].style.backgroundColor = "var(--comp)";
                    bars[j + 1].style.backgroundColor = "var(--comp)";
                }
                await sleep(speed);
                render().bars();
            }
            return array;
        }
    }
    return self;
}


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
}