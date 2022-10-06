const { getGames } = require("epic-free-games");
const URLtoBuffer = require("./images.js")
const rwClient = require('./bot.js');
const fs = require("fs");
let gamesList = {currentGames: [], nextGames: []};

const tweet = async (title, image, soon)=>{
    try{
        URLtoBuffer(image, async (buffer)=>{
            console.log(buffer);
            //upload image before tweeting
            const mediaIds = await Promise.all([
                rwClient.v1.uploadMedia(buffer, { mimeType: 'image/png' }),
            ]);
            await rwClient.v1.tweet( //set tweet content depending on game state
                (soon ? "[SOON] " : "[RIGHT NOW] ") +
                title +
                (soon ? "\nwill soon be available to collect for free from the Epic Games Store":
                "\navailable to collect for free from the Epic Games Store"), { media_ids: mediaIds });
        });
    }catch(e){
        console.log(e);
    }
}

//load previous update state from file
let epicgamesJSON = fs.readFileSync("./json/epicgames.json");
if(epicgamesJSON.length > 0) gamesList = JSON.parse(epicgamesJSON);

let update = function(){
    //epic-free-games call
    getGames("PL", true).then(res => {
        if(JSON.stringify(res) != JSON.stringify(gamesList)){
    
            let gamesPosted = new Map(); //hashmap
            gamesList.currentGames.concat(gamesList.nextGames).forEach(game => {
                gamesPosted.set(game.title, game);
            });
            
            res.currentGames.forEach(game => {
                if(gamesPosted.has(game.title)){
                    console.log(game.title, "already posted");
                }else{
                    console.log(game.title, "Post needed");
                    tweet(game.title, game.keyImages[game.keyImages.length-1].url, false);
                }
            });
    
            res.nextGames.forEach(game => {
                if(gamesPosted.has(game.title)){
                    console.log(game.title, "already posted");
                }else{
                    console.log(game.title, "Post needed");
                    tweet(game.title, game.keyImages[game.keyImages.length-1].url, true);
                }
            });
            //save update state
            fs.writeFileSync("./json/epicgames.json", JSON.stringify(res));
            gamesList = res;
        }else{
            console.log("We're up to date!");
        }
    });
}

let updateInterval = setInterval(update, 60*60*1000); //1 hour in miliseconds