var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameState2 = 0;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var box1,box2, box3, box4, box5, box6, box7, box8, box9, box10;
var feminismo;
var correctAnswer;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var questionBox

var score, questionScore; 
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  feminismo = loadImage("feminismo punho.jpg");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,windowHeight/2 +7,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(200,windowHeight/2,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2 - 200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2-140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,windowHeight/2+7,400,20);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  correctAnswer =0;
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  textSize(20);
  text("Pontuação: "+ score, windowWidth-150,50);
  textSize(20);
  text("Respostas corretas: "+ correctAnswer,windowWidth-400,50)
 
  if(gameState === PLAY){
   
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
   
      
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(keyDown("space")&& trex.y >= windowHeight-530) {
        trex.velocityY = -13;
        jumpSound.play();
    }
    
    if(gameState2 ===0){
      score = score + Math.round(getFrameRate()/60);
     
    }
    if( ( score + Math.round(getFrameRate()/60)) === 200){
     spawnBox1();
     }
    if( ( score + Math.round(getFrameRate()/60)) === 260){
      gameState2=1;
      questionOne();
    }
   
  
   
    
   
       
    
    
    
    
    
    
    
    if(gameState2 ===1){
          
            gameP();
        }
   
   //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;

      //mudar a animação do trex
        trex.changeAnimation("collided", trex_collided);
    
      ground.velocityX = 0;
      trex.velocityY = 0
      
      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
     
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0); 
        
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  
  
 

  drawSprites();
}

function reset(){
  gameState= PLAY;
  gameOver.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  trex.changeAnimation("running",trex_running);
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth-50,windowHeight/2 - 10,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.65;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth-1,windowHeight/4+200,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 800;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}
 
function questionOne() {
  
  text("Quem foi a primeira mulher a ganhar o prêmio Nobel?",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. Marie Curie  ",windowWidth/2-100,windowHeight/2 +200);
  text("2. Angelina Jolie ",windowWidth/2-100,windowHeight/2 +230);
  text("3. Malala Yousafzai",windowWidth/2-100,windowHeight/2 +260);
  if(keyDown("1")){
    gameState2=0;
    correctAnswer= +1;
    box1.y=windowHeight-70;
  }
  else if(keyDown("2") || keyDown("3")){
    gameState2=0;
    box1.y=windowHeight+500;
  }
}
function questionTwo() {
  
  text("As mulheres ganham menos de __ menos que os homens",windowWidth/2-230,windowHeight/2 +100);
  
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 13%  ",windowWidth/2-100,windowHeight/2 +200);
  text("2. 45% ",windowWidth/2-100,windowHeight/2 +230);
  text("3. 21%",windowWidth/2-100,windowHeight/2 +260);
}
function questionThree() {
  
  text("A porcentagem de desemprego das mulheres é de __ enquanto dos homens é de __",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 5,9% e 3,7%  ",windowWidth/2-100,windowHeight/2 +200);
  text("2. 8,3 % e 4,8%  ",windowWidth/2-100,windowHeight/2 +230);
  text("3. 9,8% e 6,5% ",windowWidth/2-100,windowHeight/2 +260);
}
function questionFour() {
  
  text("Cerca de __ das mulheres já sofreu algum episódio de violência física e sexual pelo menos uma vez na vida.",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 1/5",windowWidth/2-100,windowHeight/2 +200);
  text("2. 1/3",windowWidth/2-100,windowHeight/2 +230);
  text("3. 1/2",windowWidth/2-100,windowHeight/2 +260);
}
function questionFive() {
  
  text("O direito ao voto pelas mulheres foi concedido em…",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 1932",windowWidth/2-100,windowHeight/2 +200);
  text("2. 1944",windowWidth/2-100,windowHeight/2 +230);
  text("3. 1957",windowWidth/2-100,windowHeight/2 +260);
}
function questionSix() {
  
  text("Qual foi o primeiro país a permitir o voto feminino?",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. Estados Unidos",windowWidth/2-100,windowHeight/2 +200);
  text("2. Inglaterra ",windowWidth/2-100,windowHeight/2 +230);
  text("3. Nova Zelândia ",windowWidth/2-100,windowHeight/2 +260);
}
function questionSeven() {
  
  text("Qual foi a primeira mulher a ser eleita presidente no mundo?",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. Dilma Rousseff - Brasil ",windowWidth/2-100,windowHeight/2 +200);
  text("2. Vigdís Finnbogadóttir - Islândia  ",windowWidth/2-100,windowHeight/2 +230);
  text("3. Angela Merkel - Alemanha",windowWidth/2-100,windowHeight/2 +260);
}
function questionEight() {
  
  text("Qual foi a primeira mulher a pilotar um avião e atravessar o oceano Atlântico pelo ar? ",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. Amelia Earhart  ",windowWidth/2-100,windowHeight/2 +200);
  text("2. Anésia Pinheiro Machado",windowWidth/2-100,windowHeight/2 +230);
  text("3. Raymonde de Laroche",windowWidth/2-100,windowHeight/2 +260);
}
function questionNine() {
  
  text("Em qual ano foi conquistado o direito da mulher de frequentar uma universidade? ",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 1879",windowWidth/2-100,windowHeight/2 +200);
  text("2. 1900",windowWidth/2-100,windowHeight/2 +230);
  text("3. 1883",windowWidth/2-100,windowHeight/2 +260);
}
function questionTen() {
  
  text("Qual a porcentagem de mulheres com 25 anos ou mais que completaram a universidade? E de homens? ",windowWidth/2-230,windowHeight/2 +100);
  text("(pressione no teclado o número da resposta)",windowWidth/2-190,windowHeight/2 +135);
  text("1. 22,5% e 25,4%",windowWidth/2-100,windowHeight/2 +200);
  text("2. 19,4% e 15,1 %",windowWidth/2-100,windowHeight/2 +230);
  text("3. 20,7% e 16, 3%",windowWidth/2-100,windowHeight/2 +260);
}
function gameP(){
      score= score;
      ground.velocityX = 0;
      trex.velocityY = 0
       obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0); 
        obstaclesGroup.setLifetimeEach(0);
        cloudsGroup.setLifetimeEach(0);
        box1.velocityX=0;
}

function spawnBox1(){
  box1= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box1.scale = 0.035;
  box1.velocityX = -30;
  box1.addImage("feminismo",feminismo);

}
function spawnBox2(){
  box2= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box2.scale = 0.035;
  box2.velocityX = -30;
  box2.addImage("feminismo",feminismo);

}
function spawnBox3(){
  box3= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box3.scale = 0.035;
  box3.velocityX = -30;
  box3.addImage("feminismo",feminismo);

}
function spawnBox4(){
  box4= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box4.scale = 0.035;
  box4.velocityX = -30;
  box4.addImage("feminismo",feminismo);

}
function spawnBox5(){
  box5= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box5.scale = 0.035;
  box5.velocityX = -30;
  box5.addImage("feminismo",feminismo);

}
function spawnBox6(){
  box6= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box6.scale = 0.035;
  box6.velocityX = -30;
  box6.addImage("feminismo",feminismo);

}
function spawnBox7(){
  box7= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box7.scale = 0.035;
  box7.velocityX = -30;
  box7.addImage("feminismo",feminismo);

}
function spawnBox8(){
  box8= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box8.scale = 0.035;
  box8.velocityX = -30;
  box8.addImage("feminismo",feminismo);

}
function spawnBox9(){
  box9= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box9.scale = 0.035;
  box9.velocityX = -30;
  box9.addImage("feminismo",feminismo);

}
function spawnBox10(){
  box10= createSprite(windowWidth-50,windowHeight/2 - 10,40,40);
  box10.scale = 0.035;
  box10.velocityX = -30;
  box10.addImage("feminismo",feminismo);

}