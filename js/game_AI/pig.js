/**
 * @fileOverview pig.js
 * @description game AI logics related to wild pigs in level 4
 */
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
