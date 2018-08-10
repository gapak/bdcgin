
import _ from 'lodash';
import {getAttackChance, getActionDelay, isTargetInRange, getRangeBetween} from './game_math';

export const AI = {
    enemy_turn: {
        onTick: (state) => {

            if (!state.in_fight) return state;

            let My = state.target;

            if (My.action_timer > 0) return state;

            let action = ((My) => {
                if (My.hp < My.max_hp/3 && My.mp > 0) {
                    return 'heal';
                }
                if (My.sp === 0) {
                    if (state.battleground.target === 100) {
                        return false;
                    }
                    else {
                        return 'move_right';
                    }
                }
                if (isTargetInRange(state, My.weapon.range)) {
                    if ((state.battleground.target - state.battleground.player) > 15 && My.sp > My.max_sp/3) {
                        return 'run_left';
                    }
                    else {
                        if (My.mp > My.max_mp/3) {
                            return 'blast';
                        }
                        else {
                            return 'move_left';
                        }
                    }
                }
                else {
                    if (state.battleground.target < 100 && isTargetInRange(state, My.weapon.range - 10)) {
                        if (My.sp > 1) {
                            if (My.hp < My.max_hp/3) {
                                return 'roll';
                            }
                            if (state.battleground.target < 90) {
                                return 'run_right';
                            }
                            else {
                                return 'move_right';
                            }
                        }
                        else {
                            if (My.mp > 0) {
                                if (My.hp > My.max_hp/3) {
                                    return 'blast';
                                }
                                else {
                                    return 'heal';
                                }
                            }
                            else {
                                return 'move_right';
                            }
                        }
                    }
                    if (My.sp > 0) {
                        return 'hit';
                    }
                    if (My.mp > 0) {
                        return 'blast';
                    }
                }
                return false;
            })(My);

            switch (action) {
                case 'move_left':
                    state.target.action_timer += getActionDelay(10, state.target);
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 1);
                    state.chat.unshift({text: "Enemy Go < "});
                    break;
                case 'move_right':
                    state.target.action_timer += getActionDelay(10, state.target);
                    state.battleground.target = Math.min(100, state.battleground.target + 1);
                    state.chat.unshift({text: "Enemy Go > "});
                    break;
                case 'run_left':
                    state.target.action_timer += getActionDelay(20, state.target);
                    state.target.sp -= 1;
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 4 - state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run < "});
                    break;
                case 'run_right':
                    state.target.action_timer += getActionDelay(20, state.target);
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run > "});
                    break;
                case 'roll':
                    state.target.action_timer += getActionDelay(5, state.target);
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + 1);
                    state.chat.unshift({text: "Enemy Roll"});
                    break;
                case 'hit':
                    state.target.action_timer += getActionDelay(state.target.weapon.speed, state.target);
                    state.target.sp -= 1;

                    let chance = getAttackChance(state.target, state.player);
                    if (_.random(0, 100) > chance) {
                        let dmg = _.random(state.target.weapon.min_dmg, state.target.weapon.max_dmg) + _.random(0, state.target.stats.str);
                        state.player.hp -= dmg;
                        state.player.action_timer += Math.max(0, state.target.weapon.stunning - (state.player.armor.stability + state.player.stats.con));
                        state.chat.unshift({text: "Enemy Hit! Damage: " + dmg});
                    }
                    else {
                        //state.chat.unshift({text: "Enemy Miss! Attack: ("+attack+"/"+def+")="+ratio});
                        state.chat.unshift({text: "You Dodge! Dodge chance: " + 100 - chance + '%'});
                    }
                    break;
                case 'heal':
                    state.target.action_timer += getActionDelay(30, state.target);
                    state.target.mp -= 1;
                    let hp = Math.min(state.target.max_hp - state.target.hp, 3 + (state.target.level * _.random(1, state.target.stats.int)));
                    state.target.hp += hp;
                    state.chat.unshift({text: "Enemy Heal " + hp});
                    break;
                case 'blast':
                    state.target.action_timer += getActionDelay(30, state.target);
                    state.target.mp -= 1;
                    let fire = state.target.level * _.random(1, state.target.stats.int);
                    state.player.hp -= fire;
                    state.chat.unshift({text: "Enemy Blast " + fire});
                    break;
                case false:
                    console.log('idle');
                    break;
                default:
                    console.log('WRONG AI INSTRUCTION DANGER DANGER');
            }

            return state;
        }
    },
};