
import _ from 'lodash';

import {isTargetInRange, getRangeBetween, blink} from './game_math';

const buy = (state, item_key) => {
    state.belt.push(item_key);
    if (state.belt.length >= 6) state.tab = 'inventory';
    return state;
};

export const consumables = {
    heal: { name: 'HP Pot', cost: {'player.money': 10}, text: '1',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'heal'),
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.hp = Math.min(state.player.hp + 10, state.player.max_hp);
            return state;
    }},
    stamina: { name: 'SP Pot', cost: {'player.money': 10}, text: '2',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'stamina'),
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.sp = Math.min(state.player.sp + 5, state.player.max_sp);
            return state;
    }},
    manna: { name: 'MP Pot', cost: {'player.money': 10}, text: '3',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'manna'),
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.mp = Math.min(state.player.mp + 3, state.player.max_mp);
            return state;
    }},

    blink: { name: 'Blink Scroll', cost: {'player.money': 10}, text: '',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'blink'),
        consumableIf: (state) => !state.player.action_timer,
        onConsume: (state) => blink(state, 33)
    },
    wave: { name: 'Wave Scroll', cost: {'player.money': 10}, text: '',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'wave'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 42),
        onConsume: (state) => {
            state.battleground.target = Math.min(100, state.battleground.target + 5);
            state.target.action_timer += 10 + _.random(1, 10);
            return state;
        }},
    fire: { name: 'Fire Scroll', cost: {'player.money': 10}, text: '',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'fire'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 13),
        onConsume: (state) => {
            state.target.hp -= _.random(1, 3) + _.random(1, 3)  + _.random(1, 3);
            return state;
        }},

    dart: { name: 'Dart Spear', cost: {'player.money': 10}, text: '',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'dart'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 15),
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.target.hp -= 5; // Переделать на механику удара
            return state;
        }},
    bomb: { name: 'Fire Bomb', cost: {'player.money': 10}, text: '',
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
    web: { name: 'Web Net', cost: {'player.money': 10}, text: '',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'web'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 25),
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.target.action_timer += 50;
            return state;
        }},
};































