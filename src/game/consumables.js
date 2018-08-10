
import _ from 'lodash';

import {getAttackChance, getActionDelay, isTargetInRange, getRangeBetween} from './game_math';

const buy = (state, item_key) => {
    state.belt.push(item_key);
    if (state.belt.length >= 6) state.tab = 'inventory';
    return state;
};

export const consumables = {
    heal: { name: 'HP Pot', cost: {money: 10}, text: '1',
        isDisabled: (state) => { return false; }, //state.belt.length >= 6,
        onClick: (state) => { state.belt.push('heal'); return state;}, //buy(state, 'heal'),
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.hp = Math.min(state.player.hp + 10, state.player.max_hp);
            return state;
    }},
    stamina: { name: 'SP Pot', cost: {money: 10}, text: '2',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'stamina'),
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.sp = Math.min(state.player.sp + 5, state.player.max_sp);
            return state;
    }},
    manna: { name: 'MP Pot', cost: {money: 10}, text: '3',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'manna'),
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.mp = Math.min(state.player.mp + 3, state.player.max_mp);
            return state;
    }},

    blink: { name: 'Blink Scroll', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'blink'),
        consumableIf: (state) => !state.player.action_timer,
        onConsume: (state) => {
            let old_point = state.battleground.player;
            let new_point = 0;
            let target_point = state.battleground.target;

            let min = Math.max(0, old_point - 25);
            let max = Math.min(100, old_point + 25);

            do {
                new_point = _.random(min, max);
            }
            while(new_point !== old_point && new_point !== target_point);

            state.battleground.player = new_point;

            return state;
        }},
    wave: { name: 'Wave Scroll', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'wave'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 42),
        onConsume: (state) => {
            state.battleground.target = Math.min(100, state.battleground.target + 5);
            state.target.action_timer += 10 + _.random(1, 10);
            return state;
        }},
    fire: { name: 'Fire Scroll', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'fire'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 13),
        onConsume: (state) => {
            state.target.hp -= _.random(1, 3) + _.random(1, 3)  + _.random(1, 3);
            return state;
        }},

    dart: { name: 'Dart Spear', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'dart'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 15),
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.target.hp -= 5; // Переделать на механику удара
            return state;
        }},
    bomb: { name: 'Fire Bomb', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'bomb'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 20),
        onConsume: (state) => {
            state.target.hp -= _.random(1, 10);
            state.target.action_timer += 10 + _.random(1, 10);
            state.player.hp -= _.random(1, getRangeBetween(state));
            state.player.action_timer += 10 + _.random(1, getRangeBetween(state));
            return state;
        }},
    web: { name: 'Web Net', cost: {money: 10}, text: '', 
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'web'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 25),
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.target.action_timer += 50;
            return state;
        }},
};































