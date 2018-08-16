
import _ from 'lodash';

import {isTargetInRange, getRangeBetween, blink, attack} from './game_math';

const buy = (state, item_key) => {
    state.belt.push(item_key);
    if (state.belt.length >= 6) state.tab = 'inventory';
    return state;
};

export const consumables = {
    heal: { name: 'HP Pot', cost: {'player.money': 10}, text: 'Restore HP and cure poison',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'heal'),
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.effects.poison = Math.max(0, state.player.effects.poison - 20);
            state.player.hp = Math.min(state.player.hp + 20, state.player.max_hp);
            return state;
    }},
    stamina: { name: 'SP Pot', cost: {'player.money': 10}, text: 'Restore SP and warm ice',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'stamina'),
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.effects.freeze = Math.max(0, state.player.effects.freeze - 10);
            state.player.sp = Math.min(state.player.sp + 10, state.player.max_sp);
            return state;
    }},
    manna: { name: 'MP Pot', cost: {'player.money': 10}, text: 'Restore MP and extinguish fire',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'manna'),
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.effects.fire = Math.max(0, state.player.effects.fire - 5);
            state.player.mp = Math.min(state.player.mp + 5, state.player.max_mp);
            return state;
    }},

    blink: { name: 'Blink Scroll', cost: {'player.money': 10}, text: 'Scroll of Random Teleportation',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'blink'),
        consumableIf: (state) => !state.player.action_timer,
        onConsume: (state) => blink(state, 42)
    },
    wave: { name: 'Wave Scroll', cost: {'player.money': 10}, text: 'Pushes, stuns and freezes the target',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'wave'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 42),
        onConsume: (state) => {
            state.battleground.target = Math.min(100, state.battleground.target + 10);
            state.target.action_timer += 30;
            state.target.effects.freeze += 10;
            state.player.action_timer += 10;
            return state;
        }},
    fire: { name: 'Fire Scroll', cost: {'player.money': 10}, text: 'Damage and ignite target',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'fire'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 13),
        onConsume: (state) => {
            state.target.hp -= _.random(1, 3) + _.random(1, 3)  + _.random(1, 3);
            state.target.effects.fire += 5;
            state.player.action_timer += 10;
            return state;
        }},

    dart: { name: 'Dart Spear', cost: {'player.money': 10}, text: 'Heavy throwing spear',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'dart'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 15),
        onConsume: (state) => {
            let soul_weapon = {name: "Dart Spear",    min_dmg: 6, max_dmg: 12, dmg_type: 'pierce', bonus_stat: 'str', stunning: 15, accuracy: 9, range: 15, speed: 33};
            let tpm_weapon = state.player.weapon;
            state.player.weapon = soul_weapon;
            state = attack(state, {
                attacker: 'player',
                defender: 'target',
                onHit: (state, dmg) => {  state.chat.unshift({text: "player " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                onMiss: (state, chance) => { state.chat.unshift({text: "player  Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
            });
            state.player.weapon = tpm_weapon;
            return state;
        }},
    bomb: { name: 'Poison Bomb', cost: {'player.money': 10}, text: 'Poisons the target and those standing nearby',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'bomb'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 20),
        onConsume: (state) => {
            state.target.effects.poison += 25;// -= _.random(1, 10) + _.random(1, getRangeBetween(state));
            state.player.effects.poison += 20 - getRangeBetween(state);//_.random(1, 19 - getRangeBetween(state));
            state.player.action_timer += 20;
            return state;
        }},
    web: { name: 'Web Net', cost: {'player.money': 10}, text: 'Entangles the target and makes it inactive for a long time',
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => buy(state, 'web'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 25),
        onConsume: (state) => {
            state.player.action_timer += 20;
            state.target.action_timer += 100;
            return state;
        }},
};































