const board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];//starts in the lower left, then goes clockwise, ending with your mancala.

let yourTurn = true;
function refreshUI(){
    for(let i=0; i<board.length; i++){
        document.getElementById('d'+i).innerHTML = board[i];
    }
    document.getElementById('turn').innerHTML = yourTurn ? 'Your turn!' : 'Play- opponent';
}
function youPlay(place){
    if(yourTurn){
        refreshUI();
        yourTurn = false;
        if(play(place)){
            yourTurn = true;
            alert('You get to play again!');
        }
        refreshUI();
        
        
    }else{
        alert('It\'s not your turn. \nClick "Play- opponent" below to let the opponent make it\'s move.')
    }
}
function oppPlay(){
    let place = 0;
    do{
        place = (Math.floor(Math.random()*7))+3;
    }while(place === 6 || board[place]<1);
    if(!yourTurn){
        refreshUI();
        yourTurn = true;
        if(play(place)){
            yourTurn = false;
            alert('Opponent gets to play again.');
        }
        refreshUI();
        
        
    }else{
        alert('It\'s your turn. \nClick one of the underlined numbers on the lower half of the board to make your move.');
    }
}
function play(startPlace, playBoard = board){
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
                hand.stones--;
                playBoard[hand.place]++;
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

refreshUI();