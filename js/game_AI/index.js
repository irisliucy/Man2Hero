/**
 * @fileOverview index.js
 * @description game AI handling functions
 */
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

