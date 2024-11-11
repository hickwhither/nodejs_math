const socket = io.connect('/');

socket.on('connect', () => {
    console.log("Connected");

    changeUsername(username.value);
    username.disabled = false;
    
    setInterval(intervalTimer, 50);
})

socket.on('disconnect', () => {
    console.log("Disconnected");
})

socket.on("updateLeaderboard", c => updateLeaderboard(c))
socket.on("updateQuestion", c => updateQuestion(c))
socket.on("answerStatus", c => answerStatus(c))
socket.on("updateState", c => updateState(c))

