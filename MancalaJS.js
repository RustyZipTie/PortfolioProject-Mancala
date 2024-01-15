const board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];//starts in the lower right, then goes clockwise, ending with your mancala.
let yourTurn = true;
let hard = false;
let disableID = 0; 
const disabler = e=>{
    e.stopPropagation();
    e.preventDefault();
}
refreshUI();
for(const elem of document.querySelectorAll('button')){
    console.log(elem);
    elem.addEventListener('mouseover', ()=>{
        elem.classList.add('active');
    })
    elem.addEventListener('mouseout', ()=>{
        elem.classList.remove('active')
    })
}

function disableEvents(){
    disableID = document.addEventListener('click', disabler, true);
}


function refreshUI(){
    for(let i=0; i<board.length; i++){
        const elem = document.getElementById('d'+i)
        elem.innerHTML = board[i];
        if(i===0||i===1||i===2||i===10||i===11||i===12){
            elem.style.fontWeight = yourTurn ? 'bold' : 'normal';
        }
    }
    document.querySelector('#turn').style.fontWeight = yourTurn ? 'normal' : 'bold';
    const hardBsty = document.getElementById('hard').style;
    const easyBsty = document.getElementById('easy').style;
    
    if(hard){
        hardBsty.color = 'rgb(79, 8, 105)'
        hardBsty.backgroundColor = 'aliceblue';
        hardBsty.border = '1px solid rgb(79, 8, 105)';
        hardBsty.textDecoration =  'none';

        easyBsty.color = 'aliceblue';
        easyBsty.backgroundColor = 'rgb(79, 8, 105)';
        easyBsty.border = 'none';
        easyBsty.textDecoration = 'underline';
    }else{
        hardBsty.color = 'aliceblue';
        hardBsty.backgroundColor = 'rgb(79, 8, 105)';
        hardBsty.border = 'none';
        hardBsty.textDecoration = 'underline';

        easyBsty.color = 'rgb(79, 8, 105)'
        easyBsty.backgroundColor = 'aliceblue';
        easyBsty.border = '1px solid rgb(79, 8, 105)';
        easyBsty.textDecoration =  'none';
    }
    document.getElementById('turn').innerHTML = yourTurn ? 'Your turn!' : 'Play- opponent';
}
function youPlay(place){
    if(yourTurn){
        refreshUI();
        if(play(place)){
            alert('You get to play again!');
        }
        refreshUI();
    }else{
        alert('It\'s not your turn. \nClick "Play- opponent" below to let the opponent make it\'s move.')
    }
}
function oppPlay(){
    console.log('In oppPlay()');
    let place = decideOppMove();
    if(!yourTurn){
        console.log("!yourturn");
        
        refreshUI();
        if(play(place)){
            console.log('played. playagain is true');
            alert('Opponent gets to play again.');
        }else{console.log('played. playagain is false');}
        refreshUI();
    }else{
        alert('It\'s your turn. \nClick one of the underlined numbers on the lower half of the board to make your move.');
        console.log('yourturn');
    }
}
function play(startPlace, playBoard = board, real = true){
    
    let playAgain = false;
    if(playBoard[startPlace]>0){
        //take stones from place and put in hand
        let hand = {
            stones:playBoard[startPlace], 
            place:startPlace,
            move(){
                this.place = this.place<13 ? this.place+1 : 0;
            }
        };
        playBoard[hand.place] = 0;
            
        while(true){
            

            while(hand.stones>0){
                hand.move();
                if((yourTurn && hand.place!==6)||(!yourTurn && hand.place!==13)){
                    hand.stones--;
                playBoard[hand.place]++;
                }
            }
            
            if((yourTurn&&hand.place===13)||(!yourTurn&&hand.place===6)){
                //if the current player ends their turn in their own mancala, 
                //turn ends and they get to play again.
                playAgain=true;
                break;
            }else if((!yourTurn&&hand.place===13)||(yourTurn&&hand.place===6)){
                //if the current player ends in the other's mancala, turn ends.
                break;
            }else if(playBoard[hand.place]===1){
                //if the turn ends in an empty place (and therefore, 
                //the place now has one stone), turn ends.
                break;
            }else{
                //if the turn ends in a place that already has stones in it, 
                //all stones are transferred to hand, and the proscess starts over.
                hand.stones = playBoard[hand.place];
                playBoard[hand.place] = 0;
            }

        }
        //check for a winner and refresh numbers
        checkDone();
        refreshUI();
    }else{
        playAgain=true;
        alert('You clicked on a place with no stones. \nPlease choose a different place.');
    }
    
    if(!playAgain && real){
        yourTurn = !yourTurn;
    }
    return playAgain;
}

function checkDone(){
    let yourPlaces = board[0]+board[1]+board[2]+board[10]+board[11]+board[12];
    let oppPlaces = board[3]+board[4]+board[5]+board[7]+board[8]+board[9];
    if(yourPlaces === 0 || oppPlaces === 0){
        if((board[6] + oppPlaces)===(board[13] + yourPlaces)){
            alert('Game over. Tied!');
        }else if((board[6] + oppPlaces)>(board[13] + yourPlaces)){
            alert('Game over. Opponent won.');
        }else if((board[6] + oppPlaces)<(board[13] + yourPlaces)){
            alert('Game over. You won!');
        }
        reset();
    }

}
function reset(){
    board[0]= 4;
    board[1]= 4;
    board[2]= 4;
    board[3]= 4;
    board[4]= 4;
    board[5]= 4;
    board[6]= 0;
    board[7]= 4;
    board[8]= 4;
    board[9]= 4;
    board[10]= 4;
    board[11]= 4;
    board[12]= 4;
    board[13]= 0;
    yourTurn = true;
    refreshUI();
}

//smart opponent
class Attempt{
    constructor(place, benefit){
        this.place = place;
        this.benefit = benefit;
    }
}
function decideOppMove(){
    let place = -1;
    if(hard){
        const attempts = []
        for(let i = 3; i<=9; i++){
            if(i !== 6 && board[i] !== 0){
                const vBoard = [...board];
                const oldScore = board[6];
                let benefit = 0;
                if(play(i,vBoard, false)){
                    benefit += 4;
                }
                benefit += (vBoard[6]-oldScore);
                attempts.push(new Attempt(i, benefit));
            }
        }
        const sortedAttempts = attempts.sort((a,b)=>b.benefit-a.benefit);
        console.log(sortedAttempts);
        place = sortedAttempts[0].place;
    }else{
        do{
            place = (Math.floor(Math.random()*7))+3;
        }while(place === 6 || board[place]<1);
    }
    
    return place;
}