
import _ from 'lodash';
import {getActionDelay, isTargetInRange, blink, attack} from './game_math';
import {genWeapon} from './weapons';


export const actions = {

    move_left: {name: "Go <", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'move_left';
            state.player.action_timer += getActionDelay(10, state.player);
            state.battleground.player = Math.max(0, state.battleground.player - 1);
            state.chat.unshift({text: "You Go < "});
            return state;
        }},
    move_right: {name: "Go >", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === state.battleground.target - 1,
        onClick: (state) => {
            state.player.action = 'move_right';
            state.player.action_timer += getActionDelay(10, state.player);
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 1);
            state.chat.unshift({text: "You Go > "});
            return state;
        }},
    run_left: {name: "Run <", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'run_left';
            state.player.action_timer += getActionDelay(20, state.player);
            state.battleground.player = Math.max(0, state.battleground.player - 4 - state.player.stats.dex);
            state.chat.unshift({text: "You Run < "});
            return state;
        }},
    run_right: {name: "Run >", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player >= (state.battleground.target - 4 + state.player.stats.dex),
        onClick: (state) => {
            state.player.action = 'run_right';
            state.player.action_timer += getActionDelay(20, state.player);
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 4 + state.player.stats.dex);
            state.chat.unshift({text: "You Run > "});
            return state;
        }},


    hit:  {name: "Hit!", cost: {'player.sp': 1}, isLocked: (state) => state.player.stats.str < 1,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, state.player.weapon.range),
        onClick: (state) => {
            state.player.action = 'hit';
            state = attack(state,
                {
                    attacker: 'player',
                    defender: 'target',
                    onHit: (state, dmg) => {  state.chat.unshift({text: "You Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: "You Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    push: {name: "Push", cost: {'player.sp': 2}, isLocked: (state) => state.player.stats.str < 2,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, 2),
        onClick: (state) => {
            state.player.action = 'push';
            state.player.action_timer += 20;
            state.target.hp -= 5; // Переделать на механику удара собственным оружием
            state.battleground.target = Math.min(100, state.battleground.target + state.player.stats.str);
            state.target.action_timer += _.random(1, 10 + state.player.stats.str);
            return state;
        }},
    sprint: {name: "Sprint", cost: {'player.sp': 3}, isLocked: (state) => state.player.stats.str < 3,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player >= (state.battleground.target - 9 + state.player.stats.dex + state.player.stats.str),
        onClick: (state) => {
            state.player.action = 'sprint';
            state.player.action_timer += getActionDelay(20, state.player);
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 9 + state.player.stats.dex + state.player.stats.str);
            state.chat.unshift({text: "You Sprint"});
            return state;
        }},


    roll: {name: "Roll", cost: {'player.sp': 1}, isLocked: (state) => state.player.stats.dex < 1,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'roll';
            state.player.action_timer += getActionDelay(10, state.player);
            state.battleground.player = Math.max(0, state.battleground.player - state.player.stats.dex);
            state.chat.unshift({text: "You Roll"});
            return state;
        }},
    parry: {name: "Parry", cost: {'player.sp': 2}, isLocked: (state) => state.player.stats.dex < 2,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'parry';
            state.player.action_timer += getActionDelay(50, state.player);
            return state;
        }},
    jump: {name: "Flip", cost: {'player.sp': 3}, isLocked: (state) => state.player.stats.dex < 3,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => blink(state, 10 + state.player.stats.dex)},


    block: {name: "Block", cost: {'player.sp': 1}, isLocked: (state) => state.player.stats.con < 1,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'block';
            state.player.action_timer += getActionDelay(50, state.player);
            return state;
        }},
    buff: {name: "Buff", cost: {'player.sp': 2}, isLocked: (state) => state.player.stats.con < 2,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'buff';
            state.player.action_timer += getActionDelay(10, state.player);
            state.player.effects.buff++;
            return state;
        }},
    rage: {name: "Rage", cost: {'player.sp': 3}, isLocked: (state) => state.player.stats.con < 3,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action = 'rage';
            state.player.action_timer += getActionDelay(20, state.player);
            state.player.effects.rage++;
            return state;
        }},


    heal: {name: "Heal", cost: {'player.mp': 1}, isLocked: (state) => state.player.stats.wiz < 1,
        isDisabled: (state) => (state.player.action_timer) || state.player.hp >= state.player.max_hp,
        onClick: (state) => {
            state.player.action = 'heal';
            state.player.action_timer += getActionDelay(30, state.player);
            let hp = Math.min(state.player.max_hp - state.player.hp, 3 + (state.player.level * _.random(1, state.player.stats.wiz)));
            state.player.hp += hp;
            state.chat.unshift({text: "You Heal " + hp});
            return state;
        }},
    freeze: {name: "Freeze", cost: {'player.mp': 2}, isLocked: (state) => state.player.stats.wiz < 2,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, 25),
        onClick: (state) => {
            state.player.action = 'freeze';
            state.player.action_timer += getActionDelay(30, state.player);
            let fire = state.player.level + _.random(1, state.player.stats.wiz);
            state.target.hp -= fire;
            state.target.action_timer -= fire;
            state.chat.unshift({text: "You Freeze " + fire});
            return state;
        }},
    sword: {name: "Conjure", cost: {'player.mp': 3}, isLocked: (state) => state.player.stats.wiz < 3,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, 5),
        onClick: (state) => {
            state.player.action = 'sword';

            let soul_weapon = genWeapon(state.player.stats.wiz);
            soul_weapon.name = 'Soul ' + soul_weapon.name;
            soul_weapon.range = 5;
            soul_weapon.max_dmg += state.player.stats.wiz;
            soul_weapon.bonus_stat += 'wiz';

            let tpm_weapon = state.player.weapon;
            state.player.weapon = soul_weapon;
            state = attack(state, {
                    attacker: 'player',
                    defender: 'target',
                    onHit: (state, dmg) => {  state.chat.unshift({text: "You " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: "You Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state.player.weapon = tpm_weapon;

            return state;
        }},


    blast: {name: "Blast", cost: {'player.mp': 1}, isLocked: (state) => state.player.stats.int < 1,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, 50),
        onClick: (state) => {
            state.player.action = 'blast';
            state.player.action_timer += getActionDelay(25, state.player);
            let fire = 1 + state.player.level + _.random(1, state.player.stats.int);
            state.target.hp -= fire;
            state.chat.unshift({text: "You Blast " + fire});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 2}, isLocked: (state) => state.player.stats.int < 2,
        isDisabled: (state) => (state.player.action_timer) || !isTargetInRange(state, 25),
        onClick: (state) => {
            state.player.action = 'fire';
            state.player.action_timer += getActionDelay(30, state.player);
            let fire = state.player.level * _.random(1, state.player.stats.int);
            state.target.hp -= fire;
            state.target.effects.fire++;
            state.chat.unshift({text: "You Fire " + fire});
            return state;
        }},
    blink: {name: "Blink", cost: {'player.mp': 3}, isLocked: (state) => state.player.stats.int < 3,
        isDisabled: (state) => (state.player.action_timer),
        onClick: (state) => blink(state, 25 + state.player.stats.int)},

};