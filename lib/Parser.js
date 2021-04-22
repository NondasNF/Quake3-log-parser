const Parser = function(){}

var globalGameCount = 0;
Parser.prototype.parse = (text) => {
    let initGames = [];//Declarado o array initGame
    let linhas = text.split('\n');//Divide em um array cada linha em um espaço
    var gameIniciado = false;
    var playerList=[];
    var killCount=0;
    var game={
      players:[],
      kills:[]
    }
    var killreason={
      meansOfDeath:[],
      killNum:[]
    }
    linhas.forEach( (linha) => {//percorrer o array executando o código abaixo
        let arrayAtualLinha = linha.trim().split(' ');  
        let initGameTexto = 'InitGame:';
        let endGame = '------------------------------------------------------------';
        let getPlayerTexto  = 'ClientUserinfoChanged:';
        let getKillTexto = 'Kill:';
        //Variaveis marcadores
        for (let i = 6; i < arrayAtualLinha.length; i ++) {
          if(arrayAtualLinha[i]==='by') {
            arrayAtualLinha[i+1]
            if(killreason.meansOfDeath.indexOf(arrayAtualLinha[i+1])===-1){
              killreason.meansOfDeath.push(arrayAtualLinha[i+1]);
            }else{
              let aux = killreason.meansOfDeath.indexOf(arrayAtualLinha[i+1]);
              killreason.killNum[aux]+=1;
            }
          }
        }
        if(arrayAtualLinha[1]===initGameTexto){//Reseta o objeto "Game" para o proximo game
            if ( game.kills.length > -1) {
              game.kills.splice(0, game.kills.length);
            }
            if(game.players.length> -1){
              game.players.splice(0, game.players.length);
            }
            if(playerList.length> -1){
              playerList.splice(0, playerList.length);
            }
            gameIniciado = true;
            killCount=0;
        }
        if(gameIniciado){
          if(arrayAtualLinha[1]===getPlayerTexto){//entrada de dados dos nicks dos players
            let startIndex = linha.indexOf('n\\');//Inicio do nickname na linha
            let endIndex = linha.indexOf('\\t') - 1;//Fim do nickname na linha
            let charNumber = endIndex - startIndex;// Armazena a quantidade de caracteres
            let playerNick = linha.trim().substr(startIndex, charNumber);//Armazena o nickname
            playerNick = playerNick.replace(/\\/g,'');//corrige a formatação removendo '//' dos nicks
            if(playerList.indexOf(playerNick)===-1){//pesquisa no array se o nickname já existe
              playerList.push(playerNick);//atualiza o array com novo player
              game.players.push(playerNick);
              game.kills.push(0);
            }
          }
          if(arrayAtualLinha[1]===getKillTexto){
            killCount++;
            if(arrayAtualLinha.indexOf('<world>')!== -1){//se for morte pelo mundo
              let killedBegin = arrayAtualLinha.indexOf('killed');
              let killed = arrayAtualLinha[killedBegin + 1];
              for (let i = killedBegin + 2; i < arrayAtualLinha.length; i ++) {
                if (arrayAtualLinha[i] === 'by') {
                  break;
                }
              killed += ' ' + arrayAtualLinha[i];
              }
              game.kills[game.players.indexOf(killed)]=game.kills[game.players.indexOf(killed)]-1;
              if(game.kills[game.players.indexOf(killed)]<0){
                game.kills[game.players.indexOf(killed)]=0
              }
            }else{ //se não mundo apenas outro player
              let killer = arrayAtualLinha[5];
              for (let i = 6; i < arrayAtualLinha.length; i ++) {
                if (arrayAtualLinha[i] === 'killed') {
                  break;
                }
                killer += ' ' + arrayAtualLinha[i];
              }
              let killerIndex = game.players.indexOf(killer);
              game.kills[killerIndex]=game.kills[killerIndex] + 1;
            }
          }
          if(arrayAtualLinha[1]===endGame){//Imprime o conteudo do Array
            globalGameCount++;
            console.log('game_' + globalGameCount+': {');
            console.log('     total_kills: ' + killCount+';');
            console.log('     players: ['+ playerList+']');
            console.log('     kills: {')
            for(let j=0; j<game.players.length; j++)
              console.log('     "'+game.players[j]+'": '+ game.kills[j]);
            console.log('     }\n}');
            rankingArray(game.players, game.kills);
            console.log('// means of death{')
            for(let j=0; j<killreason.meansOfDeath.length; j++){
            console.log('     "'+killreason.meansOfDeath[j]+'": '+killreason.killNum[j]);}
            console.log('}')
            console.log('> - - - - - - - - - - - - - - - - - - - - - - - - <');
            gameIniciado = false;    
          }
        }
    })
    return initGames;
}
function rankingArray(texto, numeros){
  var ordenaString = []
  var ordenaNum = numeros.slice();
  ordenaNum = ordenaNum .sort((a,b) => b-a);
  for(let j=0; j<ordenaNum.length; j++){
      let tempNum = numeros.indexOf(ordenaNum[j]);
      //console.log(texto, numeros);
      ordenaString.push(texto[tempNum]);
      numeros.splice(tempNum, 1);
      texto.splice(tempNum, 1);
  }
  console.log('ranking_de_kills: {')
  for(let j=0; j<ordenaNum.length; j++){
      console.log('     "'+ordenaString[j]+'": '+ ordenaNum[j])
  }
  console.log("}")
  return 0
}
module.exports = Parser;