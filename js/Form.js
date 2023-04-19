class Form {
  constructor() {
    this.title = createImg("./assets/title.png","gameTitle");
    this.playButton = createButton("Play");
    this.input = createInput("").attribute("placeholder","Enter your name here");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  display(){
    this.handleElements();
    this.handleMousePressed();
  }

  handleElements(){
    this.title.position(120,50);
    this.title.class("gameTitle");

    this.input.position(width/2-110,height/2-80);
    this.input.class("customInput");

    this.playButton.position(width/2-90,height/2-20);
    this.playButton.class("customButton");

    this.greeting.position(width/2-300,height/2-100);
    this.greeting.class("greeting");
  }

  handleMousePressed(){
    this.playButton.mousePressed( ()=>{
      this.playButton.hide();
      this.input.hide();
      var message = `Hello ${this.input.value()} </br> Wait for another player to join...`
      this.greeting.html(message);
      playerCount+=1;
      player.updateCount(playerCount);
      player.name = this.input.value();
      player.index = playerCount;
      player.addPlayer();
      player.getDistance();
    })
  }
}
