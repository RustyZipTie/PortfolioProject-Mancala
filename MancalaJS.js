const right = [4, 4, 4, 4, 4, 4];
const left = [4, 4, 4, 4, 4, 4];
let yourMancala = 0;
let oppMancala = 0;

function refreshUI(){
    document.getElementById('you').innerHTML = yourMancala;
    document.getElementById('opp').innerHTML = yourMancala;
}
refreshUI();