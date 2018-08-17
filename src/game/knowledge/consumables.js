
import _ from 'lodash';

import {isTargetInRange, getRangeBetween, blink, attack, hit, getActionDelay, getLoad, getMaxLoad} from '../game_math';

const buy = (state, item_key) => {
    state.player.belt.push(item_key);
    //if (state.player.belt.length >= 6) state.tab = 'inventory';
    return state;
};

export const consumables = {
    heal: { name: 'HP Pot', cost: {'player.money': 10}, text: 'Restore HP and cure poison', load: 3,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.heal.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'heal'),
        consumableIf: (state, params = {}) => state[params.attacker].hp < state[params.attacker].max_hp && !state[params.attacker].action_timer && state.in_fight,
        onConsume: (state, params = {}) => {
            state[params.attacker].action_timer += getActionDelay(10, state[params.attacker]);
            state[params.attacker].effects.poison = Math.max(0, state[params.attacker].effects.poison - 20);
            state[params.attacker].hp = Math.min(state[params.attacker].hp + 20, state[params.attacker].max_hp);
            state.chat.unshift({text: "Consume " + consumables.heal.name});
            return state;
    }},
    stamina: { name: 'SP Pot', cost: {'player.money': 10}, text: 'Restore SP and warm ice', load: 3,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.stamina.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'stamina'),
        consumableIf: (state, params = {}) => state[params.attacker].sp < state[params.attacker].max_sp && !state[params.attacker].action_timer && state.in_fight,
        onConsume: (state, params = {}) => {
            state[params.attacker].action_timer += getActionDelay(10, state[params.attacker]);
            state[params.attacker].effects.freeze = Math.max(0, state[params.attacker].effects.freeze - 10);
            state[params.attacker].sp = Math.min(state[params.attacker].sp + 10, state[params.attacker].max_sp);
            state.chat.unshift({text: "Consume " + consumables.stamina.name});
            return state;
    }},
    manna: { name: 'MP Pot', cost: {'player.money': 10}, text: 'Restore MP and extinguish fire', load: 3,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.manna.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'manna'),
        consumableIf: (state, params = {}) => state[params.attacker].mp < state[params.attacker].max_mp && !state[params.attacker].action_timer && state.in_fight,
        onConsume: (state, params = {}) => {
            state[params.attacker].action_timer += getActionDelay(10, state[params.attacker]);
            state[params.attacker].effects.fire = Math.max(0, state[params.attacker].effects.fire - 5);
            state[params.attacker].mp = Math.min(state[params.attacker].mp + 5, state[params.attacker].max_mp);
            state.chat.unshift({text: "Consume " + consumables.manna.name});
            return state;
    }},

    blink: { name: 'Blink Scroll', cost: {'player.money': 10}, text: 'Scroll of Random Teleportation', load: 1,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.blink.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'blink'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight,
        onConsume: (state, params = {}) => {
            state.chat.unshift({text: "Consume " + consumables.blink.name});
            return blink(state, 42);
        }},
    wave: { name: 'Wave Scroll', cost: {'player.money': 10}, text: 'Pushes, stuns and freezes the target', load: 1,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.wave.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'wave'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight && isTargetInRange(state, 42),
        onConsume: (state, params = {}) => {
            state.battleground.target = Math.min(100, state.battleground.target + 10);
            state[params.defender].action_timer += 30;
            state[params.defender].effects.freeze += 10;
            state[params.attacker].action_timer += getActionDelay(10, state[params.attacker]);
            state.chat.unshift({text: "Consume " + consumables.wave.name});
            return state;
        }},
    fire: { name: 'Fire Scroll', cost: {'player.money': 10}, text: 'Damage and ignite target', load: 1,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.fire.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'fire'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight && isTargetInRange(state, 13),
        onConsume: (state, params = {}) => {
            let atk = _.random((state[params.attacker].stats.wiz + state[params.attacker].stats.int), 4 * (state[params.attacker].stats.wiz + state[params.attacker].stats.int));
            let fire = hit(state, 'player', 'target', atk, 'fire');
            state[params.defender].hp -= fire;
            state[params.defender].effects.fire += 5;
            state[params.attacker].action_timer += getActionDelay(10, state[params.attacker]);
            state.chat.unshift({text: "Consume " + consumables.fire.name});
            return state;
        }},

    dart: { name: 'Dart Spear', cost: {'player.money': 10}, text: 'Heavy throwing spear', load: 5,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.dart.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'dart'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight && isTargetInRange(state, 15),
        onConsume: (state, params = {}) => {
            let soul_weapon = {name: "Dart Spear",    min_dmg: 6, max_dmg: 12, dmg_type: 'pierce', bonus_stat: 'str', stunning: 15, accuracy: 9, range: 15, speed: 33};
            let tpm_weapon = state[params.attacker].weapon;
            state[params.attacker].weapon = soul_weapon;
            state = attack(state, {
                attacker: 'player',
                defender: 'target',
                onHit: (state, dmg) => {  state.chat.unshift({text: "player " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                onMiss: (state, Prob) => { state.chat.unshift({text: "player  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
            });
            state[params.attacker].weapon = tpm_weapon;
            state.chat.unshift({text: "Consume " + consumables.dart.name});
            return state;
        }},
    bomb: { name: 'Poison Bomb', cost: {'player.money': 10}, text: 'Poisons the target and those standing nearby', load: 5,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.bomb.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'bomb'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight && isTargetInRange(state, 20),
        onConsume: (state, params = {}) => {
            state[params.defender].effects.poison += 25;// -= _.random(1, 10) + _.random(1, getRangeBetween(state));
            state[params.attacker].effects.poison += 20 - getRangeBetween(state);//_.random(1, 19 - getRangeBetween(state));
            state[params.attacker].action_timer += getActionDelay(20, state[params.attacker]);
            state.chat.unshift({text: "Consume " + consumables.bomb.name});
            return state;
        }},
    web: { name: 'Web Net', cost: {'player.money': 10}, text: 'Entangles the target and makes it inactive for a long time', load: 5,
        isDisabled: (state, params = {}) => state[params.attacker].belt.length >= 6 || getLoad(state[params.attacker]) + consumables.web.load > getMaxLoad(state[params.attacker]),
        onClick: (state, params = {}) => buy(state, 'web'),
        consumableIf: (state, params = {}) => !state[params.attacker].action_timer && state.in_fight && isTargetInRange(state, 25),
        onConsume: (state, params = {}) => {
            state[params.attacker].action_timer += getActionDelay(20, state[params.attacker]);
            state[params.defender].action_timer += 100;
            state.chat.unshift({text: "Consume " + consumables.web.name});
            return state;
        }},
};































