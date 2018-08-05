
import _ from 'lodash';
import {genTarget} from './targets';
import {checkPlayerStats} from './game_math';


export const rules = {
    matrix_show: {onFrame: (state) => { state.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return state; }},

    optimize_chat: {
        onTick: (state) => {
            state.chat = _.slice(state.chat, 0, 7);
            return state;
        }
    },

    replace_target: {onFrame: (state) => {
        if (state.target.hp < 1) {
            state.wins++;
            state.player.expr += Math.floor((10 + state.target.level) * state.target.level / state.player.level);
            state.inventory.push(state.target.weapon);
            state.target = genTarget(_.random(1, state.player.level));
            state.in_fight = false;
            state.battleground = {player: 0, target: 100};
        }
        return state;
    }},

    actions_timing: {onFrame: (state) => {
        if (state.player.action_timer !== 0) state.player.action_timer -= 1;
        if (state.target.action_timer !== 0) state.target.action_timer -= 1;
        return state;
    }},

    levelUp: {onTick: (state) => {
        if (state.player.expr > (42 * state.player.level)) {
            state.player.expr -= (42 * state.player.level);
            state.player.bonus_points += 1;
            state.player.level += 1;
            state = checkPlayerStats(state);
        }
        return state;
    }},

    rest: {onTick: (state) => {
        state.player.hp = _.random(state.player.hp, 1000) > 900 && state.player.hp < state.player.max_hp ? state.player.hp + 1 : state.player.hp;
        state.player.sp = _.random(state.player.sp, 100) > 90  && state.player.sp < state.player.max_sp ? state.player.sp + 1 : state.player.sp;
        state.player.mp = _.random(state.player.mp, 50) > 40 && state.player.mp < state.player.max_mp ? state.player.mp + 1 : state.player.mp;
        return state;
    }},

};