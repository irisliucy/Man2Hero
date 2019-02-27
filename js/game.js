/**
 * Man 2 Hero -- A game AI with javascript
 *
 * CS4386 AI Game Programming 1617 Semester B
 *
 * @link   https://github.com/irisliucy/Man2Hero.git
 * @fileoverview   game.js implements the main logic of the game, which includes sounds, graphic, animation
 * @Description
 * 	- 7 game levels in total
 * 	- Game control keys include 'Z' (Attack), 'R' (Restart), 'P' (Pass), 'O' (Open Door)
 */

/* ==INITIALIZATION== */

// Initialize the game with Phaser
var gameNew = new Phaser.Game(960, 540, Phaser.CANVAS, '', { preload: preload, create: create, update: update }); // Initialize the game with Phaser
audioInit();


/* == GAME CREATION== */
/*
*  A function to create game context
**/
function create() {
	restartParameter();
	// set background
	audioBackground.play();
	audioBackground.loop = true;
	doorIsOpened = false;
	if(backgroundImage!=null)
		backgroundImage.kill();
		backgroundImage = gameNew.add.sprite(0,0,'spritesheet','environment/background');
	if(barrier!=null)
			barrier.callAll('kill');
		barrier = gameNew.add.group();
		barrier.enableBody = true;
		//barrier
	   	var wallTop = barrier.create(0,0,'spritesheet','environment/barrier2');
		var wallLeft = barrier.create(0,118,'spritesheet','environment/barrier3');
		var wallRight = barrier.create(gameNew.width-12,118,'spritesheet','environment/barrier3');
		var wallBottom = barrier.create(0,gameNew.height-48,'spritesheet','environment/barrier1');
		wallTop.body.immovable = true;
		wallLeft.body.immovable = true;
		wallRight.body.immovable = true;
		wallBottom.body.immovable = true;
		wallTop.collideWorldBounds = true;
		wallLeft.collideWorldBounds = true;
		wallRight.collideWorldBounds = true;
		wallBottom.collideWorldBounds = true;
		wallTop.allowGravity = false;
		wallBottom.allowGravity = false;
		wallLeft.allowGravity = false;
		wallRight.allowGravity = false;
	if(currentLevel==0){ // GAME LEVEL 0
		startTime=gameNew.time.now;
		gameIsDone = false;
		restartCounter=0;
		gameNew.physics.startSystem(Phaser.Physics.ARCADE);

		//street
		street = gameNew.add.group();
		for(var i = 0;i<10;i++)
			street.create(444-48*i,285,'spritesheet','environment/street');
		for(var i=0;i<5;i++)
			street.create(444,285-48*i,'spritesheet','environment/street');

		//door
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);

	    //switcher
	    switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
	    switcher.scale.setTo(1.5,1.5);
	    isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);

	    // game control key
	    cursors = gameNew.input.keyboard.createCursorKeys();
	    this.z = gameNew.input.keyboard.addKey(Phaser.Keyboard.Z); // press Z: Action (attack)
	    z = this.z;
	    okey = gameNew.input.keyboard.addKey(Phaser.Keyboard.O); // press O: Open the door
	    pkey = gameNew.input.keyboard.addKey(Phaser.Keyboard.P); // press P:
	    rkey = gameNew.input.keyboard.addKey(Phaser.Keyboard.R); // press R: Restart Game
		resize();
		instructionScreen();

		//player object
	    player = gameNew.add.sprite(playerX, playerY, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(0.2);
	    player.body.allowGravity = false;
	    player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    // define player behaviours
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

	}else if(currentLevel==1){ //GAME LEVEL 1
		instructionText.visible = false;
		//reset
		if(shooter1!=null)shooter1.kill();
		if(shooter2!=null)shooter2.kill();
		if(shooter3!=null)shooter3.kill();
		if(shooter4!=null)shooter4.kill();
		if(shooter5!=null)shooter5.kill();
		if(shooter6!=null)shooter6.kill();
		if(shooter7!=null)shooter7.kill();
		if(blocks1!=null)blocks1.callAll('kill');
		if(blocks2!=null)blocks2.callAll('kill');
		if(blocks3!=null)blocks3.callAll('kill');
		if(blocks4!=null)blocks4.callAll('kill');
		if(blocks5!=null)blocks5.callAll('kill');
		if(blocks6!=null)blocks6.callAll('kill');
		if(blocks7!=null)blocks7.callAll('kill');
		if(knifes1!=null)knifes1.callAll('kill');
		if(knifes2!=null)knifes2.callAll('kill');
		if(knifes3!=null)knifes3.callAll('kill');
		if(knifes4!=null)knifes4.callAll('kill');
		if(knifes5!=null)knifes5.callAll('kill');
		if(knifes6!=null)knifes6.callAll('kill');
		if(knifes7!=null)knifes7.callAll('kill');
		street.visible = false;
		//player
		player.kill(); // remove the player object and reinitialize
	    player = gameNew.add.sprite(playerX, playerY, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	    player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

	    //door
	    if(door!=null)
	    	door.kill();
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);

		//switcher
		switcher.kill();
		switcherX= 900;
		switcherY= 420;
		switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
		switcher.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);
	    if(switcher2!=null)switcher2.kill();

	    //shooter
	    shooterSetUp1();
	}else if(currentLevel==2){ //GAME LEVEL 2
		//reset
		shooter1.kill();
		shooter2.kill();
		shooter3.kill();
		shooter4.kill();
		shooter5.kill();
		shooter6.kill();
		shooter7.kill();
		blocks1.callAll('kill');
		blocks2.callAll('kill');
		blocks3.callAll('kill');
		blocks4.callAll('kill');
		blocks5.callAll('kill');
		blocks6.callAll('kill');
		blocks7.callAll('kill');
		knifes1.callAll('kill');
		knifes2.callAll('kill');
		knifes3.callAll('kill');
		knifes4.callAll('kill');
		knifes5.callAll('kill');
		knifes6.callAll('kill');
		knifes7.callAll('kill');
		playerX = 455;
		playerY = 118;

		//player
		player.kill();
	    player = gameNew.add.sprite(playerX, playerY, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	    player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

	    // door
	    if(door!=null)
	    	door.kill();
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);

		//switcher
		switcher.kill();
		switcherX= 900;
		switcherY= 420;
		switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
		switcher.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);

	    if(switcher2!=null)
		switcher2.kill();
		switcher2X= 60;
		switcher2Y= 420;
		switcher2 = gameNew.add.sprite(switcher2X,switcher2Y,'spritesheet','environment/switcher/turnon/0001');
		switcher2.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft2 = switcher2.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight2 =  switcher2.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher2,Phaser.Physics.ARCADE);
		switcher2.body.collideWorldBounds = true;
		switcher2.enableBody = true;
		switcher2.body.immovable = true;
		switcher2.body.bounce.set(0.5);
		switcher2.anchor.x = 0.5;
		isSwitchingAnimLeft2.onStart.add(switchLeftAnimationStarted2, this);
	    isSwitchingAnimLeft2.onLoop.add(switchLeftAnimationLooped2, this);
	    isSwitchingAnimLeft2.onComplete.add(switchLeftStop2, this);
	    isSwitchingAnimRight2.onStart.add(switchRightAnimationStarted2, this);
	    isSwitchingAnimRight2.onLoop.add(switchRightAnimationLooped2, this);
	    isSwitchingAnimRight2.onComplete.add(switchRightStop2, this);
	    switcher2IsOn=false;
		shooterSetUp2();
	}else if(currentLevel==3){ // GAME LEVEL 3
		console.log('Level 3');
		//reset
		shooter1.kill();
		shooter2.kill();
		shooter3.kill();
		shooter4.kill();
		blocks1.callAll('kill');
		blocks2.callAll('kill');
		blocks3.callAll('kill');
		blocks4.callAll('kill');
		knifes1.callAll('kill');
		knifes2.callAll('kill');
		knifes3.callAll('kill');
		knifes4.callAll('kill');
		playerX = 100;
		playerY = 115;
		//door
		door.kill();
		door = gameNew.add.sprite(doorX-350,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);
		//player
		player.kill();
	    player = gameNew.add.sprite(playerX, playerY, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	    player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);
	    isDieAnimRight.onComplete.add(dieRightStop,this);
	    if(switcher2!=null)
		switcher2.kill();
		switcher2X= 900;
		switcher2Y= 180;
		switcher2 = gameNew.add.sprite(switcher2X,switcher2Y,'spritesheet','environment/switcher/turnon/0001');
		switcher2.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft2 = switcher2.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight2 =  switcher2.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher2,Phaser.Physics.ARCADE);
		switcher2.body.collideWorldBounds = true;
		switcher2.enableBody = true;
		switcher2.body.immovable = true;
		switcher2.body.bounce.set(0.5);
		switcher2.anchor.x = 0.5;
		isSwitchingAnimLeft2.onStart.add(switchLeftAnimationStarted2, this);
	    isSwitchingAnimLeft2.onLoop.add(switchLeftAnimationLooped2, this);
	    isSwitchingAnimLeft2.onComplete.add(switchLeftStop2, this);
	    isSwitchingAnimRight2.onStart.add(switchRightAnimationStarted2, this);
	    isSwitchingAnimRight2.onLoop.add(switchRightAnimationLooped2, this);
	    isSwitchingAnimRight2.onComplete.add(switchRightStop2, this);
		switcher2IsOn=false;
		switcher.kill();
		switcherX= 900;
		switcherY= 420;
		switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
		switcher.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);
	    wall3 = gameNew.add.group();
	    for(var i=0;i<13;i++)
			wall3.create(364+45*i,240+48,'spritesheet','environment/wall5');
		wallBlock = gameNew.add.group();
		wallBlock.enableBody = true;
		wallBlock.physicsBodyType = Phaser.Physics.ARCADE;
    	wallBlock.setAll('checkWorldBounds', true);
		for(var i=0;i<13;i++){
			var block11 = wallBlock.create(364+46*i,240+48,'spritesheet','environment/block1');
			block11.body.immovable = true;
			block11.body.moves = false;
			block11.body.allowGravity = false;
		}
		wall3.create(409,390,'spritesheet','environment/wall5');
		wall3.create(409,436,'spritesheet','environment/wall5');
		block11 = wallBlock.create(409,390,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		block11 = wallBlock.create(409,436,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		wall3.create(559,390,'spritesheet','environment/wall5');
		wall3.create(559,436,'spritesheet','environment/wall5');
		block11 = wallBlock.create(559,390,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		block11 = wallBlock.create(559,436,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		wall3.create(709,390,'spritesheet','environment/wall5');
		wall3.create(709,436,'spritesheet','environment/wall5');
		block11 = wallBlock.create(709,390,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		block11 = wallBlock.create(709,436,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		block11 = wallBlock.create(900,310+48,'spritesheet','environment/block1');
		block11.body.immovable = true;
		block11.body.moves = false;
		block11.body.allowGravity = false;
		//pig 1
		if(npc_pig_1!=null)
			npc_pig_1.kill();
		npc_pig_1X = 540;npc_pig_1Y = 140;
		npc_pig_1 =  gameNew.add.sprite(npc_pig_1X,npc_pig_1Y,'spritesheet','enemy/pig/walkLeft/0001');
		npc_pig_1.anchor.x=0.5;
		gameNew.physics.enable(npc_pig_1, Phaser.Physics.ARCADE);
		npc_pig_1.body.collideWorldBounds = true;
	    npc_pig_1.body.bounce.set(1);
	    npc_pig_1.body.allowGravity = false;
	    npc_pig_1.body.immovable = false;
	    npc_pig_1.animations.add('left', Phaser.Animation.generateFrameNames('enemy/pig/walkLeft/', 1, 9, '', 4), 10, true, false);
	    npc_pig_1.animations.add('right', Phaser.Animation.generateFrameNames('enemy/pig/walkRight/', 1, 9, '', 4), 10, true, false);
	    pig1IsDieAnimLeft = npc_pig_1.animations.add('dleft', Phaser.Animation.generateFrameNames('enemy/pig/dieLeft/', 1, 8, '', 4), 10, true, false);
	    pig1IsDieAnimRight = npc_pig_1.animations.add('dright', Phaser.Animation.generateFrameNames('enemy/pig/dieRight/', 1, 8, '', 4), 10, true, false);
	    pig1IsAttackingAnimLeft = npc_pig_1.animations.add('aleft', Phaser.Animation.generateFrameNames('enemy/pig/attackLeft/', 1, 7, '', 4), 10, true, false);
	    pig1IsAttackingAnimRight = npc_pig_1.animations.add('aright', Phaser.Animation.generateFrameNames('enemy/pig/attackRight/', 1, 7, '', 4), 10, true, false);
	    pig1IsAttackingAnimLeft.onStart.add(pig1AttackLeftAnimationStarted, this);
	    pig1IsAttackingAnimRight.onLoop.add(pig1AttackLeftAnimationLooped, this);
	    pig1IsAttackingAnimRight.onComplete.add(pig1AttackLeftStop, this);
	    pig1IsAttackingAnimRight.onStart.add(pig1AttackRightAnimationStarted, this);
	    pig1IsAttackingAnimRight.onLoop.add(pig1AttackRightAnimationLooped, this);
	    pig1IsAttackingAnimRight.onComplete.add(pig1AttackRightStop, this);
	    pig1IsDieAnimLeft.onStart.add(pig1DieLeftAnimationStarted, this);
	    pig1IsDieAnimLeft.onLoop.add(pig1DieLeftAnimationLooped, this);
	    pig1IsDieAnimLeft.onComplete.add(pig1DieLeftStop, this);
	    pig1IsDieAnimRight.onStart.add(pig1DieRightAnimationStarted, this);
	    pig1IsDieAnimRight.onLoop.add(pig1DieRightAnimationLooped, this);
	    pig1IsDieAnimRight.onComplete.add(pig1DieRightStop, this);
	    npc_pig_1_HP = PIG_HP;
	    //pig 2
		if(npc_pig_2!=null)
			npc_pig_2.kill();
	    npc_pig_2X = 760;npc_pig_2Y = 240;
		npc_pig_2 =  gameNew.add.sprite(npc_pig_2X,npc_pig_2Y,'spritesheet','enemy/pig/walkLeft/0001');
		npc_pig_2.anchor.x=0.5;
		gameNew.physics.enable(npc_pig_2, Phaser.Physics.ARCADE);
		npc_pig_2.body.collideWorldBounds = true;
	    npc_pig_2.body.bounce.set(1);
	    npc_pig_2.body.allowGravity = false;
	    npc_pig_2.body.immovable = false;
	    npc_pig_2.animations.add('left', Phaser.Animation.generateFrameNames('enemy/pig/walkLeft/', 1, 9, '', 4), 10, true, false);
	    npc_pig_2.animations.add('right', Phaser.Animation.generateFrameNames('enemy/pig/walkRight/', 1, 9, '', 4), 10, true, false);
	    pig2IsDieAnimLeft = npc_pig_2.animations.add('dleft', Phaser.Animation.generateFrameNames('enemy/pig/dieLeft/', 1, 8, '', 4), 10, true, false);
	    pig2IsDieAnimRight = npc_pig_2.animations.add('dright', Phaser.Animation.generateFrameNames('enemy/pig/dieRight/', 1, 8, '', 4), 10, true, false);
	    pig2IsAttackingAnimLeft = npc_pig_2.animations.add('aleft', Phaser.Animation.generateFrameNames('enemy/pig/attackLeft/', 1, 7, '', 4), 10, true, false);
	    pig2IsAttackingAnimRight = npc_pig_2.animations.add('aright', Phaser.Animation.generateFrameNames('enemy/pig/attackRight/', 1, 7, '', 4), 10, true, false);
	    pig2IsAttackingAnimLeft.onStart.add(pig1AttackLeftAnimationStarted, this);
	    pig2IsAttackingAnimLeft.onLoop.add(pig1AttackLeftAnimationLooped, this);
	    pig2IsAttackingAnimLeft.onComplete.add(pig1AttackLeftStop, this);
	    pig2IsAttackingAnimRight.onStart.add(pig1AttackRightAnimationStarted, this);
	    pig2IsAttackingAnimRight.onLoop.add(pig1AttackRightAnimationLooped, this);
	    pig2IsAttackingAnimRight.onComplete.add(pig1AttackRightStop, this);
	    pig2IsDieAnimLeft.onStart.add(pig1DieLeftAnimationStarted, this);
	    pig2IsDieAnimLeft.onLoop.add(pig1DieLeftAnimationLooped, this);
	    pig2IsDieAnimLeft.onComplete.add(pig1DieLeftStop, this);
	    pig2IsDieAnimRight.onStart.add(pig1DieRightAnimationStarted, this);
	    pig2IsDieAnimRight.onLoop.add(pig1DieRightAnimationLooped, this);
	    pig2IsDieAnimRight.onComplete.add(pig1DieRightStop, this);
	    npc_pig_2_HP = PIG_HP;
	    pig_1_Death=false;pig_2_Death=false;
	    shooterSetUp3();
	}else if(currentLevel==4){ // GAME LEVEL 4
		shooter1.kill();
		blocks1.callAll('kill');
		knifes1.callAll('kill');
		wall3.callAll('kill');
		wallBlock.callAll('klll');
		npc_pig_1.kill();
		npc_pig_2.kill();
		//door
		door.kill();
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);
		//player
		player.kill();
	    player = gameNew.add.sprite(340, 300, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	     player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

		//switcher
		if(switcher2!=null)
		switcher2.kill();
		if(switcher!=null)
		switcher.kill();
		npc_boss_1X = 640;npc_boss_1Y = 180;
		//boss 1
		if(npc_boss_1!=null)
			npc_boss_1.kill();
		if(npc_block1!=null)
			npc_block1.kill();
		npc_block1 = gameNew.add.sprite(npc_boss_1X-55,npc_boss_1Y+65,'spritesheet','environment/block');
		gameNew.physics.enable(npc_block1, Phaser.Physics.ARCADE);
		npc_block1.enableBody = true;
		npc_block1.scale.setTo(1.5,1.5);
		npc_block1.body.immovable = true;
		npc_block1.body.collideWorldBounds = true;
		npc_block1.body.allowGravity = false;
		if(npc_block2!=null)
			npc_block2.kill();
		npc_block2 = gameNew.add.sprite(npc_boss_1X-20,npc_boss_1Y+65,'spritesheet','environment/block');
		gameNew.physics.enable(npc_block2, Phaser.Physics.ARCADE);
		npc_block2.enableBody = true;
		npc_block2.scale.setTo(1.5,1.5);
		npc_block2.body.immovable = true;
		npc_block2.body.collideWorldBounds = true;
		npc_block2.body.allowGravity = false;
		npc_boss_1 =  gameNew.add.sprite(npc_boss_1X,npc_boss_1Y,'spritesheet','enemy/boss1/walkLeft/0001');
		// npc_boss_1.enableBody = true;
		boss1ReachTarget=true;
		npc_boss_1.scale.setTo(2,2);
		npc_boss_1.anchor.x=0.5;
		gameNew.physics.enable(npc_boss_1, Phaser.Physics.ARCADE);
		npc_boss_1.body.immovable = false;
		npc_boss_1.body.collideWorldBounds = true;
	    npc_boss_1.body.allowGravity = false;
	    npc_boss_1.body.velocity.x = 0;
	    npc_boss_1.body.velocity.y = 0;	    npc_boss_1.animations.add('left', Phaser.Animation.generateFrameNames('enemy/boss1/walkLeft/', 1, 8, '', 4), 10, true, false);
	    npc_boss_1.animations.add('right', Phaser.Animation.generateFrameNames('enemy/boss1/walkRight/', 1, 8, '', 4), 10, true, false);
	    boss1IsDieAnimLeft = npc_boss_1.animations.add('dleft', Phaser.Animation.generateFrameNames('enemy/boss1/dieLeft/', 1, 7, '', 4), 10, true, false);
	    boss1IsDieAnimRight = npc_boss_1.animations.add('dright', Phaser.Animation.generateFrameNames('enemy/boss1/dieRight/', 1, 7, '', 4), 10, true, false);
	    boss1IsAttackingAnimLeft = npc_boss_1.animations.add('aleft', Phaser.Animation.generateFrameNames('enemy/boss1/attackLeft/', 1, 9, '', 4), 10, true, false);
	    boss1IsAttackingAnimRight = npc_boss_1.animations.add('aright', Phaser.Animation.generateFrameNames('enemy/boss1/attackRight/', 1, 9, '', 4), 10, true, false);
	    boss1IsAttackingAnimLeft.onStart.add(boss1AttackLeftAnimationStarted, this);
	    boss1IsAttackingAnimLeft.onLoop.add(boss1AttackLeftAnimationLooped, this);
	    boss1IsAttackingAnimLeft.onComplete.add(boss1AttackLeftStop, this);
	    boss1IsAttackingAnimRight.onStart.add(boss1AttackRightAnimationStarted, this);
	    boss1IsAttackingAnimRight.onLoop.add(boss1AttackRightAnimationLooped, this);
	    boss1IsAttackingAnimRight.onComplete.add(boss1AttackRightStop, this);
	    boss1IsDieAnimLeft.onStart.add(boss1DieLeftAnimationStarted, this);
	    boss1IsDieAnimLeft.onLoop.add(boss1DieLeftAnimationLooped, this);
	    boss1IsDieAnimLeft.onComplete.add(boss1DieLeftStop, this);
	    boss1IsDieAnimRight.onStart.add(boss1DieRightAnimationStarted, this);
	    boss1IsDieAnimRight.onLoop.add(boss1DieRightAnimationLooped, this);
	    boss1IsDieAnimRight.onComplete.add(boss1DieRightStop, this);
	    npc_boss_1_HP = BOSS1_HP;
	    boss1CurrentActionIsDone = true;
	    startBoss1=false;
	    boss1Energy = 3;
	    boss_1_Death=false;
		boss1EnergyTimer = gameNew.time.now + 5000;

		if(healthBar!=null)
			healthBar.kill();
		healthBar = new HealthBar(gameNew, {x: gameNew.world.centerX, y: 0, width: 960,height:27});
	    healthBar.setPercent(npc_boss_1_HP/BOSS1_HP*100);

		shooterSetUp4();
	}else if(currentLevel==5){ // GAME LEVEL 5
		console.log('Level 5');
		if(healthBar!=null)
			healthBar.kill();
		npc_boss_1.kill();
		shooter1.kill();
		shooter2.kill();
		blocks1.callAll('kill');
		blocks2.callAll('kill');
		knifes1.callAll('kill');
		knifes2.callAll('kill');
		npc_boss_1.kill();
		npc_block1.kill();
		npc_block2.kill();

		//door
		if(door!=null)
			door.kill();
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);
	    if(switcher2!=null)
	    	switcher2.kill();
	    switcher.kill();
		switcherX= 600;
		switcherY= 270;
		switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
		switcher.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);
	    //player
		player.kill();
	    player = gameNew.add.sprite(960/2, 540/2, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	     player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

	    fireguns = gameNew.add.group();
	    fireguns.enableBody = true;
		fireguns.physicsBodyType = Phaser.Physics.ARCADE;
    	fireguns.setAll('checkWorldBounds', true);
    	allFires = gameNew.add.group();
	    allFires.physicsBodyType = Phaser.Physics.ARCADE;
	    allFires.enableBody=true;
	    for(var i=0;i<2;i++){
			var fg = fireguns.create(388+120*i,120,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
	    }
	    fireGun8Timer = gameNew.time.now+2000;

	}else if(currentLevel==6){ // GAME LEVEL 6
		console.log('Level 6');
		console.log(player.body.x+ " "+player.body.y);
		fireguns.callAll('kill');
		allFires.callAll('kill');
	    //player
		player.kill();
	    player = gameNew.add.sprite(80, 120, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	     player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);

		//door
		door.kill();
		door = gameNew.add.sprite(doorX-250,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);
	    switcherX= 900;
		switcherY= 420;
		switcher = gameNew.add.sprite(switcherX,switcherY,'spritesheet','environment/switcher/turnon/0001');
		switcher.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft = switcher.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight=  switcher.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher, Phaser.Physics.ARCADE);
		switcher.body.collideWorldBounds = true;
		switcher.enableBody = true;
		switcher.body.immovable = true;
		switcher.body.bounce.set(0.5);
		switcher.anchor.x = 0.5;
		isSwitchingAnimLeft.onStart.add(switchLeftAnimationStarted, this);
	    isSwitchingAnimLeft.onLoop.add(switchLeftAnimationLooped, this);
	    isSwitchingAnimLeft.onComplete.add(switchLeftStop, this);
	    isSwitchingAnimRight.onStart.add(switchRightAnimationStarted, this);
	    isSwitchingAnimRight.onLoop.add(switchRightAnimationLooped, this);
	    isSwitchingAnimRight.onComplete.add(switchRightStop, this);
	    switcher.animations.play('off',10,false);
	    if(switcher2!=null)
		switcher2.kill();
		switcher2X= 345;
		switcher2Y= 115;
		switcher2 = gameNew.add.sprite(switcher2X,switcher2Y,'spritesheet','environment/switcher/turnon/0001');
		switcher2.scale.setTo(1.5,1.5);
	   	isSwitchingAnimLeft2 = switcher2.animations.add('off', Phaser.Animation.generateFrameNames('environment/switcher/turnoff/', 1, 3, '', 4), 10, true, false);
		isSwitchingAnimRight2 =  switcher2.animations.add('on', Phaser.Animation.generateFrameNames('environment/switcher/turnon/', 1, 3, '', 4), 10, true, false);
		gameNew.physics.enable(switcher2,Phaser.Physics.ARCADE);
		switcher2.body.collideWorldBounds = true;
		switcher2.enableBody = true;
		switcher2.body.immovable = true;
		switcher2.body.bounce.set(0.5);
		switcher2.anchor.x = 0.5;
		isSwitchingAnimLeft2.onStart.add(switchLeftAnimationStarted2, this);
	    isSwitchingAnimLeft2.onLoop.add(switchLeftAnimationLooped2, this);
	    isSwitchingAnimLeft2.onComplete.add(switchLeftStop2, this);
	    isSwitchingAnimRight2.onStart.add(switchRightAnimationStarted2, this);
	    isSwitchingAnimRight2.onLoop.add(switchRightAnimationLooped2, this);
	    isSwitchingAnimRight2.onComplete.add(switchRightStop2, this);
	    firegunList=[];
	    switcher2IsOn=false;
	    wall3 = gameNew.add.group();
	    wall3.enableBody=true;
		wall3.physicsBodyType = Phaser.Physics.ARCADE;
    	wall3.setAll('checkWorldBounds', true);
    	var fireWall = wall3.create(120,118,'spritesheet','environment/wall5')
    	fireWall.body.immovable = true;
		fireWall.body.moves = false;
		fireWall.body.allowGravity = false;
		fireWall = wall3.create(261,118,'spritesheet','environment/wall5')
    	fireWall.body.immovable = true;
		fireWall.body.moves = false;
		fireWall.body.allowGravity = false;
	    fireguns = gameNew.add.group();
	    fireguns.enableBody = true;
		fireguns.physicsBodyType = Phaser.Physics.ARCADE;
    	fireguns.setAll('checkWorldBounds', true);
	    for(var i=0;i<12;i++){
			var fg = fireguns.create(120+47*i,370,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i =0;i<6;i++){
	    	var fg = fireguns.create(120,370-42*i,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i =0;i<3;i++){
	    	var fg = fireguns.create(261,254-42*i,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i =0;i<8;i++){
	    	var fg = fireguns.create(308+47*i,254,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i =0;i<6;i++){
	    	var fg = fireguns.create(405+47*i,170,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i=0;i<2;i++){//45,48
	    	fireWall = wall3.create(308+45*i,165,'spritesheet','environment/wall5')
	    	fireWall.body.immovable = true;
			fireWall.body.moves = false;
			fireWall.body.allowGravity = false;
	    }
	    for(var i=0;i<7;i++){
			var fg = fireguns.create(765,370-42*i,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
			firegunList.push(fg);
	    }
	    for(var i=0;i<3;i++){//45,48
	    	fireWall = wall3.create(812+45*i,370,'spritesheet','environment/wall5')
	    	fireWall.body.immovable = true;
			fireWall.body.moves = false;
			fireWall.body.allowGravity = false;
	    }
	    allFires = gameNew.add.group();
	    allFires.physicsBodyType = Phaser.Physics.ARCADE;
	    allFires.enableBody=true;
	    wall3.setAll('checkWorldBounds', true);
	    fireGunsTrigger=[];
	    for(var i = 0 ; i<54;i++){
	    	fireGunsTrigger.push(false);
	    }
	    fireGunsTrigger1=[];fireGunsTrigger2=[];fireGunsTrigger3=[];fireGunsTrigger4=[];fireGunsTrigger5=[];fireGunsTrigger6=[];fireGunsTrigger7=[];
	    fireGunsSetx01=[];fireGunsSetx11=[];fireGunsSety01=[];fireGunsSety11=[];
	    for(var i=0;i<6;i++){
	    	fireGunsSetx01.push(12);
	    	fireGunsSetx11.push(95);
	    	fireGunsSety01.push(160+42*i);
	    	fireGunsSety11.push(202+42*i);
	    	fireGunsTrigger1.push(false);
	    }
	    fireGunsSetx02=[];fireGunsSetx12=[];fireGunsSety02=[];fireGunsSety12=[];
	    for(var i=0;i<12;i++){
	    	fireGunsSetx02.push(130+47*i);
	    	fireGunsSetx12.push(177+47*i);
	    	fireGunsSety02.push(407);
	    	fireGunsSety12.push(455);
	    	fireGunsTrigger2.push(false);
	    }
	    fireGunsSetx03=[];fireGunsSetx13=[];fireGunsSety03=[];fireGunsSety13=[];
	    for(var i=0;i<5;i++){
	    	fireGunsSetx03.push(162);
	    	fireGunsSetx13.push(236);
	    	fireGunsSety03.push(160+42*i);
	    	fireGunsSety13.push(202+42*i);
	    	fireGunsTrigger3.push(false);
	    }
	    fireGunsSetx04=[];fireGunsSetx14=[];fireGunsSety04=[];fireGunsSety14=[];
	    for(var i=0;i<9;i++){
	    	fireGunsSetx04.push(271+47*i);
	    	fireGunsSetx14.push(318+47*i);
	    	fireGunsSety04.push(291);
	    	fireGunsSety14.push(333);
	    	fireGunsTrigger4.push(false);
	    }
	    fireGunsSetx05=[];fireGunsSetx15=[];fireGunsSety05=[];fireGunsSety15=[];
	    for(var i=0;i<8;i++){
	    	fireGunsSetx05.push(318+47*i);
	    	fireGunsSetx15.push(365+47*i);
	    	fireGunsSety05.push(206);
	    	fireGunsSety15.push(217);
	    	fireGunsTrigger5.push(false);
	    }
	    fireGunsSetx06=[];fireGunsSetx16=[];fireGunsSety06=[];fireGunsSety16=[];
	    for(var i=0;i<6;i++){
	    	fireGunsSetx06.push(412+47*i);
	    	fireGunsSetx16.push(459+47*i);
	    	fireGunsSety06.push(113);
	    	fireGunsSety16.push(133);
	    	fireGunsTrigger6.push(false);
	    }
	    fireGunsSetx07=[];fireGunsSetx17=[];fireGunsSety07=[];fireGunsSety17=[];
	    for(var i=0;i<7;i++){
	    	fireGunsSetx07.push(674);
	    	fireGunsSetx17.push(745);
	    	fireGunsSety07.push(118+42*i);
	    	fireGunsSety17.push(160+42*i);
	    	fireGunsTrigger7.push(false);
	    }
	}else if(currentLevel==7){ // GAME LEVEL 7
		if(switcher!=null)
			switcher.kill();
		if(switcher2!=null)
			switcher2.kill();
		wall3.callAll('kill');
		fireguns.callAll('kill');
		allFires.callAll('kill');
		//door
		if(door!=null)
			door.kill();
		door = gameNew.add.sprite(doorX,doorY,'spritesheet','environment/door/close/0001');
		door.animations.add('close', Phaser.Animation.generateFrameNames('environment/door/close/', 1, 4, '', 4), 10, true, false);
		door.animations.add('open', Phaser.Animation.generateFrameNames('environment/door/open/', 1, 4, '', 4), 10, true, false);
	    gameNew.physics.enable(door, Phaser.Physics.ARCADE);
	    door.enableBody = true;
	    door.body.collideWorldBounds = true;
	    door.body.immovable = true;
	    door.scale.setTo(1.5,1.5);
	    doorIsOpened = false;
		 //player
		player.kill();
	    player = gameNew.add.sprite(960/2-100, 540/2, 'spritesheet', 'character/solider/walkLeft/0001');
	    player.scale.setTo(2,2);
		player.anchor.x=0.5;
		gameNew.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.collideWorldBounds = true;
	    player.body.bounce.set(1);
	    player.body.allowGravity = false;
	    player.animations.add('left', Phaser.Animation.generateFrameNames('character/solider/walkLeft/', 1, 6, '', 4), 10, true, false);
	    player.animations.add('right', Phaser.Animation.generateFrameNames('character/solider/walkRight/', 1, 6, '', 4), 10, true, false);
	    isAttackingAnimLeft = player.animations.add('aleft', Phaser.Animation.generateFrameNames('character/solider/attackLeft/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimRight = player.animations.add('aright', Phaser.Animation.generateFrameNames('character/solider/attackRight/', 1, 3, '', 4), 10, true, false);
	    isAttackingAnimLeft.onStart.add(attackLeftAnimationStarted, this);
	    isAttackingAnimLeft.onLoop.add(attackLeftAnimationLooped, this);
	    isAttackingAnimLeft.onComplete.add(attackLeftStop, this);
	    isAttackingAnimRight.onStart.add(attackRightAnimationStarted, this);
	    isAttackingAnimRight.onLoop.add(attackRightAnimationLooped, this);
	    isAttackingAnimRight.onComplete.add(attackRightStop, this);
	    fireguns = gameNew.add.group();
	    fireguns.enableBody = true;
		fireguns.physicsBodyType = Phaser.Physics.ARCADE;
    	fireguns.setAll('checkWorldBounds', true);
    	allFires = gameNew.add.group();
	    allFires.physicsBodyType = Phaser.Physics.ARCADE;
	    allFires.enableBody=true;
	    for(var i=0;i<2;i++){
			var fg = fireguns.create(220+500*i,280,'spritesheet','environment/firegun');
			fg.body.immovable = true;
			fg.body.moves = false;
			fg.body.allowGravity = false;
	    }
	    fireGun9Timer = gameNew.time.now+2000;
	    fireGun10Timer = gameNew.time.now+2000;
	    //boss 2
	    npc_boss_2X = 640;npc_boss_2Y =540/2-55;
		if(npc_boss_2!=null)
			npc_boss_2.kill();
		if(npc_block1!=null)
			npc_block1.kill();
		if(npc_block2!=null)
			npc_block2.kill();
		npc_block1 = gameNew.add.sprite(npc_boss_2X-50,npc_boss_2Y+40,'spritesheet','environment/block');
		gameNew.physics.enable(npc_block1, Phaser.Physics.ARCADE);
		npc_block1.enableBody = true;
		npc_block1.scale.setTo(1.5,1.5);
		npc_block1.body.immovable = true;
		npc_block1.body.collideWorldBounds = true;
		npc_block1.body.allowGravity = false;
		npc_block2 = gameNew.add.sprite(npc_boss_2X-30,npc_boss_2Y+40,'spritesheet','environment/block');
		gameNew.physics.enable(npc_block2, Phaser.Physics.ARCADE);
		npc_block2.enableBody = true;
		npc_block2.scale.setTo(1.5,1.5);
		npc_block2.body.immovable = true;
		npc_block2.body.collideWorldBounds = true;
		npc_block2.body.allowGravity = false;
		npc_boss_2 =  gameNew.add.sprite(npc_boss_2X,npc_boss_2Y,'spritesheet','enemy/boss2/walkLeft/0001');
		boss2ReachTarget=true;
		// npc_boss_2.scale.setTo(2,2);
		npc_boss_2.anchor.x=0.5;
		gameNew.physics.enable(npc_boss_2, Phaser.Physics.ARCADE);
		boss2IsLeftDirection = true;
		npc_boss_2.body.immovable = false;
		npc_boss_2.body.collideWorldBounds = true;
	    npc_boss_2.body.allowGravity = false;
	    npc_boss_2.body.velocity.x = 0;
	    npc_boss_2.body.velocity.y = 0;
	    npc_boss_2.animations.add('left', Phaser.Animation.generateFrameNames('enemy/boss2/walkLeft/', 1, 12, '', 4), 10, true, false);
	    npc_boss_2.animations.add('right', Phaser.Animation.generateFrameNames('enemy/boss2/walkRight/', 1, 12, '', 4), 10, true, false);
	    boss2IsDieAnimLeft = npc_boss_2.animations.add('dleft', Phaser.Animation.generateFrameNames('enemy/boss2/dieLeft/', 1, 8, '', 4), 10, true, false);
	    boss2IsDieAnimRight = npc_boss_2.animations.add('dright', Phaser.Animation.generateFrameNames('enemy/boss2/dieRight/', 1, 8, '', 4), 10, true, false);
	    boss2IsAttackingAnimLeft = npc_boss_2.animations.add('aleft', Phaser.Animation.generateFrameNames('enemy/boss2/attackLeft/', 1, 15, '', 4), 10, true, false);
	    boss2IsAttackingAnimRight = npc_boss_2.animations.add('aright', Phaser.Animation.generateFrameNames('enemy/boss2/attackRight/', 1, 15, '', 4), 10, true, false);
	    boss2IsAttackingAnimLeft.onStart.add(boss2AttackLeftAnimationStarted, this);
	    boss2IsAttackingAnimLeft.onLoop.add(boss2AttackLeftAnimationLooped, this);
	    boss2IsAttackingAnimLeft.onComplete.add(boss2AttackLeftStop, this);
	    boss2IsAttackingAnimRight.onStart.add(boss2AttackRightAnimationStarted, this);
	    boss2IsAttackingAnimRight.onLoop.add(boss2AttackRightAnimationLooped, this);
	    boss2IsAttackingAnimRight.onComplete.add(boss2AttackRightStop, this);
	    boss2IsDieAnimLeft.onStart.add(boss2DieLeftAnimationStarted, this);
	    boss2IsDieAnimLeft.onLoop.add(boss2DieLeftAnimationLooped, this);
	    boss2IsDieAnimLeft.onComplete.add(boss2DieLeftStop, this);
	    boss2IsDieAnimRight.onStart.add(boss2DieRightAnimationStarted, this);
	    boss2IsDieAnimRight.onLoop.add(boss2DieRightAnimationLooped, this);
	    boss2IsDieAnimRight.onComplete.add(boss2DieRightStop, this);
	    npc_boss_2_HP = BOSS2_HP;
	    boss2CurrentActionIsDone = true;
	    startBoss2=false;
	    boss_2_Death=false;
	    boss2Energy = 4;
		boss2EnergyTimer = gameNew.time.now + 5500;
		bossFireStart=false;
		if(healthBar!=null)
			healthBar.kill();
		healthBar = new HealthBar(gameNew, {x: gameNew.world.centerX, y: 0, width: 960,height:27});
	    healthBar.setPercent(npc_boss_2_HP/BOSS2_HP*100);

	}else if(currentLevel==8){ // END ALL GAME LEVEL
		if(healthBar!=null)
			healthBar.kill();
		player.kill();
		door.kill();
		fireguns.callAll('kill');
		allFires.callAll('kill');
		npc_boss_2.kill();
		totalTime = gameNew.time.now - startTime;
		finishScreen();
	}
}
var playerIsLeftDirection=faalse;
var moverSpeed = 300;
var onSwitchLeft,onSwitchRight,onSwitchLeft2,onSwitchRight2;
var creationMutex = false;

/* Update the game context */
function update() {
	if(!creation){
		create();
		creation=true;
		creationMutex=false;

		switcherIsOn = false;
		switcher2IsOn = false;
		door.animations.play('close',10,false);
		doorIsOpened = false;
	}
	if(okey.isDown&&door!=null){
		audioDoor.play();
		door.animations.play('open','10',false);
		doorIsOpened=true;
	}
	if(pkey.isDown){
		restartScreen();
	}
	if(currentLevel!=0){
		if((restart||gameIsDone)&&rkey.isDown){
			if(currentLevel!=8){
				stateText.text='';
				stateText.visible = false;
				restartParameter();
				create();
				restart=false
				restartCounter++;
			}else{
				location.reload();
			}
		}
	}
	playerSwitcherDistance  = gameNew.physics.arcade.distanceBetween(player,switcher);
	if(playerSwitcherDistance<40.0&&z.isDown||(onSwitchRight||onSwitchLeft)){
		if(!switcherIsOn){
			if(!onSwitchLeft){
				audioSwitch.play();
				switcher.animations.play('on',10,false);
				switcherIsOn = true;
				if(switcherIsOn&&switcher2IsOn){
					audioDoor.play();
					door.animations.play('open',10,false);
					doorIsOpened=true;
				}
			}
		}
		else{
			if(!onSwitchRight){
				switcher.animations.play('off',10,false);
				switcherIsOn = false;
				if(!switcherIsOn||!switcher2IsOn){
					if(doorIsOpened){
						door.animations.play('close',10,false);
						doorIsOpened = false;
					}
				}
			}
		}
	}

	gameNew.physics.arcade.collide(player, switcher);
	gameNew.physics.arcade.collide(player, door,levelup);
	gameNew.physics.arcade.collide(player, barrier);
	if(currentLevel==0){
		switcher2IsOn=true;
	}else if(currentLevel==1){
		switcher2IsOn=true;
		gameNew.physics.arcade.collide(player,blocks1);
		gameNew.physics.arcade.collide(player,blocks2);
		gameNew.physics.arcade.collide(player,blocks3);
		gameNew.physics.arcade.collide(player,blocks4);
		gameNew.physics.arcade.collide(player,blocks5);
		gameNew.physics.arcade.collide(player,blocks6);
		gameNew.physics.arcade.collide(player,blocks7);
		gameNew.physics.arcade.overlap(knifes1,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes1,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes2,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes2,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes3,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes3,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes4,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes4,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes5,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes5,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes6,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes6,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes7,switcher,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes7,barrier,knifeHitsWall,null,this);
		if(block1!=null&&block2!=null&&block3!=null&&block4!=null&&block5!=null&&block6!=null&&block7!=null){
			gameNew.physics.arcade.overlap(knifes1,blocks1,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes2,blocks2,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes3,blocks3,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes4,blocks4,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes5,blocks5,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes6,blocks6,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes7,blocks7,knifeHitsWall,null,this);
		}
		if(knifes1!=null&&knifes2!=null&&knifes3!=null&&knifes4!=null&&knifes5!=null&&knifes6!=null&&knifes7!=null){
			fireTimeInterval = 1500;
			if(firingTimer1<gameNew.time.now)
				shooter1Fires();
			if(firingTimer2<gameNew.time.now)
				shooter2Fires();
			if(firingTimer3<gameNew.time.now)
				shooter3Fires();
			if(firingTimer4<gameNew.time.now)
				shooter4Fires();
			if(firingTimer5<gameNew.time.now)
				shooter5Fires();
			if(firingTimer6<gameNew.time.now)
				shooter6Fires();
			if(firingTimer7<gameNew.time.now)
				shooter7Fires();
			gameNew.physics.arcade.overlap(knifes1,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes2,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes3,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes4,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes5,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes6,player,knifeHitsPlayer,null,this);
			gameNew.physics.arcade.overlap(knifes7,player,knifeHitsPlayer,null,this);
		}
	}else if(currentLevel==2){
		gameNew.physics.arcade.collide(player,blocks1);
		gameNew.physics.arcade.collide(player,blocks2);
		gameNew.physics.arcade.collide(player,blocks3);
		gameNew.physics.arcade.collide(player,blocks4);
		gameNew.physics.arcade.collide(player, switcher2);
		if(switcher2!=null){
			playerSwitcherDistance2  = gameNew.physics.arcade.distanceBetween(player,switcher2);
			if(playerSwitcherDistance2<40.0&&z.isDown||(onSwitchRight2||onSwitchLeft2)){
				if(!switcher2IsOn){
					if(!onSwitchLeft2){
						audioSwitch.play();
						switcher2.animations.play('on',10,false);
						switcher2IsOn = true;
						if(switcherIsOn&&switcher2IsOn){
							audioDoor.play();
							door.animations.play('open',10,false);
							doorIsOpened=true;
						}
					}
				}
				else{
					if(!onSwitchRight2){
						switcher2.animations.play('off',10,false);
						switcher2IsOn = false;
						if(!switcherIsOn||!switcher2IsOn){
							if(doorIsOpened){
								door.animations.play('close',10,false);
								doorIsOpened = false;
							}
						}
					}
				}
			}
			gameNew.physics.arcade.overlap(knifes1,switcher,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes1,switcher2,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes1,barrier,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes2,switcher,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes2,switcher2,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes2,barrier,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes3,switcher,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes3,switcher2,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes3,barrier,knifeHitsWall,null,this);
			gameNew.physics.arcade.overlap(knifes4,switcher,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes4,switcher2,knifeHitsWall2,null,this);
			gameNew.physics.arcade.overlap(knifes4,barrier,knifeHitsWall,null,this);
			if(block1!=null&&block2!=null&&block3!=null&&block4!=null){
				gameNew.physics.arcade.overlap(knifes1,blocks1,knifeHitsWall,null,this);
				gameNew.physics.arcade.overlap(knifes2,blocks2,knifeHitsWall,null,this);
				gameNew.physics.arcade.overlap(knifes3,blocks3,knifeHitsWall,null,this);
				gameNew.physics.arcade.overlap(knifes4,blocks4,knifeHitsWall,null,this);
			}
			if(knifes1!=null&&knifes2!=null&&knifes3!=null&&knifes4!=null){
				if(player.body.y>150){
					if(firingTimer1<gameNew.time.now)
						shooter1Fires2();
					if(firingTimer2<gameNew.time.now)
						shooter2Fires2();
					if(firingTimer3<gameNew.time.now)
						shooter3Fires2();
					if(firingTimer4<gameNew.time.now)
						shooter4Fires2();
				}
				if(switcherIsOn&&switcher2IsOn)
					fireTimeInterval = 800;
				else if(switcher2IsOn||switcherIsOn)
					fireTimeInterval = 1000;
				else
					fireTimeInterval = 1500;
				gameNew.physics.arcade.overlap(knifes1,player,knifeHitsPlayer,null,this);
				gameNew.physics.arcade.overlap(knifes2,player,knifeHitsPlayer,null,this);
				gameNew.physics.arcade.overlap(knifes3,player,knifeHitsPlayer,null,this);
				gameNew.physics.arcade.overlap(knifes4,player,knifeHitsPlayer,null,this);
			}
		}
	}else if(currentLevel==3){
		// switcher2IsOn=true;
		gameNew.physics.arcade.collide(player,wallBlock);
		gameNew.physics.arcade.collide(player,block1);
		gameNew.physics.arcade.overlap(knifes1,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.collide(player, switcher2);
		if(switcher2!=null){
			playerSwitcherDistance2  = gameNew.physics.arcade.distanceBetween(player,switcher2);
			if(playerSwitcherDistance2<40.0&&z.isDown||(onSwitchRight2||onSwitchLeft2)){
				if(!switcher2IsOn){
					if(!onSwitchLeft2){
						audioSwitch.play();
						switcher2.animations.play('on',10,false);
						switcher2IsOn = true;
						if(switcherIsOn&&switcher2IsOn){
							audioDoor.play();
							door.animations.play('open',10,false);
							doorIsOpened=true;
						}
					}
				}
				else{
					if(!onSwitchRight2){
						switcher2.animations.play('off',10,false);
						switcher2IsOn = false;
						if(!switcherIsOn||!switcher2IsOn){
							if(doorIsOpened){
								door.animations.play('close',10,false);
								doorIsOpened = false;
							}
						}
					}
				}
			}
		}

		if(npc_pig_1!=null&npc_pig_2!=null){
			gameNew.physics.arcade.collide(player,npc_pig_1);
			gameNew.physics.arcade.collide(player,npc_pig_2);
			gameNew.physics.arcade.collide(npc_pig_1,wallBlock);
			gameNew.physics.arcade.collide(npc_pig_2,wallBlock);
			gameNew.physics.arcade.collide(npc_pig_1,block1);
			gameNew.physics.arcade.collide(npc_pig_1, barrier);
			gameNew.physics.arcade.collide(npc_pig_2, barrier);
			gameNew.physics.arcade.collide(npc_pig_2,block1);
			gameNew.physics.arcade.collide(npc_pig_1, switcher2);
			gameNew.physics.arcade.collide(npc_pig_2, switcher2);
			gameNew.physics.arcade.collide(npc_pig_1, switcher);
			gameNew.physics.arcade.collide(npc_pig_2, switcher);
			if(npc_pig_1_HP<=0&&!pig_1_Death){
				npc_pig_1.body.immovable = true;
				pig_1_Death=true;
				npc_pig_1.body.velocity.x = 0;
				npc_pig_1.body.velocity.y = 0;
				if(pig1IsLeftDirection)
					npc_pig_1.animations.play('dleft',10,false);
				else
					npc_pig_1.animations.play('dright',10,false);
			}
			if(!pig_1_Death)
				pig1_AI_action();

			if(npc_pig_2_HP<=0&&!pig_2_Death){
				npc_pig_2.body.immovable = true;
				pig_2_Death=true;
				npc_pig_2.body.velocity.x = 0;
				npc_pig_2.body.velocity.y = 0;
				if(pig2IsLeftDirection)
					npc_pig_2.animations.play('dleft',10,false);
				else
					npc_pig_2.animations.play('dright',10,false);
			}
			if(!pig_2_Death)
				pig2_AI_action();
		}
		if(shooter1!=null){
			if(firingTimer1<gameNew.time.now)
				shooter1Fires3();
		}
		if(knifes1!=null)
			gameNew.physics.arcade.overlap(knifes1,player,knifeHitsPlayer,null,this);
	}else if(currentLevel==4){
		gameNew.physics.arcade.collide(player,blocks1);
		gameNew.physics.arcade.collide(player,blocks2);
		gameNew.physics.arcade.collide(npc_boss_1,blocks1);
		gameNew.physics.arcade.collide(npc_boss_1,blocks2);
		gameNew.physics.arcade.collide(npc_boss_1, barrier);
		gameNew.physics.arcade.overlap(knifes1,barrier,knifeHitsWall,null,this);
		gameNew.physics.arcade.overlap(knifes2,barrier,knifeHitsWall,null,this);
		switcher2IsOn=true;
		switcherIsOn=true;
		if(npc_boss_1!=null){
			gameNew.physics.arcade.collide(player,npc_block1);
			gameNew.physics.arcade.collide(player,npc_block2);

			if(npc_boss_1_HP<=0&&!boss_1_Death){
				npc_block1.kill();
				npc_block2.kill();
				boss_1_Death=true;
				npc_boss_1.body.immovable = true;
				npc_boss_1.body.velocity.x = 0;
				npc_boss_1.body.velocity.y = 0;
				if(boss1IsLeftDirection)
					npc_boss_1.animations.play('dleft',10,false);
				else
					npc_boss_1.animations.play('dright',10,false);

				audioDoor.play();
				door.animations.play('open',10,false);
				doorIsOpened=true;
			}
			if(boss1EnergyTimer<gameNew.time.now&&boss1Energy<4)
				boss1Energy++;
			if(boss1Energy>0&&boss1Behaviour=='RangedAttacking'&&!boss_1_Death){
				if(shooter1!=null){
					if(firingTimer1<gameNew.time.now&&boss1Shooter1Count>0)
						shooter1Fires4();
				}
				if(shooter2!=null){
					if(firingTimer2<gameNew.time.now&&boss1Shooter2Count>0)
						shooter2Fires4();
				}
				boss1Energy--;
				boss1EnergyTimer=gameNew.time.now+3500;
			}

			if(!boss_1_Death)
				boss1_AI_action();
			else
				doorIsOpened=true;

			if(npc_block1!=null)
				gameNew.physics.arcade.moveToXY(npc_block1,npc_boss_1.body.x+20,npc_boss_1.body.y+65,boss1MoveSpeed);
			if(npc_block2!=null)
				gameNew.physics.arcade.moveToXY(npc_block2,npc_boss_1.body.x+40,npc_boss_1.body.y+65,boss1MoveSpeed);
		}
		if(knifes1!=null)
			gameNew.physics.arcade.overlap(knifes1,player,knifeHitsPlayer,null,this);
		if(knifes2!=null)
			gameNew.physics.arcade.overlap(knifes2,player,knifeHitsPlayer,null,this);
		if(healthBar!=null)
			 healthBar.setPercent(npc_boss_1_HP/BOSS1_HP* 100);
	}else if(currentLevel==5){

		switcher2IsOn=true;
		gameNew.physics.arcade.collide(player,fireguns);
			if(fireGun8Timer<gameNew.time.now&&doorIsOpened)
				fireGuns8StartFire();
	}else if(currentLevel==6){
		gameNew.physics.arcade.collide(player,fireguns);
		gameNew.physics.arcade.collide(player,wall3);
		gameNew.physics.arcade.collide(player,switcher2);
		if(switcher2!=null){
			playerSwitcherDistance2  = gameNew.physics.arcade.distanceBetween(player,switcher2);
			if(playerSwitcherDistance2<40.0&&z.isDown||(onSwitchRight2||onSwitchLeft2)){
				if(!switcher2IsOn){
					if(!onSwitchLeft2){
						audioSwitch.play();
						switcher2.animations.play('on',10,false);
						switcher2IsOn = true;
						if(switcherIsOn&&switcher2IsOn){
							audioDoor.play();
							door.animations.play('open',10,false);
							doorIsOpened=true;
						}
					}
				}
				else{
					if(!onSwitchRight2){
						switcher2.animations.play('off',10,false);
						switcher2IsOn = false;
						if(!switcherIsOn||!switcher2IsOn){
							if(doorIsOpened){
								door.animations.play('close',10,false);
								doorIsOpened = false;
							}
						}
					}
				}
			}
		}
		if(fireGunsSetx01!=null&&fireGunsSetx11!=null&&fireGunsSety01!=null&&fireGunsSety11!=null){
			fireGuns1StartFire();
			fireGuns2StartFire();
			fireGuns3StartFire();
			fireGuns4StartFire();
			fireGuns5StartFire();
			fireGuns6StartFire();
			fireGuns7StartFire();
		}
	}else if(currentLevel==7){
		gameNew.physics.arcade.collide(player,fireguns);
		gameNew.physics.arcade.collide(npc_boss_2,fireguns);
		gameNew.physics.arcade.collide(npc_boss_2,barrier);
		switcher2IsOn=true;
		switcherIsOn=true;
		if(npc_boss_2!=null){

			gameNew.physics.arcade.collide(player,npc_block1);
			gameNew.physics.arcade.collide(player,npc_block2);

			if(npc_boss_2_HP<=0&&!boss_2_Death){
				boss_2_Death=true;
				npc_boss_2.body.immovable = true;
				npc_block1.kill();
				npc_block2.kill();
				npc_boss_2.body.velocity.x = 0;
				npc_boss_2.body.velocity.y = 0;
				if(boss2IsLeftDirection)
					npc_boss_2.animations.play('dleft',10,false);
				else
					npc_boss_2.animations.play('dright',10,false);
				audioDoor.play();
				door.animations.play('open',10,false);
				doorIsOpened=true;
			}

			if(boss2EnergyTimer<gameNew.time.now&&boss2Energy<4){
				boss2Energy++;
				boss2EnergyTimer=gameNew.time.now+5500;
			}
			if(boss2Energy>0&&boss2Behaviour=='RangedAttacking'&&!bossFireStart&&!boss_2_Death){
				bossFireStart=true;
				fireGuns9StartFire();
				fireGuns10StartFire();
				boss2Energy--;
			}
			if(!boss_2_Death)
				boss2_AI_action();
			else
				doorIsOpened=true;

			if(npc_block1!=null)
				gameNew.physics.arcade.moveToXY(npc_block1,npc_boss_2.body.x+20,npc_boss_2.body.y+50,boss2MoveSpeed);
			if(npc_block2!=null)
				gameNew.physics.arcade.moveToXY(npc_block2,npc_boss_2.body.x+40,npc_boss_2.body.y+50,boss2MoveSpeed);
		}
		if(healthBar!=null)
			 healthBar.setPercent(npc_boss_2_HP/BOSS2_HP*100);
	}
	if(!restart&&!gameIsDone){
		playerControll();
	}
}
var startText;
var restart = false;
function restartParameter() {
	pig1OnAttackLeft=false;
	pig1OnAttackRight=false;
	pig1OnDieLeft=false;
	pig1OnDieRight=false;
	pig2OnAttackLeft=false;
	pig2OnAttackRight=false;
	pig2OnDieLeft=false;
	pig2OnDieRight=false;
	pig1IsLeftDirection = false;
	pig2IsLeftDirection = false;
	boss1OnAttackLeft=false;
	boss1OnAttackRight=false;
	boss1OnDieLeft=false;
	boss1OnDieRight=false;
 	boss1IsLeftDirection = false;
 	boss1CurrentActionIsDone= false;
 	boss2OnAttackLeft=false;
 	boss2OnAttackRight=false;
 	boss2OnDieLeft=false;
 	boss2OnDieRight=false;
 	boss2IsLeftDirection = false;
 	boss2CurrentActionIsDone= false;
 	onAttackLeft= false;
 	onAttackRight= false;
	onDieLeft= false;
	onDieRight= false;
}
function instructionScreen(){
	instructionText = gameNew.add.text(gameNew.world.centerX+240,gameNew.world.centerY-20,' ', { font: '38px Arial', fill: '#FFF' ,boundsAlignH: "left", boundsAlignV: "middle"});
    instructionText.anchor.setTo(0.5, 0.5);
    instructionText.visible = true;
    instructionText.text = "Welcome to Man2Hero\nPress arrow key to move\nPress \"Z\" to attack\n\nP.S. Don't die!";
    instructionText.stroke = '#6d6d6d';
    instructionText.strokeThickness = 4;
}
function restartScreen() {
	player.body.velocity.x=0;
	player.body.velocity.y=0;
	if(playerIsLeftDirection){
		player.animations.play('dleft',false);
	}else{
		player.animations.play('dright',false);
	}

	restart = true;
    stateText = gameNew.add.text(gameNew.world.centerX,gameNew.world.centerY,' ', { font: '82px Arial', fill: '#fff' ,boundsAlignH: "center", boundsAlignV: "middle"});
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = true;
    stateText.text = " Game Over \n Press \"R\" to restart";
    stateText.stroke = '#6d6d6d';
    stateText.strokeThickness = 4;
}
function finishScreen() {
	//  Text
	gameIsDone = true;
    stateText2 = gameNew.add.text(gameNew.world.centerX,gameNew.world.centerY,' ', { font: '64px Arial', fill: '#fff',boundsAlignH: "center", boundsAlignV: "middle" });
    stateText2.anchor.setTo(0.5, 0.5);
    stateText2.visible = true;
    stateText2.text = 	"Congratulation"+
    					"\nRestart Count: "+restartCounter+
    					"\nSpend Time: "+totalTime/1000.0+" second(s)"+
    					"\nPress \"R\" to play it again";
    stateText2.stroke = '#6d6d6d';
    stateText2.strokeThickness = 4;

}
var search_radius = 100;
var attack_radius = 40;
var pigMoveSpeed = 110;
var currTarX,currTarY;
var pig1_status='wait';// wait/chase/attack
var pig1ShouldAttack = false;
var pig1IsWaiting=true;
var newX;
var newY;
var pig2_status='wait';// wait/chase/attack
var pig2ShouldAttack = false;
var pig2IsWaiting=true;
var newX2;
var newY2;
var pig_1_Death,pig_2_Death;
var boss_1_Death,boss_2_Death;
//finite state machine
function pig1_AI_action(){
	//search player
	var distancePigPlayer = gameNew.physics.arcade.distanceBetween(player,npc_pig_1);
	if(pig1_status=='attack'){
		npc_pig_1.body.velocity.x = 0;
		npc_pig_1.body.velocity.y = 0;
		if(pig1ShouldAttack){
			if(pig1IsLeftDirection){
				// if(!pig1OnAttackLeft)
				npc_pig_1.animations.play('aleft',10,false);
			}else{
				// if(!pig1OnAttackRight)
				npc_pig_1.animations.play('aright',10,false);
			}
			pig1ShouldAttack = false;
		}else{
			if(distancePigPlayer<attack_radius){
				pig1_status = 'attack';
				pig1ShouldAttack=true;
			}
			else if(distancePigPlayer<search_radius)
				pig1_status = 'chase';

			else
				pig1_status = 'wait';
		}
	}
	else if(pig1_status=='chase'){
		if(distancePigPlayer<attack_radius){
			pig1_status = 'attack';
			pig1ShouldAttack=true
		}
		else if(distancePigPlayer>search_radius+100)
			pig1_status = 'wait'
		if(player.body.x<npc_pig_1.body.x)
			pig1IsLeftDirection = true;
		else
			pig1IsLeftDirection = false;
		audioPig.play();
		gameNew.physics.arcade.moveToXY(npc_pig_1,player.body.x,player.body.y);
		if(pig1IsLeftDirection){
			npc_pig_1.animations.play('left',10,false);
		}else{
			npc_pig_1.animations.play('right',10,false);
		}
	}else if(pig1_status=='wait'){
		if(distancePigPlayer<attack_radius){
			pig1_status = 'attack';
			pig1ShouldAttack = true;
			pig1IsWaiting = true;
		}
		else if(distancePigPlayer<search_radius){
			pig1_status = 'chase';
			pig1IsWaiting = true;
		}
		if(pig1IsWaiting){
			newX = Math.floor(Math.random() * 200) + 440;
			newY = Math.floor(Math.random() * 110) + 130;
			gameNew.physics.arcade.moveToXY(npc_pig_1,newX,newY);
			if(newX<npc_pig_1.body.x)
				pig1IsLeftDirection = true;
			else
				pig1IsLeftDirection = false;
			pig1IsWaiting = false;
		}else{
			if(Math.floor(npc_pig_1.body.x)==newX||Math.floor(npc_pig_1.body.y)==newY)
				pig1IsWaiting = true;
			else
				gameNew.physics.arcade.moveToXY(npc_pig_1,newX,newY);
		}
		if(!pig1IsLeftDirection){
			npc_pig_1.animations.play('right',10,false);
		}else{
			npc_pig_1.animations.play('left',10,false);
		}
	}
}
function pig2_AI_action(){
	//search player
	var distancePigPlayer = gameNew.physics.arcade.distanceBetween(player,npc_pig_2);
	if(pig2_status=='attack'){
		npc_pig_2.body.velocity.x = 0;
		npc_pig_2.body.velocity.y = 0;
		if(pig2ShouldAttack){
			if(pig2IsLeftDirection){
				// if(!pig1OnAttackLeft)
				npc_pig_2.animations.play('aleft',10,false);
			}else{
				// if(!pig1OnAttackRight)
				npc_pig_2.animations.play('aright',10,false);
			}
			pig2ShouldAttack = false;
		}else{
			if(distancePigPlayer<attack_radius){
				pig2_status = 'attack';
				pig2ShouldAttack=true;
			}
			else if(distancePigPlayer<search_radius)
				pig2_status = 'chase';
			else
				pig2_status = 'wait';
		}
	}
	else if(pig2_status=='chase'){
		if(distancePigPlayer<attack_radius){
			pig2_status = 'attack';
			pig2ShouldAttack=true
		}
		else if(distancePigPlayer>search_radius+100)
			pig2_status = 'wait'
		if(player.body.x<npc_pig_2.body.x)
			pig2IsLeftDirection = true;
		else
			pig2IsLeftDirection = false;
		audioPig.play();
		gameNew.physics.arcade.moveToXY(npc_pig_2,player.body.x,player.body.y);
		if(pig2IsLeftDirection){
			npc_pig_2.animations.play('left',10,false);
		}else{
			npc_pig_2.animations.play('right',10,false);
		}
	}else if(pig2_status=='wait'){
		if(distancePigPlayer<attack_radius){
			pig2_status = 'attack';
			pig2ShouldAttack = true;
			pig2IsWaiting = true;
		}
		else if(distancePigPlayer<search_radius){
			pig2_status = 'chase';
			pig2IsWaiting = true;
		}
		if(pig2IsWaiting){
			newX2 = Math.floor(Math.random() * 200) + 660;
			newY2 = Math.floor(Math.random() * 110) + 130;
			gameNew.physics.arcade.moveToXY(npc_pig_2,newX2,newY2);
			if(newX2<npc_pig_2.body.x)
				pig2IsLeftDirection = true;
			else
				pig2IsLeftDirection = false;
			pig2IsWaiting = false;
		}else{
			if(Math.floor(npc_pig_2.body.x)==newX2||Math.floor(npc_pig_2.body.y)==newY2)
				pig2IsWaiting = true;
			else
				gameNew.physics.arcade.moveToXY(npc_pig_2,newX2,newY2);
			// console.log(newX2+" "+Math.floor(npc_pig_2.body.x)+" "+newY2+" "+Math.floor(npc_pig_2.body.y));
		}
		if(!pig2IsLeftDirection){
			npc_pig_2.animations.play('right',10,false);
		}else{
			npc_pig_2.animations.play('left',10,false);
		}
	}
}
var boss1TargetX,boss1TargetY;
var boss1ReachTarget=true;
var boss1Shooter1Count,boss1Shooter2Count;
var startBoss1=false;
var boss1Energy = 3;
var boss1EnergyTimer;
var boss1Behaviour='RangedAttacking';
var boss1MoveSpeed = 100;
var behaviour = ['Hunting','Attacking','RangedAttacking'];
var behaviourWeight = [3.0,2.0,1.0];//hunt,attack,rangedAttack
function boss1_AI_action(){
	npc_boss_1.body.velocity.x = 0;
	npc_boss_1.body.velocity.y = 0;
	if(boss1CurrentActionIsDone){
		var distance = Math.round(gameNew.physics.arcade.distanceBetween(player,npc_boss_1));
		var fuzzySetDistanceBtnBossPlayer = fuzzySetDistance(distance);
		var fuzzySetHealthOfTheBoss = fuzzySetHealth(npc_boss_1_HP,[10,20,30,40]);
		var fuzzySetEnergyOfTheBoss = fuzzySetEnergy(boss1Energy);
		var DefuzzOutputHunt = BossHuntingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[0];
		var DefuzzOutputAttack = BossAttackingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[1];
		var DefuzzOutputRangedAttack = BossRangedAttackBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[2];
		var OutputSet = new Array(DefuzzOutputHunt,DefuzzOutputAttack,DefuzzOutputRangedAttack);
		boss1Behaviour = behaviour[findMaxIndex(OutputSet)];
		boss1CurrentActionIsDone=false;
		if(npc_boss_1.body.x>player.body.x)
			boss1IsLeftDirection = true;
		else
			boss1IsLeftDirection = false;
		// console.log("**************************************************");
		// console.log("Distance: "+distance+" Health: "+npc_boss_1_HP+" Energy: "+boss1Energy);
		// console.log("fuzzySetDistanceBtnBossPlayer: "+fuzzySetDistanceBtnBossPlayer);
		// console.log("fuzzySetHealthOfTheBoss: "+fuzzySetHealthOfTheBoss);
		// console.log("fuzzySetEnergyOfTheBoss: "+fuzzySetEnergyOfTheBoss);
		// console.log("DefuzzOutputHuntNoWeight: "+BossHuntingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		// console.log("DefuzzOutputHunt: "+DefuzzOutputHunt);
		// console.log("DefuzzOutputAttackNoWeight: "+BossAttackingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		// console.log("DefuzzOutputAttack: "+DefuzzOutputAttack);
		// console.log("DefuzzOutputRangedAttackNoWeight: "+BossRangedAttackBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		// console.log("DefuzzOutputRangedAttack: "+DefuzzOutputRangedAttack);
		// console.log("Defuzzified Output [\"Hunting\",\"Attacking\",\"RangedAttacking\"] :");
		// console.log(OutputSet);
		// console.log("Selected Behaviour: "+boss1Behaviour);
		// console.log("**************************************************");
	}
	if(boss1Behaviour=='Hunting'){//hunting
		var temp_dis=-2;
		if(boss1IsLeftDirection){
			npc_boss_1.animations.play('left',5,false);
		}else{
			npc_boss_1.animations.play('right',5,false);
		}
		gameNew.physics.arcade.moveToXY(npc_boss_1,player.body.x,player.body.y-65,boss1MoveSpeed);
		boss1CurrentActionIsDone=true;
	}else if(boss1Behaviour=='Attacking'){//Attacking
		if(Math.abs(npc_boss_1.body.y-player.body.y)<20||npc_boss_1.body.y<=player.body.y){
			if(boss1IsLeftDirection){
				audioBossAttack.play();
				npc_boss_1.animations.play('aleft',5,false);
			}else{
				audioBossAttack.play();
				npc_boss_1.animations.play('aright',5,false);
			}
		}else{//radius search fix

			if(npc_boss_1.body.x>player.body.x)
				boss1IsLeftDirection = true;
			else
				boss1IsLeftDirection = false;
			if(boss1IsLeftDirection){
				npc_boss_1.animations.play('left',5,false);
			}else{
				npc_boss_1.animations.play('right',5,false);
			}
			gameNew.physics.arcade.moveToXY(npc_boss_1,player.body.x,player.body.y-65,boss1MoveSpeed);
		}
	}else{//RangedAttacking
		if(boss1IsLeftDirection){
			audioBossAttack.play();
			npc_boss_1.animations.play('aleft',5,false);
		}else{
			audioBossAttack.play();
			npc_boss_1.animations.play('aright',5,false);
		}
		boss1Shooter1Count = 4;
		boss1Shooter2Count = 4;
	}
}
var boss2TargetX,boss2TargetY;
var boss2ReachTarget=true;
var boss2Firegun1Count,boss2Firegun2Count;
var startBoss2=false;
var boss2Energy = 4;
var boss2EnergyTimer;
var boss2Behaviour='RangedAttacking';
var boss2MoveSpeed = 115;
var Behaviour = ['Hunting','Attacking','RangedAttacking'];
var behaviourWeight = [3.0,2.0,1.0];//hunt,attack,rangedAttack
var bossFireStart=false;
function boss2_AI_action(){
	npc_boss_2.body.velocity.x = 0;
	npc_boss_2.body.velocity.y = 0;
	if(boss2CurrentActionIsDone){
		var distance = Math.round(gameNew.physics.arcade.distanceBetween(player,npc_boss_2));
		var fuzzySetDistanceBtnBossPlayer = fuzzySetDistance(distance);
		var fuzzySetHealthOfTheBoss = fuzzySetHealth(npc_boss_2_HP,[15,30,45,60]);
		var fuzzySetEnergyOfTheBoss = fuzzySetEnergy(boss2Energy);
		var DefuzzOutputHunt = BossHuntingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[0];
		var DefuzzOutputAttack = BossAttackingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[1];
		var DefuzzOutputRangedAttack = BossRangedAttackBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss) * behaviourWeight[2];
		var OutputSet = new Array(DefuzzOutputHunt,DefuzzOutputAttack,DefuzzOutputRangedAttack);
		boss2Behaviour = Behaviour[findMaxIndex(OutputSet)];
		boss2CurrentActionIsDone=false;
		if(npc_boss_2.body.x>player.body.x)
			boss2IsLeftDirection = true;
		else
			boss2IsLeftDirection = false;
		console.log("**************************************************");
		console.log("Distance: "+distance+" Health: "+npc_boss_2_HP+" Energy: "+boss2Energy);
		console.log("fuzzySetDistanceBtnBossPlayer: "+fuzzySetDistanceBtnBossPlayer);
		console.log("fuzzySetHealthOfTheBoss: "+fuzzySetHealthOfTheBoss);
		console.log("fuzzySetEnergyOfTheBoss: "+fuzzySetEnergyOfTheBoss);
		console.log("DefuzzOutputHuntNoWeight: "+BossHuntingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		console.log("DefuzzOutputHunt: "+DefuzzOutputHunt);
		console.log("DefuzzOutputAttackNoWeight: "+BossAttackingBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		console.log("DefuzzOutputAttack: "+DefuzzOutputAttack);
		console.log("DefuzzOutputRangedAttackNoWeight: "+BossRangedAttackBehaviour(fuzzySetDistanceBtnBossPlayer,fuzzySetHealthOfTheBoss,fuzzySetEnergyOfTheBoss));
		console.log("DefuzzOutputRangedAttack: "+DefuzzOutputRangedAttack);
		console.log("Defuzzified Output [\"Hunting\",\"Attacking\",\"RangedAttacking\"] :");
		console.log(OutputSet);
		console.log("Selected Behaviour: "+boss2Behaviour);
		console.log("**************************************************");
	}
	if(boss2Behaviour=='Hunting'){//hunting
		var temp_dis=-2;
		if(boss2IsLeftDirection){
			npc_boss_2.animations.play('left',5,false);
		}else{
			npc_boss_2.animations.play('right',5,false);
		}
		gameNew.physics.arcade.moveToXY(npc_boss_2,player.body.x,player.body.y-65,boss2MoveSpeed);
		boss2CurrentActionIsDone=true;
	}else if(boss2Behaviour=='Attacking'){//Attacking
		if(Math.abs(npc_boss_1.body.y-player.body.y)<25||npc_boss_2.body.y<=player.body.y){
			if(boss2IsLeftDirection){
				audioBossAttack.play();
				npc_boss_2.animations.play('aleft',8,false);
			}else{
				audioBossAttack.play();
				npc_boss_2.animations.play('aright',8,false);
			}
		}else{//radius search fix
			if(npc_boss_2.body.x>player.body.x)
				boss2IsLeftDirection = true;
			else
				boss2IsLeftDirection = false;
			if(boss2IsLeftDirection){
				npc_boss_2.animations.play('left',5,false);
			}else{
				npc_boss_2.animations.play('right',5,false);
			}
			gameNew.physics.arcade.moveToXY(npc_boss_2,player.body.x,player.body.y-65,boss2MoveSpeed);
		}
	}else{//RangedAttacking
		if(boss2IsLeftDirection){
			audioBossAttack.play();
			npc_boss_2.animations.play('aleft',5,false);
		}else{
			audioBossAttack.play();
			npc_boss_2.animations.play('aright',5,false);
		}
		boss2Shooter1Count = 4;
		boss2Shooter2Count = 4;
	}
}
function BossAttackingBehaviour(distance,safety,energy){
	var veryNear = distance[0];
	var safe = safety[2];
	var risky = safety[1];
	var dangerous = safety[0];
	var enough = energy[2];
	var fine = energy[1]
	var lacking = energy[0];
	//fuzzy rule
	var rule1 = new Array(veryNear,safe,enough);
	var rule2 = new Array(veryNear,safe,lacking);
	var rule3 = new Array(veryNear,safe,fine);
 	var rule4 = new Array(veryNear,risky,enough);
 	var rule5 = new Array(veryNear,risky,lacking);
 	var rule6 = new Array(veryNear,risky,fine);
  	var rule7 = new Array(veryNear,dangerous,lacking);
 	var rule1Output = findMin(rule1);
 	var rule2Output = findMin(rule2);
 	var rule3Output = findMin(rule3);
 	var rule4Output = findMin(rule4);
 	var rule5Output = findMin(rule5);
 	var rule6Output = findMin(rule6);
 	var rule7Output = findMin(rule7);
 	var allOutput = new Array(rule1Output,rule2Output,rule3Output,rule4Output,rule5Output,rule6Output,rule7Output);
 	return findMax(allOutput);
}
function BossHuntingBehaviour(distance,safety,energy){
	var near = distance[1];
	var far = distance[2];
	var veryFar = distance[3];
	var safe = safety[2];
	var risky = safety[1];
	var dangerous = safety[0];
	var enough = energy[2];
	var fine = energy[1];
	var lacking = energy[0];
	//fuzzy rule
	var rule1 = new Array(near,safe,enough);
	var rule2 = new Array(near,safe,lacking);
	var rule3 = new Array(near,safe,fine);
 	var rule4 = new Array(near,risky,enough);
 	var rule5 = new Array(near,risky,lacking);
 	var rule6 = new Array(near,risky,fine);
 	var rule7 = new Array(near,dangerous,lacking);
 	var rule8 = new Array(far,safe,enough);
	var rule9 = new Array(far,safe,lacking);
	var rule10 = new Array(far,safe,fine);
 	var rule11 = new Array(far,risky,enough);
 	var rule12 = new Array(far,risky,lacking);
 	var rule13 = new Array(far,risky,fine);
 	var rule14 = new Array(far,dangerous,lacking);
	var rule15 = new Array(veryFar,safe,lacking);
 	var rule16 = new Array(veryFar,risky,lacking);
 	var rule17 = new Array(veryFar,dangerous,lacking);
 	var rule1Output = findMin(rule1);
 	var rule2Output = findMin(rule2);
 	var rule3Output = findMin(rule3);
 	var rule4Output = findMin(rule4);
 	var rule5Output = findMin(rule5);
 	var rule6Output = findMin(rule6);
 	var rule7Output = findMin(rule7);
 	var rule8Output = findMin(rule8);
 	var rule9Output = findMin(rule9);
 	var rule10Output= findMin(rule10);
 	var rule11Output = findMin(rule11);
 	var rule12Output = findMin(rule12);
 	var rule13Output = findMin(rule13);
 	var rule14Output= findMin(rule14);
 	var rule15Output = findMin(rule15);
 	var rule16Output = findMin(rule16);
 	var rule17Output = findMin(rule17);
 	var allOutput = new Array(rule1Output,rule2Output,rule3Output,rule4Output,rule5Output,rule6Output,rule7Output,rule8Output,rule9Output,rule10Output,rule10Output,rule11Output,rule12Output,rule13Output,rule14Output,rule15Output,rule16Output,rule17Output);
 	return findMax(allOutput);
}
function BossRangedAttackBehaviour(distance,safety,energy){
	var near = distance[1];
	var far = distance[2];
	var veryFar = distance[3];
	var safe = safety[2];
	var risky = safety[1];
	var dangerous = safety[0];
	var enough = energy[2];
	var fine = energy[1];
	var lacking = energy[0];
	//fuzzy rule
	var rule1 = new Array(near,dangerous,enough);
	var rule2 = new Array(near,dangerous,fine);
	var rule3 = new Array(far,dangerous,enough);
 	var rule4 = new Array(far,dangerous,fine);
 	var rule5 = new Array(veryFar,safe,enough);
 	var rule6 = new Array(veryFar,risky,enough);
 	var rule7 = new Array(veryFar,dangerous,enough);
 	var rule8 = new Array(veryFar,safe,fine);
 	var rule9 = new Array(veryFar,risky,fine);
 	var rule10 = new Array(veryFar,dangerous,fine);
 	var rule1Output = findMin(rule1);
 	var rule2Output = findMin(rule2);
 	var rule3Output = findMin(rule3);
 	var rule4Output = findMin(rule4);
 	var rule5Output = findMin(rule5);
 	var rule6Output = findMin(rule6);
 	var rule7Output = findMin(rule7);
 	var rule8Output = findMin(rule8);
 	var rule9Output = findMin(rule9);
 	var rule10Output = findMin(rule10);
 	var allOutput = new Array(rule1Output,rule2Output,rule3Output,rule4Output,rule5Output,rule6Output,rule7Output,rule8Output,rule9Output,rule10Output);
 	return findMax(allOutput);
}
function findMin(x){
	var temp = x[0];
	for(var i = 1; i< x.length ;i++)
		if(x[i]<temp)
			temp = x[i]
	return temp;
}
function findMax(x){
	var temp = x[0];
	for(var i = 1; i< x.length ;i++)
		if(x[i]>temp)
			temp = x[i]
	return temp;
}
function findMaxIndex(x){
	var temp = x[0];
	var tempIndex = 0;
	for(var i = 1; i< x.length ;i++)
		if(x[i]>temp){
			temp = x[i];
			tempIndex = i;
		}
	return tempIndex;
}
function fuzzySetDistance(x){
	var result=[];
	var temp;
	//very near
	var x0 = 70.0, x1 = 120.0,x2,x3;
	if(x<=x0)
		temp=1.0;
	else if(x0<x&&x<x1)
		temp=-x/(x1-x0) + x1/(x1-x0);
	else
		temp=0.0;
	result.push(temp);
	x2 = 170.0; x3 = 220.0;
	//near
	if(x<=x0)
		temp=0.0;
	else if(x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else if(x1<=x&&x<=x2)
		temp = 1.0;
	else if(x2<x&&x<x3)
		temp=-x/(x3-x2) + x3/(x3-x2);
	else
		temp=0.0
	result.push(temp);
	x0 = x2; x1 = x3; x2 = 270.0; x3= 320.0;
	//far
	if(x<=x0)
		temp=0.0;
	else if(x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else if(x1<=x&&x<=x2)
		temp = 1.0;
	else if(x2<x&&x<x3)
		temp=-x/(x3-x2) + x3/(x3-x2);
	else
		temp=0.0
	result.push(temp);
	x0 = x2; x1 = x3;
	//very far
	if(x<=x0)
		temp=0.0;
	else if (x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else
		temp=1.0;

	result.push(temp);
	return result;
}
function fuzzySetHealth(x,y){
	var result=[];
	var temp;
	//dangerous
	var x0 = y[0]+0.0, x1 = y[1]+0.0,x2,x3;
	if(x<=x0)
		temp=1.0;
	else if(x0<x&&x<x1)
		temp=-x/(x1-x0) + x1/(x1-x0);
	else
		temp=0.0;
	result.push(temp);

	x2 = y[2]+0.0; x3 = y[3]+0.0;
	//risky
	if(x<=x0)
		temp=0.0;
	else if(x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else if(x1<=x&&x<=x2)
		temp = 1.0;
	else if(x2<x&&x<x3)
		temp=-x/(x3-x2) + x3/(x3-x2);
	else
		temp=0.0
	result.push(temp);
	x0 = x2; x1 = x3;
	//safe
	if(x<=x0)
		temp=0.0;
	else if (x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else
		temp=1.0;
	result.push(temp);
	return result;
}
function fuzzySetEnergy(x){
	var result=[];
	var temp;
	//lacking
	var x0 = 1.0, x1 = 2.0,x2,x3;
	if(x<=x0)
		temp=1.0;
	else if(x0<x&&x<x1)
		temp=-x/(x1-x0) + x1/(x1-x0);
	else
		temp=0.0;
	result.push(temp);

	x2 = 3.0; x3 = 4.0;
	//fine
	if(x<=x0)
		temp=0.0;
	else if(x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else if(x1<=x&&x<=x2)
		temp = 1.0;
	else if(x2<x&&x<x3)
		temp=-x/(x3-x2) + x3/(x3-x2);
	else
		temp=0.0
	result.push(temp);
	x0 = x2; x1 = x3;
	//enough
	if(x<=x0)
		temp=0.0;
	else if (x0<x&&x<x1)
		temp=x/(x1-x0) - x0/(x1-x0);
	else
		temp=1.0;
	result.push(temp);
	return result;
}
function levelup(){
	if(!creationMutex&&doorIsOpened){
		creationMutex=true;
		creation = false;
		currentLevel++;

	}
}

var HealthBar = function(game, providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 250,
        height: 40,
        x: 0,
        y: 0,
        bg: {
            color: '#665443'
        },
        bar: {
            color: '#50d361'
        },
        animationDuration: 200,
        flipped: false,
        isFixedToCamera: false
    };

    return mergeObjetcs(defaultConfig, newConfig);
};

function mergeObjetcs(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjetcs(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

HealthBar.prototype.drawBackground = function() {

    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bg.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

HealthBar.prototype.drawHealthBar = function() {
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    bmd.ctx.fillStyle = this.config.bar.color;
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, this.config.width, this.config.height);
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x - this.bgSprite.width/2, this.y, bmd);
    this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};

HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
};

HealthBar.prototype.kill = function() {
    this.bgSprite.kill();
    this.barSprite.kill();
};

var allFires;
function fireGuns1StartFire() {
	for(var i = 0;i<6;i++){
		if(Math.round(player.body.x)>=fireGunsSetx01[i]&&Math.round(player.body.x)<=fireGunsSetx11[i]&&Math.round(player.body.y)>=fireGunsSety01[i]&&Math.round(player.body.y)<=fireGunsSety11[i]){
			if(!fireGunsTrigger1[i]){
				fireGunsTrigger1[i]=true;
				var fire = allFires.create(fireGunsSetx11[i]-80,fireGunsSety11[i]+25,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,2.5);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 270;
				fireStart.onComplete.add(fireStop1,this);
				fireStart.onStart.add(fireStart1, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop1(sprite, animation){
	var i = Math.floor((sprite.body.y - 227 )/42)
	fireGunsTrigger1[i]=false;
	sprite.kill();
}
function fireStart1(sprite, animation){
	var i = Math.floor((sprite.body.y - 227 )/42)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx01[i]&&Math.round(player.body.x)<=fireGunsSetx11[i]&&Math.round(player.body.y)>=fireGunsSety01[i]&&Math.round(player.body.y)<=fireGunsSety11[i])
			if(!restart)
				restartScreen();
	 }, 350);
}
function fireGuns2StartFire() {
	for(var i = 0;i<12;i++){
		if(Math.round(player.body.x)>=fireGunsSetx02[i]&&Math.round(player.body.x)<=fireGunsSetx12[i]&&Math.round(player.body.y)>=fireGunsSety02[i]&&Math.round(player.body.y)<=fireGunsSety12[i]){
			if(!fireGunsTrigger2[i]){
				fireGunsTrigger2[i]=true;
				var fire = allFires.create(fireGunsSetx02[i]+58,fireGunsSety02[i]+95,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,2);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 180;
				fireStart.onComplete.add(fireStop2,this);
				fireStart.onStart.add(fireStart2, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop2(sprite, animation){
	var i = Math.floor((sprite.body.x - 188 )/47)
	fireGunsTrigger2[i]=false;
	sprite.kill();
}
function fireStart2(sprite, animation){
	var i = Math.floor((sprite.body.x - 188 )/47)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx02[i]&&Math.round(player.body.x)<=fireGunsSetx12[i]&&Math.round(player.body.y)>=fireGunsSety02[i]&&Math.round(player.body.y)<=fireGunsSety12[i])
			if(!restart)
				restartScreen();
	 }, 350);
}
function fireGuns3StartFire() {
	for(var i = 0;i<5;i++){
		if(Math.round(player.body.x)>=fireGunsSetx03[i]&&Math.round(player.body.x)<=fireGunsSetx13[i]&&Math.round(player.body.y)>=fireGunsSety03[i]&&Math.round(player.body.y)<=fireGunsSety13[i]){
			if(!fireGunsTrigger3[i]){
				fireGunsTrigger3[i]=true;
				var fire = allFires.create(fireGunsSetx13[i]+38,fireGunsSety13[i]-55,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,2.5);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 90;
				fireStart.onComplete.add(fireStop3,this);
				fireStart.onStart.add(fireStart3, this);
				fire.animations.play('fire',5,false);
			}
		}
	}
}
function fireStop3(sprite, animation){
	var i = Math.floor((sprite.body.y - 147 )/42)
	fireGunsTrigger3[i]=false;
	sprite.kill();
}
function fireStart3(sprite, animation){
	var i = Math.floor((sprite.body.y - 147 )/42)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx03[i]&&Math.round(player.body.x)<=fireGunsSetx13[i]&&Math.round(player.body.y)>=fireGunsSety03[i]&&Math.round(player.body.y)<=fireGunsSety13[i])
			if(!restart)
				restartScreen();
	 }, 350);
}
function fireGuns4StartFire() {
	for(var i = 0;i<9;i++){
		if(Math.round(player.body.x)>=fireGunsSetx04[i]&&Math.round(player.body.x)<=fireGunsSetx14[i]&&Math.round(player.body.y)>=fireGunsSety04[i]&&Math.round(player.body.y)<=fireGunsSety14[i]){
			if(!fireGunsTrigger4[i]){
				fireGunsTrigger4[i]=true;
				var fire = allFires.create(fireGunsSetx04[i]+58,fireGunsSety04[i]+95,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,2);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 180;
				fireStart.onComplete.add(fireStop4,this);
				fireStart.onStart.add(fireStart4, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop4(sprite, animation){
	var i = Math.floor((sprite.body.x - 329 )/47)
	fireGunsTrigger4[i]=false;
	sprite.kill();
}
function fireStart4(sprite, animation){
	var i = Math.floor((sprite.body.x - 329 )/47)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx04[i]&&Math.round(player.body.x)<=fireGunsSetx14[i]&&Math.round(player.body.y)>=fireGunsSety04[i]&&Math.round(player.body.y)<=fireGunsSety14[i])
			if(!restart)
				restartScreen();
	 }, 350);
}
function fireGuns5StartFire() {
	for(var i = 0;i<8;i++){
		if(Math.round(player.body.x)>=fireGunsSetx05[i]&&Math.round(player.body.x)<=fireGunsSetx15[i]&&Math.round(player.body.y)>=fireGunsSety05[i]&&Math.round(player.body.y)<=fireGunsSety15[i]){
			if(!fireGunsTrigger5[i]){
				fireGunsTrigger5[i]=true;
				var fire = allFires.create(fireGunsSetx05[i]-25,fireGunsSety05[i],'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,1.5);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 0;
				fireStart.onComplete.add(fireStop5,this);
				fireStart.onStart.add(fireStart5, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop5(sprite, animation){
	var i = Math.floor((sprite.body.x - 293 )/47)
	fireGunsTrigger5[i]=false;
	sprite.kill();
}
function fireStart5(sprite, animation){
	var i = Math.floor((sprite.body.x - 293 )/47)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx05[i]&&Math.round(player.body.x)<=fireGunsSetx15[i]&&Math.round(player.body.y)>=fireGunsSety05[i]&&Math.round(player.body.y)<=fireGunsSety15[i])
			if(!restart)
			restartScreen();
	 }, 350);
}
function fireGuns6StartFire() {
	for(var i = 0;i<6;i++){
		if(Math.round(player.body.x)>=fireGunsSetx06[i]&&Math.round(player.body.x)<=fireGunsSetx16[i]&&Math.round(player.body.y)>=fireGunsSety06[i]&&Math.round(player.body.y)<=fireGunsSety16[i]){
			if(!fireGunsTrigger6[i]){
				fireGunsTrigger6[i]=true;
				var fire = allFires.create(fireGunsSetx06[i]-23,fireGunsSety06[i]+5,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,1.5);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 0;
				fireStart.onComplete.add(fireStop6,this);
				fireStart.onStart.add(fireStart6, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop6(sprite, animation){
	var i = Math.floor((sprite.body.x - 389 )/47)
	fireGunsTrigger6[i]=false;
	sprite.kill();
}
function fireStart6(sprite, animation){
	var i = Math.floor((sprite.body.x - 389 )/47)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx06[i]&&Math.round(player.body.x)<=fireGunsSetx16[i]&&Math.round(player.body.y)>=fireGunsSety06[i]&&Math.round(player.body.y)<=fireGunsSety16[i])
			if(!restart)
			restartScreen();
	 }, 350);
}
function fireGuns7StartFire() {
	for(var i = 0;i<7;i++){
		if(Math.round(player.body.x)>=fireGunsSetx07[i]&&Math.round(player.body.x)<=fireGunsSetx17[i]&&Math.round(player.body.y)>=fireGunsSety07[i]&&Math.round(player.body.y)<=fireGunsSety17[i]){
			if(!fireGunsTrigger7[i]){
				fireGunsTrigger7[i]=true;
				var fire = allFires.create(fireGunsSetx17[i]-80,fireGunsSety17[i]+25,'spritesheet','trap/fire/0001');
				fire.scale.setTo(2,2.5);
				var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
				fire.body.allowRotation = true;
				fire.body.rotation = 270;
				fireStart.onComplete.add(fireStop7,this);
				fireStart.onStart.add(fireStart7, this);
				fire.animations.play('fire',5,false);

			}
		}
	}
}
function fireStop7(sprite, animation){
	var i = Math.floor((sprite.body.y - 185 )/42)
	fireGunsTrigger7[i]=false;
	sprite.kill();
}
function fireStart7(sprite, animation){
	var i = Math.floor((sprite.body.y - 185 )/42)
	setTimeout(function(){
		if(Math.round(player.body.x)>=fireGunsSetx07[i]&&Math.round(player.body.x)<=fireGunsSetx17[i]&&Math.round(player.body.y)>=fireGunsSety07[i]&&Math.round(player.body.y)<=fireGunsSety17[i])
			if(!restart)
			restartScreen();
	 }, 350);
}
var fireGun8Timer;
function fireGuns8StartFire() {
	var fire = allFires.create(540,100,'spritesheet','trap/fire/0001');
	fire.scale.setTo(2,2.5);
	var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire.body.allowRotation = true;
	fire.body.rotation = 90;
	fireStart.onComplete.add(fireStop8,this);
	fireStart.onStart.add(fireStart8, this);
	fire.animations.play('fire',5,false);
	fireGun8Timer = gameNew.time.now + 3000;
}
function fireStop8(sprite, animation){
	sprite.kill();
}
function fireStart8(sprite, animation){
	setTimeout(function(){
		if(Math.round(player.body.x)>=430&&Math.round(player.body.x)<=483&&Math.round(player.body.y)>=118&&Math.round(player.body.y)<=150)
			if(!restart)
			restartScreen();
	 }, 350);
}
function fireGuns9StartFire() {
	var fire = allFires.create(370,250,'spritesheet','environment/block');
	fire.scale.setTo(2.5,2.5);
	var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire.body.allowRotation = true;
	fire.body.rotation = 90;
	fireStart.onComplete.add(fireStop9,this);
	fireStart.onStart.add(fireStart9, this);

	var fire2 = allFires.create(190,170,'spritesheet','environment/block');
	fire2.scale.setTo(2.5,2.5);
	var fireStart2 = fire2.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire2.body.allowRotation = true;
	fire2.body.rotation = 0;
	fireStart2.onComplete.add(fireStop9,this);
	fireStart2.onStart.add(fireStart9, this);

	var fire3 = allFires.create(110,355,'spritesheet','environment/block');
	fire3.scale.setTo(2.5,2.5);
	var fireStart3 = fire3.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire3.body.allowRotation = true;
	fire3.body.rotation = 270;
	fireStart3.onComplete.add(fireStop9,this);
	fireStart3.onStart.add(fireStart9, this);

	var fire4 = allFires.create(295,430,'spritesheet','environment/block');
	fire4.scale.setTo(2.5,2.5);
	var fireStart4 = fire4.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire4.body.allowRotation = true;
	fire4.body.rotation = 180;
	fireStart4.onComplete.add(fireStop9,this);
	fireStart4.onStart.add(fireStart9, this);
	setTimeout(function(){
		fire.animations.play('fire',5,false);
		fire2.animations.play('fire',5,false);
		fire3.animations.play('fire',5,false);
		fire4.animations.play('fire',5,false);
	}, 400);
}
function fireStop9(sprite, animation){
	sprite.kill();
	bossFireStart=false;
}
function fireStart9(sprite, animation){
	setTimeout(function(){
		if(Math.round(player.body.x)>=267&&Math.round(player.body.x)<=338&&Math.round(player.body.y)>=250&&Math.round(player.body.y)<=310)
			if(!restart)
			restartScreen();
		else if(Math.round(player.body.x)>=210&&Math.round(player.body.x)<=245&&Math.round(player.body.y)>=150&&Math.round(player.body.y)<=248){
			if(!restart)
			restartScreen();
		}else if(Math.round(player.body.x)>=100&&Math.round(player.body.x)<=195&&Math.round(player.body.y)>=255&&Math.round(player.body.y)<=305){
			if(!restart)
			restartScreen();
		}else if(Math.round(player.body.x)>=210&&Math.round(player.body.x)<=250&&Math.round(player.body.y)>=312&&Math.round(player.body.y)<=400){
			if(!restart)
			restartScreen();
		}

	 }, 350);
}
function fireGuns10StartFire() {
	var fire = allFires.create(870,250,'spritesheet','environment/block');
	fire.scale.setTo(2.5,2.5);
	var fireStart = fire.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire.body.allowRotation = true;
	fire.body.rotation = 90;
	fireStart.onComplete.add(fireStop9,this);
	fireStart.onStart.add(fireStart9, this);

	var fire2 = allFires.create(690,170,'spritesheet','environment/block');
	fire2.scale.setTo(2.5,2.5);
	var fireStart2 = fire2.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire2.body.allowRotation = true;
	fire2.body.rotation = 0;
	fireStart2.onComplete.add(fireStop9,this);
	fireStart2.onStart.add(fireStart9, this);

	var fire3 = allFires.create(610,355,'spritesheet','environment/block');
	fire3.scale.setTo(2.5,2.5);
	var fireStart3 = fire3.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire3.body.allowRotation = true;
	fire3.body.rotation = 270;
	fireStart3.onComplete.add(fireStop9,this);
	fireStart3.onStart.add(fireStart9, this);

	var fire4 = allFires.create(795,430,'spritesheet','environment/block');
	fire4.scale.setTo(2.5,2.5);
	var fireStart4 = fire4.animations.add('fire', Phaser.Animation.generateFrameNames('trap/fire/', 1, 8, '', 4), 10, true, false);
	fire4.body.allowRotation = true;
	fire4.body.rotation = 180;
	fireStart4.onComplete.add(fireStop9,this);
	fireStart4.onStart.add(fireStart9, this);
	setTimeout(function(){
		fire.animations.play('fire',5,false);
		fire2.animations.play('fire',5,false);
		fire3.animations.play('fire',5,false);
		fire4.animations.play('fire',5,false);
	}, 400);
}
function fireStop10(sprite, animation){
	sprite.kill();
	bossFireStart=false;
}
function fireStart10(sprite, animation){
	setTimeout(function(){
		if(Math.round(player.body.x)>=767&&Math.round(player.body.x)<=838&&Math.round(player.body.y)>=250&&Math.round(player.body.y)<=310)
			console.log('Dead!');
		else if(Math.round(player.body.x)>=710&&Math.round(player.body.x)<=745&&Math.round(player.body.y)>=150&&Math.round(player.body.y)<=248){
			console.log('Dead!');
		}else if(Math.round(player.body.x)>=600&&Math.round(player.body.x)<=695&&Math.round(player.body.y)>=255&&Math.round(player.body.y)<=305){
			console.log('Dead!');
		}else if(Math.round(player.body.x)>=710&&Math.round(player.body.x)<=750&&Math.round(player.body.y)>=312&&Math.round(player.body.y)<=400){
			console.log('Dead!');
		}
	}, 350);
}
var fireTimeInterval = 1500;
function shooter1Fires(){
	knife11 = knifes1.getFirstExists(false);
	if(knife11){
		knife11.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife11.body.allowRotation = true;
		knife11.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife11,shooter1.body.x+48/2,540-48)//speed time

	}
	knife12 = knifes1.getFirstExists(false);
	if(knife12){
		knife12.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife12.body.allowRotation = true;
		knife12.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife12,0,shooter1.body.y+60)//speed time
	}
	knife13 = knifes1.getFirstExists(false);
	if(knife13){
		knife13.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife13.body.allowRotation = true;
		knife13.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife13,960,shooter1.body.y+60)//speed time
	}
	knife14 = knifes1.getFirstExists(false);
	if(knife14){
		knife14.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife14.body.allowRotation = true;
		knife14.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife14,shooter1.body.x+48/2,0)//speed time
	}
	firingTimer1 = gameNew.time.now + fireTimeInterval;
}
function shooter2Fires(){
	knife21 = knifes2.getFirstExists(false);
	if(knife21){
		knife21.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife21.body.allowRotation = true;
		knife21.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife21,shooter2.body.x+48/2,540-48)//speed time
	}
	knife22 = knifes2.getFirstExists(false);
	if(knife22){
		knife22.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife22.body.allowRotation = true;
		knife22.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife22,0,shooter2.body.y+60)//speed time
	}
	knife23 = knifes2.getFirstExists(false);
	if(knife23){
		knife23.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife23.body.allowRotation = true;
		knife23.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife23,960,shooter2.body.y+60)//speed time
	}
	knife24 = knifes2.getFirstExists(false);
	if(knife24){
		knife24.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife24.body.allowRotation = true;
		knife24.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife24,shooter2.body.x+48/2,0)//speed time
	}
	firingTimer2 = gameNew.time.now + fireTimeInterval;
}
function shooter3Fires(){
	knife31 = knifes3.getFirstExists(false);
	if(knife31){
		knife31.reset(shooter3.body.x+48/2,shooter3.body.y+60);
		knife31.body.allowRotation = true;
		knife31.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife31,shooter3.body.x+48/2,540-48)//speed time
	}
	knife32 = knifes3.getFirstExists(false);
	if(knife32){
		knife32.reset(shooter3.body.x+48/2,shooter3.body.y+60);
		knife32.body.allowRotation = true;
		knife32.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife32,0,shooter3.body.y+60)//speed time
	}
	knife33 = knifes3.getFirstExists(false);
	if(knife33){
		knife33.reset(shooter3.body.x+48/2,shooter3.body.y+60);
		knife33.body.allowRotation = true;
		knife33.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife33,960,shooter3.body.y+60)//speed time
	}
	knife34 = knifes3.getFirstExists(false);
	if(knife34){
		knife34.reset(shooter3.body.x+48/2,shooter3.body.y+60);
		knife34.body.allowRotation = true;
		knife34.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife34,shooter3.body.x+48/2,0)//speed time
	}
	firingTimer3 = gameNew.time.now + fireTimeInterval;
}
function shooter4Fires(){
	knife41 = knifes4.getFirstExists(false);
	if(knife41){
		knife41.reset(shooter4.body.x+48/2,shooter4.body.y+60);
		knife41.body.allowRotation = true;
		knife41.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife41,shooter4.body.x+48/2,540-48)//speed time
	}
	knife42 = knifes4.getFirstExists(false);
	if(knife42){
		knife42.reset(shooter4.body.x+48/2,shooter4.body.y+60);
		knife42.body.allowRotation = true;
		knife42.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife42,0,shooter4.body.y+60)//speed time
	}
	knife43 = knifes4.getFirstExists(false);
	if(knife43){
		knife43.reset(shooter4.body.x+48/2,shooter4.body.y+60);
		knife43.body.allowRotation = true;
		knife43.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife43,960,shooter4.body.y+60)//speed time
	}
	knife44 = knifes4.getFirstExists(false);
	if(knife44){
		knife44.reset(shooter4.body.x+48/2,shooter4.body.y+60);
		knife44.body.allowRotation = true;
		knife44.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife44,shooter4.body.x+48/2,0)//speed time
	}
	firingTimer4 = gameNew.time.now + fireTimeInterval;
}
function shooter5Fires(){
	knife51 = knifes5.getFirstExists(false);
	if(knife51){
		knife51.reset(shooter5.body.x+48/2,shooter5.body.y+60);
		knife51.body.allowRotation = true;
		knife51.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife51,shooter5.body.x+48/2,540-48)//speed time
	}
	knife52 = knifes5.getFirstExists(false);
	if(knife52){
		knife52.reset(shooter5.body.x+48/2,shooter5.body.y+60);
		knife52.body.allowRotation = true;
		knife52.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife52,0,shooter5.body.y+60)//speed time
	}
	knife53 = knifes5.getFirstExists(false);
	if(knife53){
		knife53.reset(shooter5.body.x+48/2,shooter5.body.y+60);
		knife53.body.allowRotation = true;
		knife53.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife53,960,shooter5.body.y+60)//speed time
	}
	knife54 = knifes5.getFirstExists(false);
	if(knife54){
		knife54.reset(shooter5.body.x+48/2,shooter5.body.y+60);
		knife54.body.allowRotation = true;
		knife54.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife54,shooter5.body.x+48/2,0)//speed time
	}
	firingTimer5 = gameNew.time.now + fireTimeInterval;
}
function shooter6Fires(){
	knife61 = knifes6.getFirstExists(false);
	if(knife61){
		knife61.reset(shooter6.body.x+48/2,shooter6.body.y+60);
		knife61.body.allowRotation = true;
		knife61.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife61,shooter6.body.x+48/2,540-48)//speed time
	}
	knife62 = knifes6.getFirstExists(false);
	if(knife62){
		knife62.reset(shooter6.body.x+48/2,shooter6.body.y+60);
		knife62.body.allowRotation = true;
		knife62.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife62,0,shooter6.body.y+60)//speed time
	}
	knife63 = knifes6.getFirstExists(false);
	if(knife63){
		knife63.reset(shooter6.body.x+48/2,shooter6.body.y+60);
		knife63.body.allowRotation = true;
		knife63.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife63,960,shooter6.body.y+60)//speed time
	}
	knife64 = knifes6.getFirstExists(false);
	if(knife64){
		knife64.reset(shooter6.body.x+48/2,shooter6.body.y+60);
		knife64.body.allowRotation = true;
		knife64.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife64,shooter6.body.x+48/2,0)//speed time
	}
	firingTimer6 = gameNew.time.now + fireTimeInterval;
}
function shooter7Fires(){
	knife71 = knifes7.getFirstExists(false);
	if(knife71){
		knife71.reset(shooter7.body.x+48/2,shooter7.body.y+60);
		knife71.body.allowRotation = true;
		knife71.body.rotation = 270;
		gameNew.physics.arcade.moveToXY(knife71,shooter7.body.x+48/2,540-48)//speed time
	}
	knife72 = knifes7.getFirstExists(false);
	if(knife72){
		knife72.reset(shooter7.body.x+48/2,shooter7.body.y+60);
		knife72.body.allowRotation = true;
		knife72.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife72,0,shooter7.body.y+60)//speed time
	}
	knife73 = knifes7.getFirstExists(false);
	if(knife73){
		knife73.reset(shooter7.body.x+48/2,shooter7.body.y+60);
		knife73.body.allowRotation = true;
		knife73.body.rotation = 180;
		gameNew.physics.arcade.moveToXY(knife73,960,shooter7.body.y+60)//speed time
	}
	knife74 = knifes7.getFirstExists(false);
	if(knife74){
		knife74.reset(shooter7.body.x+48/2,shooter7.body.y+60);
		knife74.body.allowRotation = true;
		knife74.body.rotation = 90;
		gameNew.physics.arcade.moveToXY(knife74,shooter7.body.x+48/2,0)//speed time
	}
	firingTimer7 = gameNew.time.now + fireTimeInterval;
}
function shooter1Fires2(){
	knife11 = knifes1.getFirstExists(false);
	if(knife11){
		knife11.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife11.body.allowRotation = true;
		if(player.body.x>shooter1.body.x)
			knife11.body.rotation = 180+Math.atan((player.body.y-shooter1.body.y)/(player.body.x-shooter1.body.x))*180/Math.PI;
		else
			knife11.body.rotation = Math.atan((shooter1.body.y-player.body.y)/(shooter1.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife11,player.body.x+15,player.body.y+21);
	}
	firingTimer1 = gameNew.time.now + fireTimeInterval;
}
function shooter2Fires2(){
	knife21 = knifes2.getFirstExists(false);
	if(knife21){
		knife21.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife21.body.allowRotation = true;
		if(player.body.x>shooter2.body.x)
			knife21.body.rotation = 180+Math.atan((player.body.y-shooter2.body.y)/(player.body.x-shooter2.body.x))*180/Math.PI;
		else
			knife21.body.rotation = Math.atan((shooter2.body.y-player.body.y)/(shooter2.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife21,player.body.x+15,player.body.y+21);
	}
	firingTimer2 = gameNew.time.now + fireTimeInterval;
}
function shooter3Fires2(){
	knife31 = knifes3.getFirstExists(false);
	if(knife31){
		knife31.reset(shooter3.body.x+48/2,shooter3.body.y+60);
		knife31.body.allowRotation = true;
		if(player.body.x>shooter3.body.x)
			knife31.body.rotation = 180+Math.atan((player.body.y-shooter2.body.y)/(player.body.x-shooter3.body.x))*180/Math.PI;
		else
			knife31.body.rotation = Math.atan((shooter3.body.y-player.body.y)/(shooter3.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife31,player.body.x+15,player.body.y+21);
	}
	firingTimer3 = gameNew.time.now + fireTimeInterval;
}
function shooter4Fires2(){
	knife41 = knifes4.getFirstExists(false);
	if(knife41){
		knife41.reset(shooter4.body.x+48/2,shooter4.body.y+60);
		knife41.body.allowRotation = true;
		if(player.body.x>shooter4.body.x)
			knife41.body.rotation = 180+Math.atan((player.body.y-shooter4.body.y)/(player.body.x-shooter4.body.x))*180/Math.PI;
		else
			knife41.body.rotation = Math.atan((shooter4.body.y-player.body.y)/(shooter4.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife41,player.body.x+15,player.body.y+21);
	}
	firingTimer4 = gameNew.time.now + fireTimeInterval;
}
function shooter1Fires3(){
	knife11 = knifes1.getFirstExists(false);
	if(knife11){
		knife11.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife11.body.allowRotation = true;
		knife11.body.rotation = 0;
		gameNew.physics.arcade.moveToXY(knife11,02,shooter1.body.y+60)//speed time

	}
	firingTimer1 = gameNew.time.now + 3500;
}
function shooter1Fires4(){
	knife11 = knifes1.getFirstExists(false);
	if(knife11){
		knife11.reset(shooter1.body.x+48/2,shooter1.body.y+60);
		knife11.body.allowRotation = true;
		if(player.body.x>shooter1.body.x)
			knife11.body.rotation = 180+Math.atan((player.body.y-shooter1.body.y)/(player.body.x-shooter1.body.x))*180/Math.PI;
		else
			knife11.body.rotation = Math.atan((shooter1.body.y-player.body.y)/(shooter1.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife11,player.body.x+15,player.body.y+21)//speed time

	}
	firingTimer1 = gameNew.time.now + 1000;
}
function shooter2Fires4(){
	knife21 = knifes2.getFirstExists(false);
	if(knife21){
		knife21.reset(shooter2.body.x+48/2,shooter2.body.y+60);
		knife21.body.allowRotation = true;
		if(player.body.x>shooter1.body.x)
			knife21.body.rotation = 180+Math.atan((player.body.y-shooter2.body.y)/(player.body.x-shooter2.body.x))*180/Math.PI;
		else
			knife21.body.rotation = Math.atan((shooter2.body.y-player.body.y)/(shooter2.body.x-player.body.x))*180/Math.PI;
		gameNew.physics.arcade.moveToXY(knife21,player.body.x+15,player.body.y+21)//speed time

	}
	firingTimer2 = gameNew.time.now + 1000;
}
function knifeHitsPlayer(player,knife){
	if(gameNew.physics.arcade.distanceBetween(knife,player)<20){
		if(!restart)
			restartScreen();
	}
}
function knifeHitsWall(knife,wall){
	knife.kill();
	//
}
function knifeHitsWall2(wall,knife){
	knife.kill();
	//
}
var onAttackLeft,onAttackRight;
var onDieLeft,onDieRight;
function playerControll(){
	// player.body.bounce.set(1);

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;
	// player.body.acceleration = 0;
	if(z.isDown||onAttackLeft||onAttackRight){
		player.body.bounce.set(2);
		if(playerIsLeftDirection){
			if(!onAttackLeft){
				audioStab.play();
				player.animations.play('aleft',10,false);
			}
		}
		else{
			if(!onAttackRight){
				audioStab.play();
				player.animations.play('aright',10,false);
			}
		}
	}
	else if(cursors.up.isDown&&cursors.left.isDown){
		player.body.velocity.x = -moverSpeed;
		player.body.velocity.y = -moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);

	}else if(cursors.down.isDown&&cursors.left.isDown){
		player.body.velocity.x = -moverSpeed;
		player.body.velocity.y = moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);
	}else if(cursors.up.isDown&&cursors.right.isDown){
		player.body.velocity.x = moverSpeed;
		player.body.velocity.y = -moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);
	}else if(cursors.down.isDown&&cursors.right.isDown){
		player.body.velocity.x = moverSpeed;
		player.body.velocity.y = moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);
	}else if(cursors.up.isDown){
		player.body.velocity.y = -moverSpeed;
		if(playerIsLeftDirection)
			player.animations.play('left',false);
		else
			player.animations.play('right',false);

	}
	else if(cursors.down.isDown){
		player.body.velocity.y = moverSpeed;
		if(playerIsLeftDirection)
			player.animations.play('left',false);
		else
			player.animations.play('right',false);

	}
	else if (cursors.left.isDown)
    {
    	player.body.velocity.x = -moverSpeed;
        playerIsLeftDirection = true;
        player.animations.play('left',false);

    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = moverSpeed;
        playerIsLeftDirection = false;
        player.animations.play('right',false);

    }
    else
    {

        player.animations.stop();
        if(playerIsLeftDirection){
        	if(!restart)
        		player.frame = 0;
        	else
        		player.frame = 11;

        }
        else {
        	if(!restart)
        		player.frame = 12;
        	else
        		player.frame = 16;
        }

    }
}
function shooterSetUp1(){
		if(shooter1!=null)shooter1.kill();
	    if(shooter2!=null)shooter2.kill();
	    if(shooter3!=null)shooter3.kill();
	    if(shooter4!=null)shooter4.kill();
	    if(shooter5!=null)shooter5.kill();
	    if(shooter6!=null)shooter6.kill();
	    if(shooter7!=null)shooter7.kill();
	    if(block1!=null)block1.kill();
	    if(block2!=null)block2.kill();
	    if(block3!=null)block3.kill();
	    if(block4!=null)block4.kill();
	    if(block5!=null)block5.kill();
	    if(block6!=null)block6.kill();
	    if(block7!=null)block7.kill();
	    shooter1X = 80,shooter1Y =150,
		shooter2X = 200,shooter2Y=320,
		shooter3X = 320,shooter3Y=150,
		shooter4X = 440,shooter4Y=320,
		shooter5X = 560,shooter5Y=150,
		shooter6X = 680,shooter6Y=320,
		shooter7X = 800,shooter7Y=150;
		blocks1 = gameNew.add.group();
		blocks1.enableBody = true;
	    blocks2 = gameNew.add.group();
		blocks2.enableBody = true;
	    blocks3 = gameNew.add.group();
		blocks3.enableBody = true;
	    blocks4 = gameNew.add.group();
		blocks4.enableBody = true;
	    blocks5 = gameNew.add.group();
		blocks5.enableBody = true;
	    blocks6 = gameNew.add.group();
		blocks6.enableBody = true;
	    blocks7 = gameNew.add.group();
		blocks7.enableBody = true;
		//blocks
	   	block3 = blocks1.create(shooter3X,shooter3Y+48,'spritesheet','environment/block1');

	   	block4 = blocks2.create(shooter4X,shooter4Y+48,'spritesheet','environment/block1');

	   	block1 = blocks3.create(shooter1X,shooter1Y+48,'spritesheet','environment/block1');
	   	block5 = blocks3.create(shooter5X,shooter5Y+48,'spritesheet','environment/block1');

	   	block2 = blocks4.create(shooter2X,shooter2Y+48,'spritesheet','environment/block1');
	   	block6 = blocks4.create(shooter6X,shooter6Y+48,'spritesheet','environment/block1');

	   	block3 = blocks5.create(shooter3X,shooter3Y+48,'spritesheet','environment/block1');
	   	block7 = blocks5.create(shooter7X,shooter7Y+48,'spritesheet','environment/block1');

	   	block4 = blocks6.create(shooter4X,shooter4Y+48,'spritesheet','environment/block1');

	   	block5 = blocks7.create(shooter5X,shooter5Y+48,'spritesheet','environment/block1');

	    shooter1 = gameNew.add.sprite(shooter1X,shooter1Y,'spritesheet','environment/wall2');
	    shooter2 = gameNew.add.sprite(shooter2X,shooter2Y,'spritesheet','environment/wall2');
	    shooter3 = gameNew.add.sprite(shooter3X,shooter3Y,'spritesheet','environment/wall2');
	    shooter4 = gameNew.add.sprite(shooter4X,shooter4Y,'spritesheet','environment/wall2');
	    shooter5 = gameNew.add.sprite(shooter5X,shooter5Y,'spritesheet','environment/wall2');
	    shooter6 = gameNew.add.sprite(shooter6X,shooter6Y,'spritesheet','environment/wall2');
	    shooter7 = gameNew.add.sprite(shooter7X,shooter7Y,'spritesheet','environment/wall2');
	    gameNew.physics.enable(shooter1,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter2,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter3,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter4,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter5,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter6,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter7,Phaser.Physics.ARCADE);
	    shooter1.enableBody = true;
	    shooter2.enableBody = true;
	    shooter3.enableBody = true;
	    shooter4.enableBody = true;
	    shooter5.enableBody = true;
	    shooter6.enableBody = true;
	    shooter7.enableBody = true;
	    gameNew.physics.enable(block1, Phaser.Physics.ARCADE);
	    block1.body.collideWorldBounds = true;
		block1.body.bounce.set(0.5);
	    block1.body.immovable = true;
	    gameNew.physics.enable(block2, Phaser.Physics.ARCADE);
	    block2.body.collideWorldBounds = true;
		block2.body.bounce.set(0.5);
	    block2.body.immovable = true;
	    gameNew.physics.enable(block3, Phaser.Physics.ARCADE);
	    block3.body.collideWorldBounds = true;
		block3.body.bounce.set(0.5);
	    block3.body.immovable = true;
	    gameNew.physics.enable(block4, Phaser.Physics.ARCADE);
	    block4.body.collideWorldBounds = true;
		block4.body.bounce.set(0.5);
	    block4.body.immovable = true;
	    gameNew.physics.enable(block5, Phaser.Physics.ARCADE);
	    block5.body.collideWorldBounds = true;
		block5.body.bounce.set(0.5);
	    block5.body.immovable = true;
	    gameNew.physics.enable(block6, Phaser.Physics.ARCADE);
	    block6.body.collideWorldBounds = true;
		block6.body.bounce.set(0.5);
	    block6.body.immovable = true;
	    gameNew.physics.enable(block7, Phaser.Physics.ARCADE);
	    block7.body.collideWorldBounds = true;
		block7.body.bounce.set(0.5);
	    block7.body.immovable = true;

	    knifes1 = gameNew.add.group();
	    knifes1.enableBody = true;
	   	knifes1.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes1.createMultiple(30,'spritesheet','trap/knife');
	   	knifes1.setAll('anchor.x', 0.5);
    	knifes1.setAll('anchor.y', 1);
    	knifes1.setAll('outOfBoundsKill', true);
    	knifes1.setAll('checkWorldBounds', true);
    	knifes1.setAll('bounce',0.1);
    	firingTimer1 = gameNew.time.now;
    	knifes2 = gameNew.add.group();
	    knifes2.enableBody = true;
	   	knifes2.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes2.createMultiple(30,'spritesheet','trap/knife');
	   	knifes2.setAll('anchor.x', 0.5);
    	knifes2.setAll('anchor.y', 1);
    	knifes2.setAll('outOfBoundsKill', true);
    	knifes2.setAll('checkWorldBounds', true);
    	knifes2.setAll('bounce',0.1);
    	firingTimer2 = gameNew.time.now;
    	knifes3 = gameNew.add.group();
	    knifes3.enableBody = true;
	   	knifes3.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes3.createMultiple(30,'spritesheet','trap/knife');
	   	knifes3.setAll('anchor.x', 0.5);
    	knifes3.setAll('anchor.y', 1);
    	knifes3.setAll('outOfBoundsKill', true);
    	knifes3.setAll('checkWorldBounds', true);
		knifes3.setAll('bounce',0.1);
		firingTimer3 = gameNew.time.now;
    	knifes4 = gameNew.add.group();
	    knifes4.enableBody = true;
	   	knifes4.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes4.createMultiple(30,'spritesheet','trap/knife');
	   	knifes4.setAll('anchor.x', 0.5);
    	knifes4.setAll('anchor.y', 1);
    	knifes4.setAll('outOfBoundsKill', true);
    	knifes4.setAll('checkWorldBounds', true);
    	knifes4.setAll('bounce',0.1);
    	firingTimer4 = gameNew.time.now;
    	knifes5 = gameNew.add.group();
	    knifes5.enableBody = true;
	   	knifes5.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes5.createMultiple(30,'spritesheet','trap/knife');
	   	knifes5.setAll('anchor.x', 0.5);
    	knifes5.setAll('anchor.y', 1);
    	knifes5.setAll('outOfBoundsKill', true);
    	knifes5.setAll('checkWorldBounds', true);
    	knifes5.setAll('bounce',0.1);
    	firingTimer5 = gameNew.time.now;
    	knifes6 = gameNew.add.group();
	    knifes6.enableBody = true;
	   	knifes6.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes6.createMultiple(30,'spritesheet','trap/knife');
	   	knifes6.setAll('anchor.x', 0.5);
    	knifes6.setAll('anchor.y', 1);
    	knifes6.setAll('outOfBoundsKill', true);
    	knifes6.setAll('checkWorldBounds', true);
    	knifes6.setAll('bounce',0.1);
    	firingTimer6 = gameNew.time.now;
    	knifes7 = gameNew.add.group();
	    knifes7.enableBody = true;
	   	knifes7.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes7.createMultiple(30,'spritesheet','trap/knife');
	   	knifes7.setAll('anchor.x', 0.5);
    	knifes7.setAll('anchor.y', 1);
    	knifes7.setAll('outOfBoundsKill', true);
    	knifes7.setAll('checkWorldBounds', true);
    	knifes7.setAll('bounce',0.1);
    	firingTimer7 = gameNew.time.now;
}
function shooterSetUp2(){
		if(shooter1!=null)shooter1.kill();
	    if(shooter2!=null)shooter2.kill();
	    if(shooter3!=null)shooter3.kill();
	    if(shooter4!=null)shooter4.kill();
	    if(block1!=null)block1.kill();
	    if(block2!=null)block2.kill();
	    if(block3!=null)block3.kill();
	    if(block4!=null)block4.kill();
	    shooter1X = 80 ,shooter1Y=80,
		shooter2X = 320,shooter2Y=80,
		shooter3X = 580,shooter3Y=80,
		shooter4X = 820,shooter4Y=80,
		blocks1 = gameNew.add.group();
		blocks1.enableBody = true;
	    blocks2 = gameNew.add.group();
		blocks2.enableBody = true;
	    blocks3 = gameNew.add.group();
		blocks3.enableBody = true;
	    blocks4 = gameNew.add.group();
		blocks4.enableBody = true;
		//blocks
	   	block3 = blocks1.create(shooter3X,shooter3Y+48,'spritesheet','environment/block1');

	   	block4 = blocks2.create(shooter4X,shooter4Y+48,'spritesheet','environment/block1');

	   	block1 = blocks3.create(shooter1X,shooter1Y+48,'spritesheet','environment/block1');

	   	block2 = blocks4.create(shooter2X,shooter2Y+48,'spritesheet','environment/block1');

	    shooter1 = gameNew.add.sprite(shooter1X,shooter1Y,'spritesheet','environment/wall2');
	    shooter2 = gameNew.add.sprite(shooter2X,shooter2Y,'spritesheet','environment/wall2');
	    shooter3 = gameNew.add.sprite(shooter3X,shooter3Y,'spritesheet','environment/wall2');
	    shooter4 = gameNew.add.sprite(shooter4X,shooter4Y,'spritesheet','environment/wall2');

	    gameNew.physics.enable(shooter1,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter2,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter3,Phaser.Physics.ARCADE);
	    gameNew.physics.enable(shooter4,Phaser.Physics.ARCADE);
	    shooter1.enableBody = true;
	    shooter2.enableBody = true;
	    shooter3.enableBody = true;
	    shooter4.enableBody = true;

	    gameNew.physics.enable(block1, Phaser.Physics.ARCADE);
	    block1.body.collideWorldBounds = true;
		block1.body.bounce.set(0.5);
	    block1.body.immovable = true;
	    gameNew.physics.enable(block2, Phaser.Physics.ARCADE);
	    block2.body.collideWorldBounds = true;
		block2.body.bounce.set(0.5);
	    block2.body.immovable = true;
	    gameNew.physics.enable(block3, Phaser.Physics.ARCADE);
	    block3.body.collideWorldBounds = true;
		block3.body.bounce.set(0.5);
	    block3.body.immovable = true;
	    gameNew.physics.enable(block4, Phaser.Physics.ARCADE);
	    block4.body.collideWorldBounds = true;
		block4.body.bounce.set(0.5);
	    block4.body.immovable = true;

	    knifes1 = gameNew.add.group();
	    knifes1.enableBody = true;
	   	knifes1.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes1.createMultiple(30,'spritesheet','trap/knife');
	   	knifes1.setAll('anchor.x', 0.5);
    	knifes1.setAll('anchor.y', 1);
    	knifes1.setAll('outOfBoundsKill', true);
    	knifes1.setAll('checkWorldBounds', true);
    	knifes1.setAll('bounce',0.1);
    	firingTimer1 = gameNew.time.now;
    	knifes2 = gameNew.add.group();
	    knifes2.enableBody = true;
	   	knifes2.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes2.createMultiple(30,'spritesheet','trap/knife');
	   	knifes2.setAll('anchor.x', 0.5);
    	knifes2.setAll('anchor.y', 1);
    	knifes2.setAll('outOfBoundsKill', true);
    	knifes2.setAll('checkWorldBounds', true);
    	knifes2.setAll('bounce',0.1);
    	firingTimer2 = gameNew.time.now;
    	knifes3 = gameNew.add.group();
	    knifes3.enableBody = true;
	   	knifes3.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes3.createMultiple(30,'spritesheet','trap/knife');
	   	knifes3.setAll('anchor.x', 0.5);
    	knifes3.setAll('anchor.y', 1);
    	knifes3.setAll('outOfBoundsKill', true);
    	knifes3.setAll('checkWorldBounds', true);
		knifes3.setAll('bounce',0.1);
		firingTimer3 = gameNew.time.now;
    	knifes4 = gameNew.add.group();
	    knifes4.enableBody = true;
	   	knifes4.physicsBodyType = Phaser.Physics.ARCADE;
	   	knifes4.createMultiple(30,'spritesheet','trap/knife');
	   	knifes4.setAll('anchor.x', 0.5);
    	knifes4.setAll('anchor.y', 1);
    	knifes4.setAll('outOfBoundsKill', true);
    	knifes4.setAll('checkWorldBounds', true);
    	knifes4.setAll('bounce',0.1);
    	firingTimer4 = gameNew.time.now;
}
function shooterSetUp3(){
	if(shooter1!=null)shooter1.kill();
	if(block1!=null)block1.kill();
	shooter1X = 900 ,shooter1Y=310;
	blocks1 = gameNew.add.group();
	blocks1.enableBody = true;
	block1 = blocks1.create(shooter1X,shooter1Y+48,'spritesheet','environment/block1');
	shooter1 = gameNew.add.sprite(shooter1X,shooter1Y,'spritesheet','environment/wall2');
	gameNew.physics.enable(shooter1,Phaser.Physics.ARCADE);
	knifes1 = gameNew.add.group();
	knifes1.enableBody = true;
	knifes1.physicsBodyType = Phaser.Physics.ARCADE;
	knifes1.createMultiple(30,'spritesheet','trap/knife');
	knifes1.setAll('anchor.x', 0.5);
	knifes1.setAll('anchor.y', 1);
	knifes1.setAll('outOfBoundsKill', true);
	knifes1.setAll('checkWorldBounds', true);
	knifes1.setAll('bounce',0.1);
	firingTimer1 = gameNew.time.now;
}
function shooterSetUp4(){
	if(shooter1!=null)shooter1.kill();
	if(shooter2!=null)shooter2.kill();
	if(block1!=null)block1.kill();
	if(block2!=null)block2.kill();
	shooter1X = 900,shooter1Y=100,
	shooter2X = 900,shooter2Y=380;
	blocks1 = gameNew.add.group();
	blocks1.enableBody = true;
	blocks2 = gameNew.add.group();
	blocks2.enableBody = true;
	//blocks
	block1 = blocks1.create(shooter1X,shooter1Y+48,'spritesheet','environment/block1');
	block2 = blocks2.create(shooter2X,shooter2Y+48,'spritesheet','environment/block1');
	shooter1 = gameNew.add.sprite(shooter1X,shooter1Y,'spritesheet','environment/wall2');
	shooter2 = gameNew.add.sprite(shooter2X,shooter2Y,'spritesheet','environment/wall2');
	gameNew.physics.enable(shooter1,Phaser.Physics.ARCADE);
	gameNew.physics.enable(shooter2,Phaser.Physics.ARCADE);
	shooter1.enableBody = true;
	shooter2.enableBody = true;

	gameNew.physics.enable(block1, Phaser.Physics.ARCADE);
	block1.body.collideWorldBounds = true;
	block1.body.bounce.set(0.5);
	block1.body.immovable = true;
	gameNew.physics.enable(block2, Phaser.Physics.ARCADE);
	block2.body.collideWorldBounds = true;
	block2.body.bounce.set(0.5);
	block2.body.immovable = true;

	knifes1 = gameNew.add.group();
	knifes1.enableBody = true;
	knifes1.physicsBodyType = Phaser.Physics.ARCADE;
	knifes1.createMultiple(30,'spritesheet','trap/knife');
	knifes1.setAll('anchor.x', 0.5);
	knifes1.setAll('anchor.y', 1);
	knifes1.setAll('outOfBoundsKill', true);
	knifes1.setAll('checkWorldBounds', true);
	knifes1.setAll('bounce',0.1);
	firingTimer1 = gameNew.time.now;
	knifes2 = gameNew.add.group();
	knifes2.enableBody = true;
	knifes2.physicsBodyType = Phaser.Physics.ARCADE;
	knifes2.createMultiple(30,'spritesheet','trap/knife');
	knifes2.setAll('anchor.x', 0.5);
	knifes2.setAll('anchor.y', 1);
	knifes2.setAll('outOfBoundsKill', true);
	knifes2.setAll('checkWorldBounds', true);
	knifes2.setAll('bounce',0.1);
	firingTimer2 = gameNew.time.now;
}
//player
function attackLeftAnimationStarted(sprite, animation){
	if(currentLevel==3){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_pig_1)<55){
			npc_pig_1_HP -=5;
		}
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_pig_2)<55){
			npc_pig_2_HP -=5;
		}
	}else if(currentLevel==4){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_boss_1)<100){
			npc_boss_1_HP -=5;
		}
	}else if(currentLevel==7){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_boss_2)<100){
			npc_boss_2_HP -=5;
		}
	}
 	onAttackLeft = true;
}
function attackLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function attackLeftStop(){
	onAttackLeft = false;
}
function attackRightAnimationStarted(sprite, animation){
	if(currentLevel==3){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_pig_1)<55){
			npc_pig_1_HP -=5;
		}
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_pig_2)<55){
			npc_pig_2_HP -=5;
		}
	}else if(currentLevel==4){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_boss_1)<100){
			npc_boss_1_HP -=5;
		}
	}else if(currentLevel==7){
		if(gameNew.physics.arcade.distanceBetween(sprite,npc_boss_2)<100){
			npc_boss_2_HP -=5;
		}
	}
	onAttackRight = true;
}
function attackRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function attackRightStop(sprite, animation){
	onAttackRight = false;
}
function dieRightAnimationStarted(sprite, animation){
	onDieRight = true;
}
function dieRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function dieRightStop(sprite, animation){
	onDieRight = false;
}
function dieLeftAnimationStarted(sprite, animation){
	onDieLeft = true;
}
function dieLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function dieLeftStop(sprite, animation){
	onDieLeft = false;
}
//pig 1
function pig1AttackLeftAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<40){
		if(!restart)
			restartScreen();
	}
	},400);
 	pig1OnAttackLeft = true;
}
function pig1AttackLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig1AttackLeftStop(){
	pig1OnAttackLeft = false;
}
function pig1AttackRightAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<40){
		if(!restart)
			restartScreen();
	}
	},400);
	pig1OnAttackRight = true;
}
function pig1AttackRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig1AttackRightStop(sprite, animation){
	pig1OnAttackRight = false;
}
function pig1DieLeftAnimationStarted(sprite, animation){
 	pig1OnDieLeft = true;
}
function pig1DieLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig1DieLeftStop(sprite, animation){
	pig1OnDieLeft = false;
}
function pig1DieRightAnimationStarted(sprite, animation){
 	pig1OnDieRight = true;
}
function pig1DieRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig1DieRightStop(){
	pig1OnDieRight = false;
}
//pig 2
function pig2AttackLeftAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<40){
		if(!restart)
			restartScreen();
	}
	},400);
 	pig2OnAttackLeft = true;

}
function pig2AttackLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig2AttackLeftStop(sprite, animation){
	pig2OnAttackLeft = false;
}
function pig2AttackRightAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<40){
		if(!restart)
			restartScreen();
	}
	},400);
	pig2OnAttackRight = true;
}
function pig2AttackRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig2AttackRightStop(sprite, animation){
	pig2OnAttackRight = false;
}
function pig2DieLeftAnimationStarted(sprite, animation){
 	pig2OnDieLeft = true;
}
function pig2DieLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig2DieLeftStop(){
	pig2OnDieLeft = false;
}
function pig2DieRightAnimationStarted(sprite, animation){
 	pig2OnDieRight = true;
}
function pig2DieRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function pig2DieRightStop(sprite, animation){
	pig2OnDieRight = false;
}
//boss 1
function boss1AttackLeftAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<95){
		if(player.body.x<sprite.body.x)
				if(!restart)
					restartScreen();
	}
	},500);
 	boss1OnAttackLeft = true;
}
function boss1AttackLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss1AttackLeftStop(sprite, animation){
	boss1OnAttackLeft = false;
	boss1CurrentActionIsDone=true;
}
function boss1AttackRightAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<95){
		if(player.body.x>sprite.body.x)
				if(!restart)
					restartScreen();
	}
	},500);
	boss1OnAttackRight = true;
}
function boss1AttackRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss1AttackRightStop(sprite, animation){
	boss1OnAttackRight = false;
	boss1CurrentActionIsDone = true;
}
function boss1DieLeftAnimationStarted(sprite, animation){


 	boss1OnDieLeft = true;
}
function boss1DieLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss1DieLeftStop(sprite, animation){
	boss1OnDieLeft = false;
	boss1CurrentActionIsDone=true;
}
function boss1DieRightAnimationStarted(sprite, animation){
 	boss1OnDieRight = true;
}
function boss1DieRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss1DieRightStop(sprite, animation){
	boss1OnDieRight = false;
	boss1CurrentActionIsDone=true;
}
//boss 2
function boss2AttackLeftAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<90){
		if(player.body.x<sprite.body.x)
				if(!restart)
					restartScreen();
	}
	},500);
 	boss2OnAttackLeft = true;
}
function boss2AttackLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss2AttackLeftStop(sprite, animation){
	boss2OnAttackLeft = false;
	boss2CurrentActionIsDone=true;
}
function boss2AttackRightAnimationStarted(sprite, animation){
	setTimeout(function(){
	if(gameNew.physics.arcade.distanceBetween(player,sprite)<90){
		if(player.body.x>sprite.body.x)
				if(!restart)
					restartScreen();
	}
	},500);
	boss2OnAttackRight = true;
}
function boss2AttackRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss2AttackRightStop(sprite, animation){
	boss2OnAttackRight = false;
	boss2CurrentActionIsDone = true;
}
function boss2DieLeftAnimationStarted(sprite, animation){
 	boss2OnDieLeft = true;
}
function boss2DieLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss2DieLeftStop(sprite, animation){
	boss2OnDieLeft = false;
	boss2CurrentActionIsDone=true;
}
function boss2DieRightAnimationStarted(sprite, animation){
 	boss2OnDieRight = true;
}
function boss2DieRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function boss2DieRightStop(sprite, animation){
	boss2OnDieRight = false;
	boss2CurrentActionIsDone=true;
}
//switcher
function switchLeftAnimationStarted(sprite, animation){
	onSwitchLeft = true;
}
function switchLeftAnimationLooped(sprite, animation){
	animation.loop = false;
}
function switchLeftStop(sprite, animation){
	onSwitchLeft = false;
}
function switchRightAnimationStarted(sprite, animation){
	onSwitchRight = true;
}
function switchRightAnimationLooped(sprite, animation){
	animation.loop = false;
}
function switchRightStop(sprite, animation){
	onSwitchRight = false;
}
//switch2
function switchLeftAnimationStarted2(sprite, animation){
	onSwitchLeft2 = true;
}
function switchLeftAnimationLooped2(sprite, animation){
	animation.loop = false;
}
function switchLeftStop2(sprite, animation){
	onSwitchLeft2 = false;
}
function switchRightAnimationStarted2(sprite, animation){
	onSwitchRight2 = true;
}
function switchRightAnimationLooped2(sprite, animation){
	animation.loop = false;
}
function switchRightStop2(sprite, animation){
	onSwitchRight2 = false;
}
/*Game Setting Methods*/
function resize(){
	widthRatio = gameNew.width / 960;
	heightRatio = gameNew.height / 540;
	gameNew.stage.backgroundColor = "#FFFFFF";
	gameNew.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	gameNew.scale.pageAlignVertically = true;
	gameNew.scale.setScreenSize( true );
}
