
import _ from 'lodash';
import {genTarget} from './targets';
import {checkStats} from './game_math';
import {AI} from './AI';


const endBattleCleaner = (state) => {
    state.target = genTarget(_.random(state.player.level, (2 * state.player.level) - 1));
    state = checkStats(state, 'target');
    state.in_fight = false;
    state.battleground = {player: 0, target: 100};
    state.player.action = null;
    state.player.effects = {};
    return state;
};

export const rules = {
    matrix_show: {onFrame: (state) => { state.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return state; }},

    flip: {
        onFrame: (state) => {
            if (state.battleground.target < state.battleground.player) {
                state.battleground = {player: 100 - state.battleground.player, target: 100 - state.battleground.target};
            }
            return state;
        }
    },
    AI: {
        onTick: (state) => {
            state = AI.enemy_turn.onTick(state);
            return state;
        }
    },

    optimize_chat: {
        onTick: (state) => {
            state.chat = _.slice(state.chat, 0, 9);
            return state;
        }
    },

    effects_in_battle: { onTick: (state) => {
        for (let ip = 0; ip < state.player.effects.fire; ip++) { if (_.random(1, 60) === 1) { state.player.hp--; state.chat.unshift({text: "You Burns"});} }
        for (let it = 0; it < state.target.effects.fire; it++) { if (_.random(1, 60) === 1) { state.target.hp--; state.chat.unshift({text: "Enemy Burns"});} }
        return state;
    }},

    loose_battle: {
        onFrame: (state) => {
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
        onFrame: (state) => {
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
        onFrame: (state) => {
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
        onTick: (state) => {
            if (state.player.expr >= (100 * state.player.level)) {
                state.player.expr -= (100 * state.player.level);
                state.player.bonus_points += 1;
                state.player.level += 1;
                state = checkStats(state, 'player');
            }
            return state;
        }
    },

    rest: {
        onTick: (state) => {
            if (!state.in_fight) {
                if (state.player.hp < state.player.max_hp) state.player.hp++;
                if (state.player.sp < state.player.max_sp) state.player.sp++;
                if (state.player.mp < state.player.max_mp) state.player.mp++;
            }
            state.player.hp = _.random(state.player.hp, 1000) > 950 && state.player.hp < state.player.max_hp ? state.player.hp + 1 : state.player.hp;
            state.player.sp = _.random(state.player.sp, 200) > 180 && state.player.sp < state.player.max_sp ? state.player.sp + 1 : state.player.sp;
            state.player.mp = _.random(state.player.mp, 100) > 99 && state.player.mp < state.player.max_mp ? state.player.mp + 1 : state.player.mp;

            state.target.hp = _.random(state.target.hp, 1000) > 950 && state.target.hp < state.target.max_hp ? state.target.hp + 1 : state.target.hp;
            state.target.sp = _.random(state.target.sp, 200) > 180 && state.target.sp < state.target.max_sp ? state.target.sp + 1 : state.target.sp;
            state.target.mp = _.random(state.target.mp, 100) > 99 && state.target.mp < state.target.max_mp ? state.target.mp + 1 : state.target.mp;
            return state;
        }
    },

};