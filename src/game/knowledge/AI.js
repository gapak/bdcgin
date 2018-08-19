
import _ from 'lodash';
import {getActionDelay, isTargetInRange} from '../game_math';
import {actions} from './actions';
import {getWeapon, getArmor} from '../equipment';

export const AI = {
    enemy_turn: {
        onTick: (state, params = {}) => {

            if (!state.in_fight) return state;

            let My = state.target;

            if (My.action_timer > 0) return state;

            let action = ((My) => {
                if (My.hp < My.max_hp/3) {
                    if (My.mp > 0) {
                        return 'heal';
                    }
                    else if(My.sp > 0 && isTargetInRange(state, getWeapon(state, 'player').range)) {
                        return ['block', 'roll', 'run_right'][_.random(0, 2)];
                    }
                    return 'move_right';
                }

                if (My.sp > 0 && isTargetInRange(state, getWeapon(state, 'target').range)) {
                    return 'hit';
                }

                if (My.sp === 0) {
                    if (state.battleground.target === 100) {
                        return false;
                    }
                    else {
                        return 'move_right';
                    }
                }

                if (My.mp > My.max_mp/3 && isTargetInRange(state, 50) && _.random(0, 2)) {
                    return 'blast';
                }

                if (My.sp > My.max_sp/2) {
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
            })(My);

            switch (action) {
                case 'move_left':
                    state.target.action = 'move_left';
                    state.target.action_timer += getActionDelay(state, 'target', 10);
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 1);
                    state.chat.unshift({text: "Enemy Go < "});
                    break;
                case 'move_right':
                    state.target.action = 'move_right';
                    state.target.action_timer += getActionDelay(state, 'target', 10);
                    state.battleground.target = Math.min(100, state.battleground.target + 1);
                    state.chat.unshift({text: "Enemy Go > "});
                    break;
                case 'run_left':
                    state.target.action = 'run_left';
                    state.target.action_timer += getActionDelay(state, 'target', 20);
                    state.target.sp -= 1;
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 4 - state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run < "});
                    break;
                case 'run_right':
                    state.target.action = 'run_right';
                    state.target.action_timer += getActionDelay(state, 'target', 20);
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run > "});
                    break;
                case 'roll':
                    state.target.action = 'roll';
                    state.target.action_timer += getActionDelay(state, 'target', 10);
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Roll"});
                    break;
                case 'hit':
                    state.target.sp -= 1;
                    state = actions.hit.onAction(state, {attacker: 'target', defender: 'player'});
                    /*
                    state.target.action = 'hit';
                    state.target.sp -= 1;
                    state = attack(state,
                        {
                            attacker: 'target',
                            defender: 'player',
                            onHit: (state, dmg) => {  state.chat.unshift({text: "Enemy Hit! Damage: " + dmg}); return state; },
                            onMiss: (state, Prob) => { state.chat.unshift({text: "You Dodge! Dodge Prob: " + (100 - Prob).toFixed(0) + '%'}); return state; },
                        });
                     */
                    break;
                case 'heal':
                    state.target.mp -= 1;
                    state = actions.heal.onAction(state, {attacker: 'target', defender: 'player'});
                    /*
                    state.target.action = 'heal';
                    state.target.action_timer += getActionDelay(state, 'target', 30);
                    state.target.mp -= 1;
                    let hp = Math.min(state.target.max_hp - state.target.hp, 3 + (state.target.level * _.random(1, state.target.stats.int)));
                    state.target.hp += hp;
                    state.chat.unshift({text: "Enemy Heal " + hp});
                     */
                    break;
                case 'blast':
                    state.target.mp -= 1;
                    state = actions.blast.onAction(state, {attacker: 'target', defender: 'player'});
                    /*
                    state.target.action = 'blast';
                    state.target.action_timer += getActionDelay(state, 'target', 30);
                    state.target.mp -= 1;
                    let fire = state.target.level * _.random(1, state.target.stats.int);
                    state.player.hp -= fire;
                    state.chat.unshift({text: "Enemy Blast " + fire});
                    */
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