
import _ from 'lodash';
import {getActionDelay, isTargetInRange, blink, attack} from './game_math';
import {genWeapon} from './weapons';


export const actions = {

    move_left: {name: "Go <", cost: {}, isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'move_left';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - 1);
            state.chat.unshift({text: attacker + "  Go < "});
            return state;
        }},
    move_right: {name: "Go >", cost: {}, isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === state.battleground[defender] - 1,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'move_right';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 1);
            state.chat.unshift({text: attacker + "  Go > "});
            return state;
        }},
    run_left: {name: "Run <", cost: {'player.sp': 1}, isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'run_left';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - 4 - state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Run < "});
            return state;
        }},
    run_right: {name: "Run >", cost: {'player.sp': 1}, isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] >= (state.battleground[defender] - 4 + state[attacker].stats.dex),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'run_right';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 4 + state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Run > "});
            return state;
        }},


    hit:  {name: "Hit!", cost: {'player.sp': 1}, isHidden: (state, attacker, defender) => state[attacker].stats.str < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'hit';
            state = attack(state,
                {
                    attacker: 'player',
                    defender: 'target',
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    push: {name: "Push", cost: {'player.sp': 2}, isHidden: (state, attacker, defender) => state[attacker].stats.str < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 2),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'push';
            state[attacker].action_timer += 20;
            state[defender].hp -= 5; // Переделать на механику удара собственным оружием
            state.battleground[defender] = Math.min(100, state.battleground[defender] + state[attacker].stats.str);
            state[defender].action_timer += _.random(1, 10 + state[attacker].stats.str);
            return state;
        }},
    sprint: {name: "Sprint", cost: {'player.sp': 3}, isHidden: (state, attacker, defender) => state[attacker].stats.str < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] >= (state.battleground[defender] - 9 + state[attacker].stats.dex + state[attacker].stats.str),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'sprint';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 9 + state[attacker].stats.dex + state[attacker].stats.str);
            state.chat.unshift({text: attacker + "  Sprint"});
            return state;
        }},


    roll: {name: "Roll", cost: {'player.sp': 1}, isHidden: (state, attacker, defender) => state[attacker].stats.dex < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'roll';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Roll"});
            return state;
        }},
    parry: {name: "Parry", cost: {'player.sp': 2}, isHidden: (state, attacker, defender) => state[attacker].stats.dex < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'parry';
            state[attacker].action_timer += getActionDelay(50, state[attacker]);
            return state;
        }},
    jump: {name: "Flip", cost: {'player.sp': 3}, isHidden: (state, attacker, defender) => state[attacker].stats.dex < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => blink(state, 10 + state[attacker].stats.dex)},


    block: {name: "Block", cost: {'player.sp': 1}, isHidden: (state, attacker, defender) => state[attacker].stats.con < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'block';
            state[attacker].action_timer += getActionDelay(50, state[attacker]);
            return state;
        }},
    buff: {name: "Buff", cost: {'player.sp': 2}, isHidden: (state, attacker, defender) => state[attacker].stats.con < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'buff';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state[attacker].effects.buff++;
            return state;
        }},
    rage: {name: "Rage", cost: {'player.sp': 3}, isHidden: (state, attacker, defender) => state[attacker].stats.con < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'rage';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state[attacker].effects.rage++;
            return state;
        }},


    heal: {name: "Heal", cost: {'player.mp': 1}, isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state[attacker].hp >= state[attacker].max_hp,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'heal';
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let hp = Math.min(state[attacker].max_hp - state[attacker].hp, 3 + (2 * state[attacker].level * _.random(1, state[attacker].stats.wiz)));
            state[attacker].hp += hp;
            state.chat.unshift({text: attacker + "  Heal " + hp});
            return state;
        }},
    freeze: {name: "Freeze", cost: {'player.mp': 2}, isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'freeze';
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let fire = state[attacker].level + _.random(1, state[attacker].stats.wiz);
            state[defender].hp -= fire;
            state[defender].action_timer -= fire;
            state.chat.unshift({text: attacker + "  Freeze " + fire});
            return state;
        }},
    sword: {name: "Conjure", cost: {'player.mp': 3}, isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 5),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'sword';

            let soul_weapon = genWeapon(state[attacker].stats.wiz);
            soul_weapon.name = 'Soul ' + soul_weapon.name;
            soul_weapon.range = 5;
            soul_weapon.max_dmg += state[attacker].stats.wiz;
            soul_weapon.bonus_stat += 'wiz';

            let tpm_weapon = state[attacker].weapon;
            state[attacker].weapon = soul_weapon;
            state = attack(state, {
                    attacker: 'player',
                    defender: 'target',
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state[attacker].weapon = tpm_weapon;

            return state;
        }},


    blast: {name: "Blast", cost: {'player.mp': 1}, isHidden: (state, attacker, defender) => state[attacker].stats.int < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 50),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'blast';
            state[attacker].action_timer += getActionDelay(25, state[attacker]);
            let fire = 1 + state[attacker].level + _.random(1, state[attacker].stats.int);
            state[defender].hp -= fire;
            state.chat.unshift({text: attacker + "  Blast " + fire});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 2}, isHidden: (state, attacker, defender) => state[attacker].stats.int < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'fire';
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let fire = state[attacker].level * _.random(1, state[attacker].stats.int);
            state[defender].hp -= fire;
            state[defender].effects.fire++;
            state.chat.unshift({text: attacker + "  Fire " + fire});
            return state;
        }},
    blink: {name: "Blink", cost: {'player.mp': 3}, isHidden: (state, attacker, defender) => state[attacker].stats.int < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => blink(state, 25 + state[attacker].stats.int)},

};