/**
 * @fileOverview boss.js
 * @description game AI logics related to big boss in level 5 and 8 respectively
 */

/* Boss AI Logic at Level 6 */
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

/* Boss AI Logic at Level 7 */

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