
generators = [require("./question_generators/simple_math"), require("./question_generators/unit_length")]

module.exports = class Game {
    constructor(io){
        this.io = io
        this.status = "idle" // idle, interview, playing, aftergame
        this.timer = (new Date()).getTime();
        this.PLAYERS_ID = [];
        this.PLAYERS = {}
        this.SOCKETS = {};
        setInterval(this.interval, 100);
    }


    interval = () => {
        let current_time = (new Date()).getTime();
        if(this.status == "idle"){
            if(this.PLAYERS_ID.length>=2){ // countdown start in 10s
                this.status = "interview";
                this.timer = (new Date()).getTime() + 5*1000;
                this.updateState();
            }
        }
        else if(this.status == "interview"){
            if(this.PLAYERS_ID.length<=1){ // cancel
                this.status = "idle";
                this.timer = (new Date()).getTime();
                this.updateState();
            }else if(current_time > this.timer){ // starting
                this.status = "playing"
                this.timer = (new Date()).getTime() + 180*1000;
                this.updateState();
                this.startGame();
            }
        }
        else if(this.status == "playing"){
            if(current_time > this.timer){ // countdown restart in 5s
                this.status = "aftergame";
                this.timer = (new Date()).getTime() + 5*1000;
                this.updateState();
            }
        }
        else if(this.status == "aftergame"){
            if(current_time > this.timer){ // restart game
                this.status = "idle";
                this.timer = (new Date()).getTime();
                this.updateState();
            }
        }
        this.updateLeaderboard();
    }

    updateState = () => this.io.emit("updateState", {
        delta: this.timer - (new Date()).getTime(),
        type: this.status
    });

    updateLeaderboard = () => this.io.emit("updateLeaderboard", this.PLAYERS);

    startGame = () => {
        this.questions = [];
        for(let i in this.PLAYERS){
            this.PLAYERS[i].score = 0;
            this.PLAYERS[i].isAccept = true;
            this.PLAYERS[i].penalty = 0;
        }
    }

    on_connect = (id, socket) => {
        this.SOCKETS[id] = socket
        this.PLAYERS_ID.push(id);
        this.PLAYERS[id] = {
            username: "anonymous",
            score: 0,
            isAccept: true,
            penalty: 0
        }
        this.SOCKETS[id].emit("updateState", {
            delta: this.timer - (new Date()).getTime(),
            type: this.status
        })
    }

    on_disconnect = (id) => {
        let index = this.PLAYERS_ID.indexOf(id);
        if (index!==-1) this.PLAYERS_ID.splice(index, 1);

        delete this.SOCKETS[id];
        if(id in this.PLAYERS) delete this.PLAYERS[id];
    }

    on_nextQuestion = (id) => {
        if(this.status !== "playing") return;
        if(this.PLAYERS[id].isAccept === false) return;
        this.PLAYERS[id].isAccept = false;
        console.log(id, "Next question!");
        let question = this.getQuestion(this.PLAYERS[id].score);
        this.SOCKETS[id].emit("updateQuestion", question)
    }

    on_submitAnswer = (id, answer) => {
        if(this.status !== "playing") return;
        if(this.PLAYERS[id].isAccept === true) return;
        console.log(id, "Submit problem!");
        if(this.checkAnswer(this.PLAYERS[id].score, answer)){
            this.PLAYERS[id].isAccept = true;
            this.PLAYERS[id].score += 1;
            console.log(id, "Correct!");
            this.SOCKETS[id].emit("answerStatus", {
                answer: "accept",
                score: this.PLAYERS[id].score
            })
        }else{
            console.log(id, "Wrong!");
            this.SOCKETS[id].emit("answerStatus", {
                answer: "wrong",
                score: this.PLAYERS[id].score
            })
        }
    }

    on_changeUsername = (id, username) =>{
        this.PLAYERS[id].username = username
        console.log(id, `new username! ${username}`);
    }

    checkAnswer = (i, answer) => {
        answer = answer.replace(/ /g,'');
        return this.questions[i].answer == answer;
    }

    getQuestion = (i) => {
        while(i >= this.questions.length){
            let new_question = generators[Math.floor(Math.random()*generators.length)]();
            this.questions.push(new_question);
        }
        return this.questions[i].question;
    }

}