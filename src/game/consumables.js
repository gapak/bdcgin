
import _ from 'lodash';

import {isTargetInRange, getRangeBetween, blink, attack, hit, getActionDelay, getLoad, getMaxLoad} from './game_math';

const buy = (state, item_key) => {
    state.player.belt.push(item_key);
    if (state.player.belt.length >= 6) state.tab = 'inventory';
    return state;
};

export const consumables = {
    heal: { name: 'HP Pot', cost: {'player.money': 10}, text: 'Restore HP and cure poison', load: 3,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.heal.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'heal'),
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += getActionDelay(10, state.player);
            state.player.effects.poison = Math.max(0, state.player.effects.poison - 20);
            state.player.hp = Math.min(state.player.hp + 20, state.player.max_hp);
            state.chat.unshift({text: "Consume " + consumables.heal.name});
            return state;
    }},
    stamina: { name: 'SP Pot', cost: {'player.money': 10}, text: 'Restore SP and warm ice', load: 3,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.stamina.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'stamina'),
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += getActionDelay(10, state.player);
            state.player.effects.freeze = Math.max(0, state.player.effects.freeze - 10);
            state.player.sp = Math.min(state.player.sp + 10, state.player.max_sp);
            state.chat.unshift({text: "Consume " + consumables.stamina.name});
            return state;
    }},
    manna: { name: 'MP Pot', cost: {'player.money': 10}, text: 'Restore MP and extinguish fire', load: 3,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.manna.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'manna'),
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += getActionDelay(10, state.player);
            state.player.effects.fire = Math.max(0, state.player.effects.fire - 5);
            state.player.mp = Math.min(state.player.mp + 5, state.player.max_mp);
            state.chat.unshift({text: "Consume " + consumables.manna.name});
            return state;
    }},

    blink: { name: 'Blink Scroll', cost: {'player.money': 10}, text: 'Scroll of Random Teleportation', load: 1,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.blink.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'blink'),
        consumableIf: (state) => !state.player.action_timer,
        onConsume: (state) => {
            state.chat.unshift({text: "Consume " + consumables.blink.name});
            return blink(state, 42);
        }},
    wave: { name: 'Wave Scroll', cost: {'player.money': 10}, text: 'Pushes, stuns and freezes the target', load: 1,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.wave.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'wave'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 42),
        onConsume: (state) => {
            state.battleground.target = Math.min(100, state.battleground.target + 10);
            state.target.action_timer += 30;
            state.target.effects.freeze += 10;
            state.player.action_timer += getActionDelay(10, state.player);
            state.chat.unshift({text: "Consume " + consumables.wave.name});
            return state;
        }},
    fire: { name: 'Fire Scroll', cost: {'player.money': 10}, text: 'Damage and ignite target', load: 1,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.fire.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'fire'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 13),
        onConsume: (state) => {
            let atk = _.random((state.player.stats.wiz + state.player.stats.int), 4 * (state.player.stats.wiz + state.player.stats.int));
            let fire = hit(state, 'player', 'target', atk, 'fire');
            state.target.hp -= fire;
            state.target.effects.fire += 5;
            state.player.action_timer += getActionDelay(10, state.player);
            state.chat.unshift({text: "Consume " + consumables.fire.name});
            return state;
        }},

    dart: { name: 'Dart Spear', cost: {'player.money': 10}, text: 'Heavy throwing spear', load: 5,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.dart.load > getMaxLoad(state.player),
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
                onMiss: (state, Prob) => { state.chat.unshift({text: "player  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
            });
            state.player.weapon = tpm_weapon;
            state.chat.unshift({text: "Consume " + consumables.dart.name});
            return state;
        }},
    bomb: { name: 'Poison Bomb', cost: {'player.money': 10}, text: 'Poisons the target and those standing nearby', load: 5,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.bomb.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'bomb'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 20),
        onConsume: (state) => {
            state.target.effects.poison += 25;// -= _.random(1, 10) + _.random(1, getRangeBetween(state));
            state.player.effects.poison += 20 - getRangeBetween(state);//_.random(1, 19 - getRangeBetween(state));
            state.player.action_timer += getActionDelay(20, state.player);
            state.chat.unshift({text: "Consume " + consumables.bomb.name});
            return state;
        }},
    web: { name: 'Web Net', cost: {'player.money': 10}, text: 'Entangles the target and makes it inactive for a long time', load: 5,
        isDisabled: (state) => state.player.belt.length >= 6 || getLoad(state.player) + consumables.web.load > getMaxLoad(state.player),
        onClick: (state) => buy(state, 'web'),
        consumableIf: (state) => !state.player.action_timer && isTargetInRange(state, 25),
        onConsume: (state) => {
            state.player.action_timer += getActionDelay(20, state.player);
            state.target.action_timer += 100;
            state.chat.unshift({text: "Consume " + consumables.web.name});
            return state;
        }},
};































