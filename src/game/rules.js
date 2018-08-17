
import _ from 'lodash';

import {effects_0} from './models/unit';
import {genTarget} from './models/targets';
import {checkUnitStats, isTargetInRange, hit} from './game_math';
import {AI} from './knowledge/AI';


const endBattleCleaner = (state) => {
    state.target = genTarget(_.random(Math.ceil(state.player.level/2), (2 * state.player.level) - 1));
    state.in_fight = false;
    state.battleground = {player: 0, target: 100};
    state.player.action = null;
    state.player.action_timer = 0;
    state.player.effects = effects_0;
    return state;
};

export const rules = {
    matrix_show: {onFrame: (state, params = {}) => { state.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return state; }},

    flip: {
        onFrame: (state, params = {}) => {
            if (state.battleground.target < state.battleground.player) {
                state.battleground = {player: 100 - state.battleground.player, target: 100 - state.battleground.target};
            }
            return state;
        }
    },
    AI: {
        onTick: (state, params = {}) => {
            state = AI.enemy_turn.onTick(state);
            return state;
        }
    },

    optimize_chat: {
        onTick: (state, params = {}) => {
            state.chat = _.slice(state.chat, 0, 9);
            return state;
        }
    },

    effects_in_battle: { onTick: (state, params = {}) => {
        const effector = (state, attacker, defender) => {
            if (state[attacker].action === 'trance') {
                if (state.player.mp < state.player.max_mp && _.random(1, 5) === 1) {
                    state.player.mp++;
                }}

            for (let ip = 0; ip < state[attacker].effects.regen; ip++) {
                if (state.player.hp < state.player.max_hp && _.random(1, 60) === 1) {
                    state.player.hp++;
                    state.chat.unshift({text: attacker + " Regen"});
                }
            }
            for (let ip = 0; ip < state[defender].effects.fire; ip++) {
                if (_.random(1, 60) === 1) {
                    let dmg = hit(state, attacker, defender, 1, 'fire');
                    if (dmg > 0) {
                        state[defender].hp -= dmg;
                        state.chat.unshift({text: defender + " Burns"});
                    }
                }
            }
            for (let ip = 0; ip < state[defender].effects.poison; ip++) {
                if (_.random(1, 60) === 1) {
                    let dmg = hit(state, attacker, defender, 1, 'poison');
                    if (dmg > 0) {
                        state[defender].hp -= dmg;
                        state.chat.unshift({text: defender + " poisoned"});
                    }
                }
            }
            for (let ip = 0; ip < state[attacker].effects.firestorm; ip++) {
                if (_.random(1, 30) === 1 && isTargetInRange(state, 5)) {
                    let dmg = hit(state, attacker, defender, 1, 'fire');
                    if (dmg > 0) {
                        state[defender].hp -= dmg;
                        state.chat.unshift({text: defender + " Burns"});
                    }
                }
            }
            return state;
        };

        state = effector(state, 'player', 'target');
        state = effector(state, 'target', 'player');

        return state;
    }},

    loose_battle: {
        onFrame: (state, params = {}) => {
            if (state.player.hp < 1) {
                state.looses++;
                state.player.hp = 1;
                let expr = Math.floor((25 * state.target.level) * state.target.level / state.player.level);
                state.player.expr += expr;
                state = endBattleCleaner(state);
                state.chat.unshift({text: "You loose. +" + expr + 'expr.'});
            }
            return state;
        }
    },

    replace_target: {
        onFrame: (state, params = {}) => {
            if (state.target.hp < 1) {
                state.wins++;
                let expr = Math.floor((50 + (50 * state.target.level)) * state.target.level / state.player.level);
                state.player.expr += expr;
                state.inventory.armors.push(state.target.armor);
                state.inventory.weapons.push(state.target.weapon);
                let weapon_name = state.target.weapon.name;
                state = endBattleCleaner(state);
                state.chat.unshift({text: "You win. +" + expr + 'expr and ' + weapon_name + '.'});
            }
            return state;
        }
    },

    actions_timing: {
        onFrame: (state, params = {}) => {
            const check = (unit) => {
                //console.log(unit.action_timer);

                if (unit.action_timer > 0) {
                    if (unit.action_timer === 1) {
                        unit.action = null;
                    }
                    unit.action_timer -= 1;
                }
                return unit;
            };

            state.player = check(state.player);
            state.target = check(state.target);

            return state;
        }
    },

    levelUp: {
        onTick: (state, params = {}) => {
            if (state.player.expr >= (100 * state.player.level)) {
                state.player.expr -= (100 * state.player.level);
                state.player.bonus_points += 1;
                state.player.level += 1;
                state.player = checkUnitStats(state.player);
            }
            return state;
        }
    },

    rest: {
        onTick: (state, params = {}) => {
            if (!state.in_fight) {
                if (state.player.hp < state.player.max_hp) state.player.hp++;
                if (state.player.sp < state.player.max_sp) state.player.sp++;
                if (state.player.mp < state.player.max_mp) state.player.mp++;
            }
            state.player.hp = _.random(state.player.hp, 500) > 450 && state.player.hp < state.player.max_hp ? state.player.hp + 1 : state.player.hp;
            state.player.sp = _.random(state.player.sp, 250) > 225 && state.player.sp < state.player.max_sp ? state.player.sp + 1 : state.player.sp;
            state.player.mp = _.random(state.player.mp, 100) > 95 && state.player.mp < state.player.max_mp ? state.player.mp + 1 : state.player.mp;

            state.target.hp = _.random(state.target.hp, 500) > 450 && state.target.hp < state.target.max_hp ? state.target.hp + 1 : state.target.hp;
            state.target.sp = _.random(state.target.sp, 250) > 225 && state.target.sp < state.target.max_sp ? state.target.sp + 1 : state.target.sp;
            state.target.mp = _.random(state.target.mp, 100) > 95 && state.target.mp < state.target.max_mp ? state.target.mp + 1 : state.target.mp;
            return state;
        }
    },

};