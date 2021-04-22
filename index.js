const fs = require('fs');
const Parser = require("./lib/Parser");


fs.readFile('games.log', (err, logData)=>{//Abrir o log usando File System(fs)
    if(err) {
        console.log(err);//Exibir erro no console
    }
    let myParser = new Parser();
    let textoQuakeLog = logData.toString();//Atribuição do log para uma variavel string
    let partidas = myParser.parse(textoQuakeLog);//Call do parser com o log de parametro


    partidas.forEach((game) => {
        let ranking = [];
        const { kills } = game.game;
    
      });
    });
    
      