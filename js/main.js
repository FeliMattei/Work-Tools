const alarm = new Audio("assets/sounds/TimerAlarm.mp3");
const finishAlarm = new Audio("assets/sounds/TimerFinished.mp3");
const addedTask = new Audio("https://raw.githubusercontent.com/FeliMattei/test/master/assets/sounds/AddedTask.mp3");
const completedTask = new Audio("assets/sounds/CompletedTask.mp3");
const timerOn = new Audio("assets/sounds/TimerOn.mp3");
const timerOff = new Audio("assets/sounds/TimerOff.mp3");

let isPaused = true;
let isTimerOn = false;
let minsConfig = 30;
let clock;

let tasks = [];

const buttonPlayTimer = document.getElementById("play");

const isValid = (str) => (str != "" && str != null) ? true : false;
const isAudioPaused = (audio) => audio.paused;

const getFromLocalStorage = (key) => localStorage.getItem(key);

const setButtonPlayTimer = (style) => buttonPlayTimer.className = style;
const setOnLocalStorage = (key, value) => localStorage.setItem(key, value);
const setTimer = (boolean) => isTimerOn = boolean;
const setPaused = (boolean) => isPaused = boolean;
const updateTasksLS = () => setOnLocalStorage('tasks', JSON.stringify(tasks));

function loadTimer() {
    const timeSaved = getFromLocalStorage('time');
    const time = timeSaved === null ? 35 : timeSaved;
    document.querySelector('#time').textContent = `${time}:00`;
    minsConfig = time;
}

function loadTasks () {
    if(getFromLocalStorage('tasks')){
        let array = JSON.parse(getFromLocalStorage('tasks'));
        for(let i in array){
            tasks.push(array[i]);

            let li = document.createElement('li');
            let button = document.createElement('input');
            button.type = "button";
            button.addEventListener('click', function(){
                removeTask(this.getAttribute("id"));
                this.parentNode.remove();
                playAudio(completedTask, false);
            });
            button.setAttribute("class","btnremove");
            button.setAttribute("id",tasks[i].id);
            button.value = "-";
            li.appendChild(document.createTextNode(tasks[i].value));
            li.setAttribute("id",i);
            li.appendChild(button);
            
            document.getElementById("task-list").appendChild(li);
        }
    }
}

function configTimer(time){
    setTimer(false);
    clearInterval(clock);
    setButtonPlayTimer("btn timer-buttons fa fa-play");
    setPaused(true);
    minsConfig = Math.max(time,1);
    minsConfig = minsConfig < 10 ? `0${minsConfig}` : minsConfig;
    document.querySelector('#time').textContent = `${minsConfig}:00`;
    setOnLocalStorage('time', minsConfig);
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    clock = setInterval(function () {
        if(!isPaused){
                minutes = parseInt(timer / 60, 10);
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;
            if (--timer < 0) {
                clearInterval(clock);
                setButtonPlayTimer("btn timer-buttons fa fa-stop");
                playAudio(alarm, true);
            }
        }
    }, 1000);
}

function startButton(){
    if(!isTimerOn){
        setTimer(true);
        let time = 60 * minsConfig;
        let display = document.querySelector('#time');
        startTimer(time, display);
    }

    if(isPaused){
        setButtonPlayTimer("btn timer-buttons fa fa-pause");
        setPaused(false);
        playAudio(timerOn, false);
    } else {
        setButtonPlayTimer("btn timer-buttons fa fa-play");
        setPaused(true);
        isAudioPaused(alarm) ? playAudio(timerOff, false) : stopAlarm();
    }
    
}

function removeTask (id) {
    let index = tasks.findIndex(e => e.id == id)
    tasks.splice(index, 1);
    tasks.filter(e => e.id > index).forEach(e => e.id -= 1);

    updateTasksLS();
}

function addTask(str){
    if(isValid(str)){
        let li = document.createElement('li');
        str = str.charAt(0).toUpperCase() + str.slice(1);
        li.appendChild(document.createTextNode(str));
    
        tasks.push({id: tasks.length, value: li.innerHTML});

        updateTasksLS();

        let button = document.createElement('input');
        button.type = "button";
        button.addEventListener('click', function(){
            removeTask(this.getAttribute("id"));
            this.parentNode.remove();
            playAudio(completedTask, false);
        });
        button.setAttribute("class","btnremove");
        button.setAttribute("id",tasks.length-1);
        button.value = "-";
        li.appendChild(button);
        li.setAttribute("id",tasks.length-1);

        document.getElementById("task-list").appendChild(li);
        document.getElementById("task").value = "";

        playAudio(addedTask, false);
    }
}

function stopAlarm(){
    if(!isAudioPaused(alarm)){
        stopAudio(alarm);
        playAudio(finishAlarm, false);
        setTimer(false);
        document.querySelector('#time').textContent = `${minsConfig}:00`;
    }
}

function stopAudio(audio){
    audio.loop = false;
    audio.pause();
}

function playAudio(audio, loop){
    audio.loop = loop;
    audio.currentTime = 0;
    audio.play();
}
