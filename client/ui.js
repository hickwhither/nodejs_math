// document elements
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const leaderboard = document.getElementById("leaderboard");
const username = document.getElementById("username");
const timer = document.getElementById("timer");
const score = document.getElementById("score");
const statusBtn = document.getElementById("statusBtn");

// localUsername
if(!("username" in localStorage)) localStorage.username = 'anonymous';
username.value = localStorage.username

// Methods
const changeUsername = username => {
    socket.emit("changeUsername", username);
    localStorage.username = username;
    console.log(username);
}

// Updates
const updateLeaderboard = data => { // username - score - penalty(second)
    let s = "";
    let players = [];
    for(let i in data) players.push(data[i]);
    players.sort((a, b) => {
        if(a.score==b.score){
            if(a.penalty == b.penalty) return 0;
            if(a.penalty < b.penalty) return -1;
            return 1;
        }
        if(a.score > b.score) return -1;
        return 1;
    })
    players.forEach(player => {
        s += `<div class="leaderboard-item"><span>${player.username}</span><span>${player.score}p</span><span>${player.penalty}</span></div>`;
    });
    leaderboard.innerHTML  = s;
}

const updateQuestion = txt => {
    question.textContent = txt;
    answer.disabled = false;
    answer.value = "";
    statusBtn.textContent = "#";
    statusBtn.style.background = "gray";
    answer.style.color = "black";
    answer.focus();
}

const answerStatus = current_status => {
    // Status button
    if(current_status.answer === "accept"){
        answer.disabled = true;
        statusBtn.textContent = "Accepted! Enter for next question";
        statusBtn.style.background = "green";
        answer.style.color = "green"
    }
    else if(current_status.answer === "wrong"){
        answer.disabled = false;
        statusBtn.textContent = "Wrong answer!";
        statusBtn.style.background = "red";
        answer.style.color = "black"
        answer.focus();
    }

    // score
    if(current_status.score !== undefined) score.textContent = current_status.score;
}

const updateState = status => {
    lastTime = (new Date()).getTime() + status.delta;

    if(status.type == "idle" || status.type == "aftergame"){
        question.textContent = "..."
        answer.disabled = true;
        answer.value = "";
        answer.placeholder = "...";
        score.textContent = "...";

        statusBtn.textContent = "#";
        statusBtn.style.background = "gray";
        answer.style.color = "black";
    }

    if(status.type == "idle"){
        contentTime = "Waiting for players... ";
        timer.textContent = "Waiting for players... ";
    }
    if(status.type=="playing") contentTime = "Game ends in ";
    if(status.type=="aftergame") contentTime = "Restarting in ";
    if(status.type=="interview"){
        contentTime = "Starting in ";
        question.textContent = "...";
        answer.disabled = true;
        answer.value = "";
        answer.placeholder = "Enter when ready";
        score.textContent = "...";

        statusBtn.textContent = "#";
        statusBtn.style.background = "gray";
        answer.style.color = "black";
    }
}

// Events
window.addEventListener("keypress", e => {
    if(e.key === "Enter"){
        e.preventDefault();
        if(answer.disabled) socket.emit("nextQuestion");
        else socket.emit("submitAnswer", answer.value);
    }
})

// Interval
var lastTime = (new Date()).getTime();
var contentTime = "Waiting for next game... ";
const intervalTimer = () => {
    if(contentTime === "Waiting for players... ") return;
    let currentTime = (new Date()).getTime();
    let delta = currentTime - lastTime;
    
    let seconds = Math.abs((delta/1000)).toFixed(2); 
    timer.textContent = `${contentTime}${seconds}s`
}
