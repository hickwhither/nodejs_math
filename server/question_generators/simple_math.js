
const ops = ['+', '-', '*'];

module.exports = () => {
    let a = Math.floor(Math.random()*100);
    let b = Math.floor(Math.random()*100);
    let op = Math.floor(Math.random())*3;
    let answer;
    if(op==0){
        op = '+';
        answer = a+b;
    }else if(op==1){
        op = '-';
        answer = a-b;
    }else{
        op = '*';
        answer = a*b;
    }
    return {
        question: `${a} ${op} ${b}`,
        answer: answer
    }
}