/**
* @fileOverview Helper functions
*/

var playerIsLeftDirection=false;
var moverSpeed = 300;
var onSwitchLeft,onSwitchRight,onSwitchLeft2,onSwitchRight2;
var creationMutex = false;

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

function resize(){
    widthRatio = gameNew.width / 960;
    heightRatio = gameNew.height / 540;
    gameNew.stage.backgroundColor = "#FFFFFF";
    gameNew.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    gameNew.scale.pageAlignVertically = true;
    gameNew.scale.setScreenSize( true );
}