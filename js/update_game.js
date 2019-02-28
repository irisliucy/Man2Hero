/**
 * @fileOverview Update the game context and reinitialize objects and settings
 */
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