
    import _ from 'lodash';
import {genTarget} from './targets';
import {checkPlayerStats} from './game_math';
import {AI} from './AI';


export const rules = {
    matrix_show: {onFrame: (state) => { state.matrix_show = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); return state; }},

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

    loose_battle: {
        onFrame: (state) => {
            if (state.player.hp < 1) {
                state.looses++;
                state.player.hp = 1;
                let expr = Math.floor((12 + state.target.level) * state.target.level / state.player.level);
                state.player.expr += expr;
                state.target = genTarget(_.random(1, state.player.level));
                state.in_fight = false;
                state.battleground = {player: 0, target: 100};
                state.chat.unshift({text: "You loose. +" + expr + 'expr.'});
            }
            return state;
    }},

    replace_target: {
        onFrame: (state) => {
            if (state.target.hp < 1) {
                state.wins++;
                let expr = Math.floor((41 + state.target.level) * state.target.level / state.player.level);
                state.player.expr += expr
                state.inventory.push(state.target.weapon);
                let weapon_name = state.target.weapon.name;
                state.target = genTarget(_.random(1, state.player.level));
                state.in_fight = false;
                state.battleground = {player: 0, target: 100};
                state.chat.unshift({text: "You win. +" + expr + 'expr and ' + weapon_name + '.'});
            }
            return state;
    }},

    actions_timing: {onFrame: (state) => {
        if (state.player.action_timer !== 0) state.player.action_timer -= 1;
        if (state.target.action_timer !== 0) state.target.action_timer -= 1;
        return state;
    }},

    levelUp: {onTick: (state) => {
        if (state.player.expr > (100 * state.player.level)) {
            state.player.expr -= (100 * state.player.level);
            state.player.bonus_points += 1;
            state.player.level += 1;
            state = checkPlayerStats(state);
        }
        return state;
    }},

    rest: {onTick: (state) => {
        state.player.hp = _.random(state.player.hp, 1000) > 800 && state.player.hp < state.player.max_hp ? state.player.hp + 1 : state.player.hp;
        state.player.sp = _.random(state.player.sp, 100) > 75 && state.player.sp < state.player.max_sp ? state.player.sp + 1 : state.player.sp;
        state.player.mp = _.random(state.player.mp, 50) > 45 && state.player.mp < state.player.max_mp ? state.player.mp + 1 : state.player.mp;
        return state;
    }},

};