var gravity = 1
var rising = 0
var edge = 600;
var MIN_OPENING = 300;
let song
var score = 0
var x = 0
var y = 0
var place = 0
var platformN = 0
var i = 0
function preload() {
  player_injured_image = loadImage("images/alienYellow_hurt.png");
  backgroundImage = loadImage('images/colored_grass.png')
}

function setup() {
  createCanvas(2000, 1000);

  background(backgroundImage);

  song = loadSound('sound/01_LOOP_COOL_ENOUGH.ogg')
  song.setLoop(true)
  song.setVolume(0.2)
  s_jump = loadSound('sound/jump-1.wav')
  s_walk = loadSound('sound/bonk-4.wav')
  s_bonk = loadSound('sound/footstep.wav')
  s_coin = loadSound('sound/coin-1.wav')
  s_boom = loadSound('sound/explode-6.wav')
  s_lose = loadSound('sound/lose-5.wav')

  player_injured_image.filter(THRESHOLD)
  player = createSprite(900, 150, 50, 100)

  platforms = new Group()
  platform = createSprite(900, 290);
  platform.addImage(loadImage('images/elementGlass017.png'));
  platforms.add(platform)
  // platform2 = createSprite(1300, 200)
  // platform2.addImage(loadImage('images/elementStone029.png'));
  // platforms.add(platform2)
  platform3 = createSprite(1110, 450)
  platform3.addImage(loadImage('images/elementStone013.png'));
  platforms.add(platform3)
  platform4 = createSprite(680, 445);
  platform4.addImage(loadImage('images/elementWood012.png'));
  platforms.add(platform4)
  platform5 = createSprite(680, 600);
  platform5.addImage(loadImage('images/elementGlass049.png'));
  platforms.add(platform5)
  platform6 = createSprite(900, 600);
  platform6.addImage(loadImage('images/elementStone048.png'));
  platforms.add(platform6)
  platform7 = createSprite(1120, 600);
  platform7.addImage(loadImage('images/elementGlass014.png'));
  platforms.add(platform7)
  platform8 = createSprite(1340, 600);
  platform8.addImage(loadImage('images/elementWood015.png'));
  platforms.add(platform8)
  platform9 = createSprite(1560, 600);
  platform9.addImage(loadImage('images/elementMetal013.png'));
  platforms.add(platform9)
  platform10 = createSprite(1560, 445);
  platform10.addImage(loadImage('images/elementMetal013.png'));
  platforms.add(platform10)
  platform11 = createSprite(1340, 290);
  platform11.addImage(loadImage('images/elementMetal051.png'));
  platforms.add(platform11)

  hazards = new Group()
  spinner = createSprite(1150,400)
  //spinner.addImage(loadImage('images/spinnerHalf.png'))
  var spin = spinner.addAnimation('spin', 'images/spinnerHalf.png', 'images/spinnerHalf_spin.png')
  hazards.add(spinner)

  coins = new Group();
  for (var i = 0; i < 10; i++) {
    x = random(500, width-500)
    y = random(100, height-400)
    var c = createSprite(x, y, 10, 10)
    c.addImage(loadImage('images/coin.png'))
    coins.add(c);
  }
  
  var anim = player.addAnimation('idle','images/alienYellow.png','images/alienYellow2.png','images/alienYellow3.png');
  player.addAnimation('moving', 'images/alienYellow_stand.png', 'images/alienYellow_walk1.png', 'images/alienYellow_walk2.png');
  player.addAnimation('jumping', 'images/alienYellow_jump.png')
  player.addAnimation('falling', 'images/alienYellow_hurt.png')
  var boom = player.addAnimation('boom', 'images/pixelExplosion00.png', 'images/pixelExplosion01.png', 'images/pixelExplosion02.png', 'images/pixelExplosion03.png', 'images/pixelExplosion04.png', 'images/pixelExplosion05.png', 'images/pixelExplosion06.png', 'images/pixelExplosion07.png', 'images/pixelExplosion08.png')
  player.velocity.y = 0

  camera.zoom = 1.3

  spinner.velocity.x += 2
}

function draw() {
  // if(frameCount%60 == 0) {
  //   place = random(200,height-200)
  //   platformN = createSprite(player.position.x + width, place);
  //   platformN.addImage('images/elementStone013.png');
  //   platforms.add(platformN);
  // }
  
  // for(i = 0; i<platforms.length; i++){
  //     if(platforms[i].position.x < player.position.x-width/2){
  //       platforms[i].remove();
  //     }
  // }
  background(backgroundImage);
  player.collide(platforms)
  coins.collide(platforms)
  coins.collide(coins)
  player.overlap(coins, getCoin);
  if(spinner.position.x>1180){
    spinner.velocity.x -= 1
  } else if(spinner.position.x<1040){
    spinner.velocity.x += 1
  }
  if(player.overlap(hazards)){
    player.overlap(hazards,getBoom)
  }
  else if(player.overlap(platforms)==false){
    player.velocity.y += gravity
  }
  else if(player.overlap(platforms)){
    player.velocity.y = 1;
    if(song.isPlaying()==false){song.play()}
  }
  if (mouseIsPressed && player.overlap(platforms)){
    player.changeAnimation('jumping')
    player.velocity.y = -20
    if(s_jump.isPlaying()==false){
      s_jump.play()
    }
  }
  else if(mouseX < 1000 - 40) {
    player.mirrorX(-1)
    if (player.overlap(platforms)){
      player.changeAnimation('moving');
      if(s_walk.isPlaying()==false){
        s_walk.play()
      }
    }
    else if (player.velocity.y > 0) {
      player.changeAnimation('falling');
    }
    //flip horizontally
    
    //negative x velocity: move left
    player.velocity.x = -4;
  }
  else if(mouseX > 1000 + 40) {
    player.mirrorX(1);
    if (player.overlap(platforms)){
      player.changeAnimation('moving');
      if(s_walk.isPlaying()==false){
        s_walk.play()
      }
    }
    else if (player.velocity.y > 0) {
      player.changeAnimation('falling');
    }
    //unflip
    player.velocity.x = 4;
  }
  else if (mouseX < 1000 + 40 && mouseX > 1000 - 40){
    //if close to the mouse, don't move
    if (player.overlap(platforms)){
      player.changeAnimation('idle');
    }
    else if (player.velocity.y > 0) {
      player.changeAnimation('falling');
    }
    player.velocity.x = 0;
  }
  if(player.position.x>766 && (width-player.position.x)>661)camera.position.x = player.position.x;
  camera.position.y = player.position.y;
  if(player.position.x < 0)
    player.position.x = 0;
  if(player.position.y < 0)
    player.position.y = 0;
  if(player.position.x > 2000)
    player.position.x = 2000;
  if(player.position.y > 900)
    getBoom(player, spinner)  
    //player.position.y = 800;
  
  // if(player.velocity.y < 0) {
  //   player.velocity.y +=1
  // }
  
  // if(player.overlapPixel(player.position.x, player.position.y+31)==false){
  //   
  // }
  // else if(player.velocity==0)
  // {
  //   player.velocity.y = 1
  // }
  drawSprites();
  camera.off();
  if (coins.length > 0) {
    textSize(32)
    textStyle(BOLD);
    text(score, 30, 50);
    fill(255,255,0)
  }
  else {
    text("You win!", width/2, height/2);
  }
  //map1.draw();
  //player.draw();
  //player.update();
}

function getCoin(player, coin) {
  s_coin.play()
  coin.remove();
  score += 1;
}

function getBoom(player, hazard) {
  player.setVelocity(0,0)
  player.position.y -= 1
  player.limitSpeed(0)
  player.changeAnimation('boom');
  if(song.isPlaying()){song.stop()}
  if(s_boom.isPlaying()==false){s_boom.play()}
  setTimeout(function(){
    player.remove()
    if(s_lose.isPlaying()==false)s_lose.play()
  }, 290);
}
