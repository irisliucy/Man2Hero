/**
 * Man 2 Hero -- A game AI with javascript
 *
 * CS4386 AI Game Programming 1617 Semester B
 *
 * @link   https://github.com/irisliucy/Man2Hero.git
 * @author Iris Liu Chui Yi (chuiyiliu3-c@cityu.edu.hk)
 * @fileoverview   main.js holds the framework of the game, which includes initializing sounds, graphics, animation of different game level
 * @Description
 * 	- 8 game levels in total
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
