
import _ from 'lodash';

import {getActionDelay, isTargetInRange, blink, attack, hit} from '../game_math';
import {effects_0} from '../models/unit';
import {getWeapon, getArmor} from '../equipment';


export const actions = {

    move_left: {name: "Go left", cost: {},
        text: "Take a step from the enemy",
        isHidden: false,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'move_left';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 10);
            state.battleground[params.attacker] = Math.max(0, state.battleground[params.attacker] - 1);
            state.chat.unshift({text: params.attacker + "  Go < "});
            return state;
        }},
    move_right: {name: "Go right", cost: {},
        text: "Take a step towards the enemy",
        isHidden: false,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === state.battleground[params.defender] - 1,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'move_right';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 10);
            state.battleground[params.attacker] = Math.min(state.battleground[params.defender] - 1, state.battleground[params.attacker] + 1);
            state.chat.unshift({text: params.attacker + "  Go > "});
            return state;
        }},
    run_left: {name: "Run left", cost: {'player.sp': 1},
        text: "Run from the enemy",
        isHidden: false,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'run_left';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 20);
            state.battleground[params.attacker] = Math.max(0, state.battleground[params.attacker] - 4 - state[params.attacker].stats.dex);
            state.chat.unshift({text: params.attacker + "  Run < "});
            return state;
        }},
    run_right: {name: "Run right", cost: {'player.sp': 1},
        text: "Run towards enemy",
        isHidden: false,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] >= (state.battleground[params.defender] - 4 + state[params.attacker].stats.dex),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'run_right';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 20);
            state.battleground[params.attacker] = Math.min(state.battleground[params.defender] - 1, state.battleground[params.attacker] + 4 + state[params.attacker].stats.dex);
            state.chat.unshift({text: params.attacker + "  Run > "});
            return state;
        }},


    hit:  {name: "Hit!", cost: {'player.sp': 1},  
        text: "Damages the params.defender by weapon if the params.defender did not block or dodge",
        isHidden: (state, params = {}) => state[params.attacker].stats.str < 1,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'hit';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    push: {name: "Push", cost: {'player.sp': 2},  
        text: "Hit that stuns the params.defender and throws them back",
        isHidden: (state, params = {}) => state[params.attacker].stats.str < 2,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 2),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'push';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {
                        state.chat.unshift({text: params.attacker + " Push! Damage: " + dmg});
                        state.battleground[params.defender] = Math.min(100, state.battleground[params.defender] + state[params.attacker].stats.str);
                        state[params.defender].action_timer += _.random(1, 10 + state[params.attacker].stats.str);
                        return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + " Push Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    sprint: {name: "Sprint", cost: {'player.sp': 3},  
        text: "Fast and long sprint which pushed the params.defender back if the params.attacker gets to them",
        isHidden: (state, params = {}) => state[params.attacker].stats.str < 3,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] >= (state.battleground[params.defender] - 9 + state[params.attacker].stats.dex + state[params.attacker].stats.str),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'sprint';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 15);
            let long = 9 + state[params.attacker].stats.dex + state[params.attacker].stats.str;
            let new_point = Math.min(99, state.battleground[params.attacker] + long);
            state.battleground[params.attacker] = new_point;
            if (state.battleground[params.defender] < new_point) state.battleground[params.defender]++;
            //state.battleground[params.attacker] = Math.min(state.battleground[params.defender] - 1, state.battleground[params.attacker] + 9 + state[params.attacker].stats.dex + state[params.attacker].stats.str);
            state.chat.unshift({text: params.attacker + "  Sprint"});
            return state;
        }},
    roar: {name: "Roar", cost: {'player.sp': 4},  
        text: "Shout that scares the params.defender, their damage decreases",
        isHidden: (state, params = {}) => state[params.attacker].stats.str < 4,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'roar';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 40);
            state[params.defender].action_timer += 10 * state[params.attacker].stats.str;
            state[params.defender].effects.fright++;
            state.chat.unshift({text: params.attacker + " Roar"});
            return state;
        }
    },
    double: {name: "Double", cost: {'player.sp': 5},  
        text: "Two attacks in a row",
        isHidden: (state, params = {}) => state[params.attacker].stats.str < 5,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'double';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            return state;
        }
    },

    roll: {name: "Roll", cost: {'player.sp': 1},  
        text: "Fast jump back that gives invulnerability during action time",
        isHidden: (state, params = {}) => state[params.attacker].stats.dex < 1,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'roll';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 10);
            state.battleground[params.attacker] = Math.max(0, state.battleground[params.attacker] - state[params.attacker].stats.dex);
            state.chat.unshift({text: params.attacker + "  Roll"});
            return state;
        }},
    parry: {name: "Parry", cost: {'player.sp': 2},  
        text: "Stance which blocks next attack of the params.defender and turns it into counterattack",
        isHidden: (state, params = {}) => state[params.attacker].stats.dex < 2,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'parry';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 50);
            return state;
        }},
    poison: {name: "Poison", cost: {'player.sp': 3},  
        text: "Hit that poisoning the params.defender instead of damaging",
        isHidden: (state, params = {}) => state[params.attacker].stats.dex < 3,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'poison';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {
                        state[params.defender].hp += dmg;
                        state[params.defender].effects.poison += dmg;
                        state.chat.unshift({text: params.attacker + " Poison: " + dmg});
                        return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + " Poison Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    exhaust: {name: "Exhaust", cost: {'player.sp': 4},  
        text: "Attack that decreases SP of the params.defender",
        isHidden: (state, params = {}) => state[params.attacker].stats.dex < 4,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'exhaust';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {
                        let ex_sp = Math.min(state[params.defender].sp, _.random(1, state[params.attacker].stats.dex));
                        state[params.defender].sp -= ex_sp;
                        state.chat.unshift({text: params.attacker + " Exhaust " + ex_sp + " sp! Damage: " + dmg});
                        return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + " Exhaust Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            return state;
        }
    },
    flip: {name: "Flip", cost: {'player.sp': 5},  
        text: "Hit with Roll!",
        isHidden: (state, params = {}) => state[params.attacker].stats.dex < 5,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {            
            state[params.attacker].action = 'flip';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            state.chat.unshift({text: params.attacker + "  name"});
            return state;
        }
    },

    block: {name: "Block", cost: {'player.sp': 1},  
        text: "Stance which blocks next attack of the params.defender and stuns the params.attacker",
        isHidden: (state, params = {}) => state[params.attacker].stats.con < 1,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'block';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 50);
            return state;
        }},
    regen: {name: "Regen", cost: {'player.sp': 2},  
        text: "Buff that regains the params.attacker's HP during the round",
        isHidden: (state, params = {}) => state[params.attacker].stats.con < 2,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'regen';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 10);
            state[params.attacker].effects.regen++;
            return state;
        }},
    rage: {name: "Rage", cost: {'player.sp': 3},  
        text: "Buff that increases damage in exchange for hurt a little",
        isHidden: (state, params = {}) => state[params.attacker].stats.con < 3,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state.battleground[params.attacker] === 0,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'rage';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 10);
            state[params.attacker].hp--;
            state[params.attacker].effects.rage++;
            return state;
        }},
    trance: {name: "Trance", cost: {'player.sp': 4},  
        text: "Power stance that regenerate MP. Damage will turn into SP",
        isHidden: (state, params = {}) => state[params.attacker].stats.con < 4,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => {            
            state[params.attacker].action = 'trance';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 100);
            state.chat.unshift({text: params.attacker + " in Trance"});
            return state;
        }
    },
    stun: {name: "Stun", cost: {'player.sp': 5},  
        text: "Attack which heavy stuns the params.defender",
        isHidden: (state, params = {}) => state[params.attacker].stats.con < 5,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, getWeapon(state, params.attacker).range),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'stunning';
            state = attack(state,
                {
                    attacker: params.attacker,
                    defender: params.defender,
                    onHit: (state, dmg) => {
                        state.chat.unshift({text: params.attacker + " Stun! Damage: " + dmg});
                        state[params.defender].action_timer += 10 * state[params.attacker].stats.con;
                        return state; },
                    onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + " Stun Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
                });
            state.chat.unshift({text: params.attacker + "  name"});
            return state;
        }
    },


    heal: {name: "Heal", cost: {'player.mp': 1},  
        text: "Light heal and cure poison",
        isHidden: (state, params = {}) => state[params.attacker].stats.wiz < 1,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || state[params.attacker].hp >= state[params.attacker].max_hp,
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'heal';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 30);
            let hp = Math.min(state[params.attacker].max_hp - state[params.attacker].hp, _.random(1 + state[params.attacker].stats.wiz, 3 + state[params.attacker].level + state[params.attacker].stats.wiz));
            state[params.attacker].hp += hp;
            state[params.attacker].effects.poison = Math.max(0, state[params.attacker].effects.poison - hp);
            state.chat.unshift({text: params.attacker + "  Heal " + hp});
            return state;
        }},
    freeze: {name: "Freeze", cost: {'player.mp': 2},  
        text: "The stream of ice stuns, slightly hurts and freezes the target, slowing it down for the entire fight",
        isHidden: (state, params = {}) => state[params.attacker].stats.wiz < 2,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'freeze';
            state[params.attacker].effects.fire = Math.max(0, state[params.attacker].effects.fire - 1);
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 30);
            let atk = _.random(state[params.attacker].stats.wiz, state[params.attacker].level + state[params.attacker].stats.wiz);
            let fire = hit(state, params.attacker, params.defender, atk, 'cold');
            state[params.defender].hp -= fire;
            state[params.defender].action_timer += fire * state[params.attacker].stats.wiz;
            state[params.defender].effects.freeze += state[params.attacker].stats.wiz;
            state.chat.unshift({text: params.attacker + "  Freeze " + fire});
            return state;
        }},
    sword: {name: "sword", cost: {'player.mp': 3},  
        text: "Conjure Soul Sword 5ft long that cuts the target",
        isHidden: (state, params = {}) => state[params.attacker].stats.wiz < 3,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 5),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'sword';

            let soul_weapon = {name: "Soul Sword",    min_dmg: 1 + state[params.attacker].stats.wiz, max_dmg: 5 + (2 * state[params.attacker].stats.wiz), dmg_type: 'cutting', bonus_stat: 'wiz', stunning: 25, accuracy: 15, range: 5, speed: 50};

            let tpm_weapon = state[params.attacker].weapon;
            state[params.attacker].weapon = soul_weapon;
            state = attack(state, {
                attacker: params.attacker,
                defender: params.defender,
                onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
            });
            state[params.attacker].weapon = tpm_weapon;

            return state;
        }},
    iceshield: {name: "Shield", cost: {'player.mp': 4},
        text: "Clears all effects and creates an ice shield that blocks the next hit",
        isHidden: (state, params = {}) => state[params.attacker].stats.wiz < 4,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'iceshield';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 40);
            state[params.attacker].effects.firestorm = 0;
            state[params.attacker].effects = effects_0;
            state[params.attacker].effects.iceshield++;
            state.chat.unshift({text: params.attacker + " Cast Iceshield"});
            return state;
        }
    },
    spear: {name: "Spear", cost: {'player.mp': 5},  
        text: "Conjure Soul Spear 15ft long that pierces the target",
        isHidden: (state, params = {}) => state[params.attacker].stats.wiz < 5,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 15),
        onAction: (state, params = {}) => {            
            state[params.attacker].action = 'spear';

            let soul_weapon = {name: "Soul Spear",    min_dmg: 5 + state[params.attacker].stats.wiz, max_dmg: 10 + (2 * state[params.attacker].stats.wiz), dmg_type: 'pierce', bonus_stat: 'wiz', stunning: 40, accuracy: 10, range: 15, speed: 75};

            let tpm_weapon = state[params.attacker].weapon;
            state[params.attacker].weapon = soul_weapon;
            state = attack(state, {
                attacker: params.attacker,
                defender: params.defender,
                onHit: (state, dmg) => {  state.chat.unshift({text: params.attacker + "  " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                onMiss: (state, Prob) => { state.chat.unshift({text: params.attacker + "  Miss! Prob: " + Prob.toFixed(0) + '%'}); return state; },
            });
            state[params.attacker].weapon = tpm_weapon;
            return state;
        }
    },


    blast: {name: "Blast", cost: {'player.mp': 1},  
        text: "A clot of dark energy that overtakes the target at a great distance",
        isHidden: (state, params = {}) => state[params.attacker].stats.int < 1,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 50),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'blast';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 25);
            let atk = _.random(state[params.attacker].stats.int, 2 + state[params.attacker].level + state[params.attacker].stats.int);
            let fire = hit(state, params.attacker, params.defender, atk, 'dark');
            state[params.defender].hp -= fire;
            state.chat.unshift({text: params.attacker + "  Blast " + fire});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 2},  
        text: "The stream of fire damages and sets the target on fire, inflicting damage on the entire fight",
        isHidden: (state, params = {}) => state[params.attacker].stats.int < 2,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, params = {}) => {
            state[params.attacker].action = 'fire';
            state[params.attacker].effects.freeze = Math.max(0, state[params.attacker].effects.freeze - 1);
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 30);
            let atk = _.random(state[params.attacker].stats.int, state[params.attacker].level * state[params.attacker].stats.int);
            let fire = hit(state, params.attacker, params.defender, atk, 'fire');
            state[params.defender].hp -= fire;
            state[params.defender].effects.fire++;
            state.chat.unshift({text: params.attacker + "  Fire " + fire});
            return state;
        }},
    blink: {name: "Blink", cost: {'player.mp': 3}, 
        text: "Instant teleportation within 25 steps in random direction is the best way to change the position in combat",
        isHidden: (state, params = {}) => state[params.attacker].stats.int < 3,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => blink(state, 25 + state[params.attacker].stats.int)},
    firestorm: {name: "Storm", cost: {'player.mp': 4},
        text: "Firestorm clears freeze, fright and poison effects and creates an fire shield that inflicting damage on target if they 5ft or closer",
        isHidden: (state, params = {}) => state[params.attacker].stats.int < 4,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => {            
            state[params.attacker].action = 'firestorm';
            state[params.attacker].action_timer += getActionDelay(state, params.attacker, 40);
            state[params.attacker].effects.iceshield = 0;
            state[params.attacker].effects.freeze = Math.max(0, state[params.attacker].effects.freeze - 5);
            state[params.attacker].effects.fright = Math.max(0, state[params.attacker].effects.fright - 5);
            state[params.attacker].effects.poison = Math.max(0, state[params.attacker].effects.poison - 5);
            state[params.attacker].effects.firestorm++;
            state.chat.unshift({text: params.attacker + " Rise Firestorm"});
            return state;
        }
    },
    banish: {name: "Banish", cost: {'player.mp': 5},
        text: "Cuts half ot HP of params.defender, rounded down",
        isHidden: (state, params = {}) => state[params.attacker].stats.int < 5,
        isNotAllowed: (state, params = {}) => (state[params.attacker].action_timer),
        onAction: (state, params = {}) => {            
            state[params.attacker].action = 'banish';
            state[params.defender].hp = Math.ceil(state[params.defender].hp / 2);
            state.chat.unshift({text: params.defender + " Banished"});
            return state;
        }
    },

};