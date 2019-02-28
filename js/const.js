/** Constants and Variables
 *  @fileOverview Initialize constants, variables, functions required for initialization of the game
 */

var widthRatio;
var heightRatio;

var player;
var playerX=24,playerY=285;
var barrier;
var street;
var cursors;
var z;
var okey,pkey;
var rkey;
var door;
var doorIsOpened=false;
var doorX=472-77*1.5/2,doorY=22;
var backgroundImage;
var switcher;
var switcherIsOn=false;
var switcherX=480,switcherY=290;
var switcher2;
var switcher2IsOn=false;
var switcher2X=480,switcher2Y=290;
var hitCount=0;
var shooter1,shooter2,shooter3,shooter4,shooter5,shooter6,shooter7;
var shooters=[];
var firingTimer1,firingTimer2,firingTimer3,firingTimer4,firingTimer5,firingTimer6,firingTimer7;
var block1,block2,block3,block4,block5,block6,block7;
var blocks1,blocks2,blocks3,blocks4,blocks5,blocks6,blocks7;
var knifes1,knifes2,knifes3,knifes4,knifes5,knifes6,knifes7;
var shooterLevel = 0;
var shooter1X,shooter1Y,shooter2X,shooter2Y,shooter3X,shooter3Y,shooter4X,shooter4Y,shooter5X,shooter5Y,shooter6X,shooter6Y,shooter7X,shooter7Y;
var item1=false,item2=false;
var level = [0,1,2,3,4,5,6,7,8,9];
var creation = false;
var currentLevel = 0;
var wall3;
var wallBlock;
var npc_pig_1,npc_pig_2;
var npc_pig_1_HP,npc_pig_2_HP;
var npc_pig_1X,npc_pig_1Y,npc_pig_2X,npc_pig_2Y;
var npc_boss_1;
var npc_boss_1X,npc_boss1Y;
var npc_boss_1_HP;
var npc_boss_2;
var npc_boss_2X,npc_boss2Y;
var npc_boss_2_HP;
var npc_block1,npc_block2;
var firegunList=[];
var fireguns;
var fireGunsTrigger1=[],fireGunsTrigger2=[],fireGunsTrigger3=[],fireGunsTrigger4=[],fireGunsTrigger5=[],fireGunsTrigger6=[],fireGunsTrigger7=[];
var fireGunsSetx01,fireGunsSetx02,fireGunsSetx03,fireGunsSetx04,fireGunsSetx05,fireGunsSetx06,fireGunsSetx07;
var fireGunsSetx11,fireGunsSetx12,fireGunsSetx13,fireGunsSetx14,fireGunsSetx15,fireGunsSetx16,fireGunsSetx17;
var fireGunsSety01,fireGunsSety02,fireGunsSety03,fireGunsSety04,fireGunsSety05,fireGunsSetx06,fireGunsSety07;
var fireGunsSety11,fireGunsSety12,fireGunsSety13,fireGunsSety14,fireGunsSety15,fireGunsSety16,fireGunsSety17;
var fireGunsTrigger8=[];
// var isDieAnimLeft,isDieAnimRight;
var isAttackingAnimLeft,isAttackingAnimRight;
var isSwitchingAnimLeft,isSwitchingAnimRight;
var pig1IsAttackingAnimLeft,pig1IsAttackingAnimRight,pig1IsDieAnimLeft,pig1IsDieAnimRight;
var pig2IsAttackingAnimLeft,pig2IsAttackingAnimRight,pig2IsDieAnimLeft,pig2IsDieAnimRight;
var pig1OnAttackLeft=false,pig1OnAttackRight=false,pig1OnDieLeft,pig1OnDieRight;
var pig2OnAttackLeft=false,pig2OnAttackRight=false,pig2OnDieLeft,pig2OnDieRight;
var pig1IsLeftDirection = false;
var pig2IsLeftDirection = false;
var boss1IsAttackingAnimLeft,boss1IsAttackingAnimRight,boss1IsDieAnimLeft,boss1IsDieAnimRight;
var boss1OnAttackLeft=false,boss1OnAttackRight=false,boss1OnDieLeft,boss1OnDieRight;
var boss1IsLeftDirection = false;
var boss1CurrentActionIsDone= false;
var boss2IsAttackingAnimLeft,boss2IsAttackingAnimRight,boss2IsDieAnimLeft,boss2IsDieAnimRight;
var boss2OnAttackLeft=false,boss2OnAttackRight=false,boss2OnDieLeft,boss2OnDieRight;
var boss2IsLeftDirection = false;
var boss2CurrentActionIsDone= false;
var fireGun9Timer,fireGun10Timer;
var startTime;
var screen;
var totalTime;
var stateText2,stateText3;
var instructionText;
var gameIsDone;
var restartCounter;
var audioBackground=new Audio("assets/audio/sound_background.mp3");
var audioSwitch=new Audio("assets/audio/sound_button_click.mp3")
var audioDoor=new Audio("assets/audio/sound_door.mp3")
var audioPig=new Audio("assets/audio/sound_pig.mp3")
var audioStab=new Audio("assets/audio/sound_stab.mp3")
var audioBossAttack=new Audio("assets/audio/sound_swing.mp3")
var healthBar;
var BOSS1_HP = 50.0;
var BOSS2_HP = 80.0;
var PIG_HP = 15.0;


function preload() {
    gameNew.load.atlasJSONHash('spritesheet','assets/spritesheet.png','assets/spritesheet.json');
}

var audioInit = function(){
    audioBackground.load();
    audioSwitch.load();
    audioDoor.load();
    audioPig.load();
    audioStab.load();
    audioBossAttack.load();
};