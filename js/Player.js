class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.score = 0;
    this.rank = 0;
    this.life = 200;
    this.fuel = 200;
  }

  addPlayer(){
    if(this.index == 1){
      this.positionX = width/2-100;
    }
    else{
      this.positionX = width/2+100;
    }

    var playerIndex = "players/player"+this.index;
    database.ref(playerIndex).set({
      name:this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    })
  }

  getCount(){
    database.ref("playerCount").on("value",x=>{
      playerCount = x.val();
    })
  }

  updateCount(z){
    database.ref("/").update({
      playerCount:z
    })
  }

  static getPlayersInfo(){
    database.ref("players").on("value",p=>{
      allPlayers = p.val();
    });
  
  }

  update(){
    database.ref("players/player"+this.index).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    })
  }

  getDistance(){
    database.ref("players/player"+this.index).on("value",s=>{
      this.positionX = s.val().positionX;
      this.positionY = s.val().positionY;
    })
  }

  getCarsAtEnd(){
    database.ref("carsAtEnd").on("value",i=>{
      this.rank = i.val();
    })
  }

  static updateCarsAtEnd(w){
    database.ref("/").update({
      carsAtEnd: w
    })
  }
}
