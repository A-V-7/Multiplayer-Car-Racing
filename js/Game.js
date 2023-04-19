class Game {
  constructor() {
    this.reset = createButton("");
    this.leaderboard = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width/2-100,height-100);
    car1.addImage("car",c1);
    car1.addImage("boom",boom);
    car1.scale = 0.07;

    car2 = createSprite(width/2+100,height-100);
    car2.addImage("car",c2);
    car2.addImage("boom",boom);
    car2.scale = 0.07;

    cars = [car1,car2];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    this.addSprites(fuels,4,fuel,0.02);
    this.addSprites(coins,20,coin,0.09);

    var obstaclePositions = [
      {x: width/2+250, y: height-800, image: ob2},
      {x: width/2-150, y: height-1300, image: ob1},
      {x: width/2+250, y: height-1800, image: ob1},
      {x: width/2-180, y: height-2300, image: ob2},
      {x: width/2, y: height-2800, image: ob2},
      {x: width/2-180, y: height-3300, image: ob1},
      {x: width/2+180, y: height-3300, image: ob2},
      {x: width/2+250, y: height-3800, image: ob2},
      {x: width/2-150, y: height-4300, image: ob1},
      {x: width/2+250, y: height-4800, image: ob2},
      {x: width/2, y: height-5300, image: ob1},
      {x: width/2-180, y: height-5500, image: ob2},
    ];

    this.addSprites(obstacles,obstaclePositions.length,ob1,0.04,obstaclePositions);

  }

  addSprites(group,number,image,scale,positions=[]){
    for(var i = 0;i<number;i++){
      var x, y;
      if(positions.length>0){
        x = positions[i].x;
        y = positions[i].y;
        image = positions[i].image;
      }
      else{
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400);
      }
      var sprite = createSprite(x,y);
      sprite.addImage(image);
      sprite.scale = scale;
      group.add(sprite);
    }
  }

  getState(){
    database.ref("gameState").on("value",s=>{
      gameState = s.val();
    })
  }

  updateState(s){
    database.ref("/").update({
      gameState:s
    })
  }

  handleElements(){
    form.hide();
    form.title.position(40,50);
    form.title.class("gameTitleAfterEffect");

    this.reset.position(width/2+230,40);
    this.reset.class("resetButton");

    this.leaderboard.position(width/3-60,40);
    this.leaderboard.html("Leaderboard");
    this.leaderboard.class("leaderTitle")

    this.leader1.position(width/3-50,80);
    this.leader1.class("leader");

    this.leader2.position(width/3-50,130);
    this.leader2.class("leader");

  }

  play(){
    this.handleElements();
    Player.getPlayersInfo();
    player.getCarsAtEnd();

    this.resetGame();

    if(allPlayers){
      image (track,0,-height*5,width,height*6);
      this.showLeaderboard();
      this.showLife();
      this.showFuel();
      var index = 0;
      for(var plr in allPlayers){
        index = index+1;

        var x = allPlayers[plr].positionX;
        var y = height-allPlayers[plr].positionY;
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;
        var currentLife = allPlayers[plr].life;
        if(currentLife <= 0){
          cars[index-1].changeImage("boom");
          cars[index-1].scale = 0.3;
        }

        if(index == player.index){
          fill("red");
          ellipse(x,y,70,70);
          camera.position.x = width/2;
          camera.position.y = cars[index-1].position.y;
          this.handleFuel(index);
          this.handleCoins(index);
          this.handleObstacleCollision(index);
          this.handleCarCollision(index);

          if(player.life <=0){
            this.blast = true;
            this.playerMoving = false;
          }
        }
      }

      this.handlePlayerControls();

      const finishLine = height*6-100;
      if(player.positionY > finishLine){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      if(this.playerMoving){
        player.positionY+= 4;
        player.update();
      }
      drawSprites();
    }
  }

  handlePlayerControls(){
    if(!this.blast){
      if(keyIsDown(UP_ARROW)){
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }
  
      if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+300){
        player.positionX += 5;
        player.update();
        this.leftKeyActive = false;
      }
  
      if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50){
        player.positionX -= 5;
        player.update();
        this.leftKeyActive = true;
      }
    }
    

  }

  resetGame(){
    this.reset.mousePressed(()=>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        carsAtEnd: 0,
        players: {}
      })
      window.location.reload();
    })
  }

  showLeaderboard(){
    var leader1, leader2;
    var players = Object.values(allPlayers);

    if(
      (players[0].rank==0 && players[1].rank==0)||players[0].rank==1
    ){
      leader1 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score;
      leader2 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score;
    }

    if(players[1].rank == 1){
      leader1 = players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score;
      leader2 = players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,function(c,f){
      player.fuel = 200;
      f.remove();
    })
    if(player.fuel > 0 && this.playerMoving){
      player.fuel -= 0.4;
    }

    if(player.fuel <= 0){
      gameState = 2;
      this.gameOver();
    }
  }

  handleCoins(index){
    cars[index-1].overlap(coins,function(car,coin){
      player.score += 10;
      player.update();
      coin.remove();
    })
  }

  showRank(){
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You have finsished the race",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    })
  }

  showLife(){
    push();
    image(life,width/2-130,height-player.positionY-300,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-300,200,20);
    fill("red");
    rect(width/2-100,height-player.positionY-300,player.life,20);
    pop();
  }

  showFuel(){
    push();
    image(fuel,width/2-130,height-player.positionY-350,20,20);
    fill("white");
    rect(width/2-100,height-player.positionY-350,200,20);
    fill("yellow");
    rect(width/2-100,height-player.positionY-350,player.fuel,20);
    pop();
  }

  gameOver(){
    swal({
      title: "Game Over!",
      text: "Oops! You lost.",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks for playing!"

    })
  }

  handleObstacleCollision(index){
    if(cars[index-1].collide(obstacles)){
      if(player.life>0){
        player.life-=200/3;
      }
      player.update();

      if(this.leftKeyActive){
        player.positionX += 100;
      }
      else{
        player.positionX -= 100;
      }
    }
  }

  handleCarCollision(index){
    if(index===1){
      if(cars[index-1].collide(cars[1])){
        if(player.life>0){
          player.life-=200/3;
        }
        player.update();
  
        if(this.leftKeyActive){
          player.positionX += 100;
        }
        else{
          player.positionX -= 100;
        }
      }

    }
    if(index===2){
      if(cars[index-1].collide(cars[0])){
        if(player.life>0){
          player.life-=200/3;
        }
        player.update();
  
        if(this.leftKeyActive){
          player.positionX += 100;
        }
        else{
          player.positionX -= 100;
        }
      }
    }
  }

}
