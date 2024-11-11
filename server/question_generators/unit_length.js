
const units = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'];

module.exports = () => {
    let a = Math.floor(Math.random()*6);
    let b = Math.floor(Math.random()*6);
    if(a>b) b = [a, a = b][0];
    let anum = Math.floor(Math.random()*100)+1;
    let bnum = anum * Math.pow(10, b-a);

    if(Math.floor(Math.random()*2))
        return {
            question: `${bnum}${units[a]} = ?${units[b]}`,
            answer: anum
        }
    return {
        question: `${anum}${units[b]} = ?${units[a]}`,
        answer: bnum
    }
}