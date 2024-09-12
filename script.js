console.log('TIC TAC TOE');
var origBoard;
const hp='o';
const aip='x';
var option=prompt("Type 1 for playing with simple AI, 2 for playing with unbeatable AI");
const WinnerCombo = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [0,4,8]
];

var cells=document.querySelectorAll('.cell');
StartGame();
let chalk=new Audio();
chalk.src="Chalk.mp3";
function StartGame()
{
    origBoard= Array.from(Array(9).keys());
    console.log(origBoard);
    document.querySelector('.endgame').style.display='none';
    for (var i=0;i<cells.length;i++)
    {
    cells[i].innerText='';
    cells[i].style.removeProperty('color');
    cells[i].addEventListener('click', clicked,false);
    }
}
function clicked(square)
{ 
    if( typeof (origBoard[square.target.id])=='number')
{   
    turn(square.target.id,hp);
    chalk.play();
    if(!checkTie())
    { if(option==='1')
        turn(easySpot(),aip);
        else if(option==='2')
    turn(bestSpot(),aip);
    }
}
}
function easySpot()
{
    return emptySpace()[Math.floor(Math.random()*(emptySpace().length))];
}
function checkTie()
{ 
  if(emptySpace().length==0)
  {
      for(var i=0;i<cells.length;i++)
      {
          cells[i].style.color='coral';
          cells[i].removeEventListener('click',clicked,false);
      }
      declareWinner("TIE GAME!")
      return true;
  }
  return false;
}
function bestSpot()
{
    return minimax(origBoard,aip).index;
}
function emptySpace()
{
    return origBoard.filter(s => typeof(s)=='number');
}
function turn(cellno,player)
{
    origBoard[cellno]=player;
    document.getElementById(cellno).innerText=player;
    let gameWon=WinCheck(origBoard,player);
    if(gameWon)
    gameOver(gameWon);
}
function WinCheck(board,player)                  //Need to know this more
{
    var check=board.reduce((a,e,i)=>
    (e===player) ? a.concat(i):a,[]);
var gameWon=null;
for(let [index,win] of WinnerCombo.entries())
{
    if(win.every(elem=>check.indexOf(elem)>-1))
    {
    gameWon = {index:index,player:player};
        break;
    }
}
return gameWon;
}
function gameOver(gameWon)
{
    for(let index of WinnerCombo[gameWon.index])
    {
        document.getElementById(index).style.color=
        gameWon.player===hp ? '#2e8b57': '#DC143C';
    }
    for(var i=0;i<cells.length;i++)
    {
        cells[i].removeEventListener('click',clicked,false);
    }
        declareWinner(gameWon.player===hp ? "YOU WIN!" : "YOU LOSE!");
}
function declareWinner(winnerStat)
{
    document.querySelector('.endgame').style.display='block';
document.querySelector('.text').innerText=winnerStat;
}
function minimax(curBoard,player)
{
    var availSpots=emptySpace(curBoard);
    if(WinCheck(curBoard,hp))
    return {score:-10};
    else if(WinCheck(curBoard,aip))
    return {score:10};
    else if(availSpots.length==0)
    return {score:0};
    var moves=[];
    for(var i=0;i<availSpots.length;i++)
    {
    var move={};
    move.index=curBoard[availSpots[i]];
    curBoard[availSpots[i]]=player;
    if(player==aip)
    {
    var result=minimax(curBoard,hp);
    move.score=result.score;
    }
    else
    {
        var result=minimax(curBoard,aip);
        move.score=result.score; 
    }
    curBoard[availSpots[i]]=move.index;
    moves.push(move);
    }
    var bestMove;
    if(player===aip)
    {
        var bestScore=-100;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score>bestScore)
            {
            bestScore=moves[i].score;
            bestMove=i;
            }
        }
    }
    else
    {
        var bestScore=100;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score<bestScore)
            {
            bestScore=moves[i].score;
            bestMove=i;
            }
        }
    }
    return moves[bestMove];
}