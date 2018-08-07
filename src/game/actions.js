
import _ from 'lodash';
import {getAttackChance} from './game_math';


export const actions = {
    move_left: {name: "Go <", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action_timer += 10;
            state.battleground.player = Math.max(0, state.battleground.player - 1);
            state.chat.unshift({text: "You Go < "});
            return state;
        }},
    move_right: {name: "Go >", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === state.battleground.target - 1,
        onClick: (state) => {
            state.player.action_timer += 10;
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 1);
            state.chat.unshift({text: "You Go > "});
            return state;
        }},
    run_left: {name: "Run <", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action_timer += 20;
            state.battleground.player = Math.max(0, state.battleground.player - 4 - state.player.stats.dex);
            state.chat.unshift({text: "You Run < "});
            return state;
        }},
    run_right: {name: "Run >", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player >= (state.battleground.target - 4 + state.player.stats.dex),
        onClick: (state) => {
            state.player.action_timer += 20;
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 4 +  state.player.stats.dex);
            state.chat.unshift({text: "You Run > "});
            return state;
        }},
    roll: {name: "Roll", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action_timer += 5;
            state.battleground.player = Math.max(0, state.battleground.player - 1);
            state.chat.unshift({text: "You Roll"});
            return state;
        }},
    hit:  {name: "Hit!", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || (state.player.weapon.range < (state.battleground.target - state.battleground.player)),
        onClick: (state) => {
            state.player.action_timer += state.player.weapon.speed;
            let chance = getAttackChance(state.player, state.target);
            if (_.random(0, 100) > chance) {
                let dmg = _.random(state.player.weapon.min_dmg, state.player.weapon.max_dmg) + _.random(0, state.player.stats.str);
                state.target.hp -= dmg;
                state.chat.unshift({text: "You Hit! Damage: " + dmg});
            }
            else {
                state.chat.unshift({text: "You Miss! Hit chance: " + chance + '%'});
            }

            return state;
        }},
    heal: {name: "Heal", cost: {'player.mp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.player.hp >= state.player.max_hp,
        onClick: (state) => {
            state.player.action_timer += 30;
            let hp = Math.min(state.player.max_hp - state.player.hp, state.player.level * _.random(1, state.player.stats.int));
            state.player.hp += hp;
            state.chat.unshift({text: "You Heal " + hp});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer),
        onClick: (state) => {
            state.player.action_timer += 30;
            let fire = state.player.level * _.random(1, state.player.stats.int);
            state.target.hp -= fire;
            state.chat.unshift({text: "You Fire " + fire});
            return state;
        }},

};