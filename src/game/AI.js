
import _ from 'lodash';


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
                if (My.weapon.range < (state.battleground.target - state.battleground.player)) {
                    if ((state.battleground.target - state.battleground.player) > 15 && My.sp > My.max_sp/3) {
                        return 'run_left';
                    }
                    else {
                        if (My.mp > My.max_mp/3) {
                            return 'fire';
                        }
                        else {
                            return 'move_left';
                        }
                    }
                }
                else {
                    if (state.battleground.target < 100 && My.weapon.range > ((state.battleground.target - state.battleground.player) + 10)) {
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
                            return 'move_right';
                        }
                    }
                    if (My.sp > 0) {
                        return 'hit';
                    }
                    if (My.mp > 0) {
                        return 'fire';
                    }
                }
                return false;
            })(My);

            switch (action) {
                case 'move_left':
                    state.target.action_timer += 10;
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 1);
                    state.chat.unshift({text: "Enemy Go < "});
                    break;
                case 'move_right':
                    state.target.action_timer += 10;
                    state.battleground.target = Math.min(100, state.battleground.target + 1);
                    state.chat.unshift({text: "Enemy Go > "});
                    break;
                case 'run_left':
                    state.target.action_timer += 20;
                    state.target.sp -= 1;
                    state.battleground.target = Math.max(state.battleground.player + 1, state.battleground.target - 4 - state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run < "});
                    break;
                case 'run_right':
                    state.target.action_timer += 20;
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + state.target.stats.dex);
                    state.chat.unshift({text: "Enemy Run > "});
                    break;
                case 'roll':
                    state.target.action_timer += 5;
                    state.target.sp -= 1;
                    state.battleground.target = Math.min(100, state.battleground.target + 1);
                    state.chat.unshift({text: "Enemy Roll"});
                    break;
                case 'hit':
                    state.target.action_timer += state.target.weapon.speed;
                    state.target.sp -= 1;
                    let dmg = _.random(state.target.weapon.min_dmg, state.target.weapon.max_dmg) + _.random(0, state.target.stats.str);
                    state.player.hp -= dmg;
                    state.chat.unshift({text: "Enemy Hit! " + dmg});
                    break;
                case 'heal':
                    state.target.action_timer += 30;
                    state.target.mp -= 1;
                    let hp = Math.min(state.target.max_hp - state.target.hp, state.target.level * _.random(1, state.target.stats.int));
                    state.target.hp += hp;
                    state.chat.unshift({text: "Enemy Heal " + hp});
                    break;
                case 'fire':
                    state.target.action_timer += 30;
                    state.target.mp -= 1;
                    let fire = state.target.level * _.random(1, state.target.stats.int);
                    state.player.hp -= fire;
                    state.chat.unshift({text: "Enemy Fire " + fire});
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