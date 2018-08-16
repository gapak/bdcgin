
import _ from 'lodash';

import {getActionDelay, isTargetInRange, blink, attack, hit} from './game_math';
import {effects_0} from './unit';


export const actions = {

    move_left: {name: "Go left", cost: {},
        text: "Take a step from the enemy",
        isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'move_left';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - 1);
            state.chat.unshift({text: attacker + "  Go < "});
            return state;
        }},
    move_right: {name: "Go right", cost: {},
        text: "Take a step towards the enemy",
        isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === state.battleground[defender] - 1,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'move_right';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 1);
            state.chat.unshift({text: attacker + "  Go > "});
            return state;
        }},
    run_left: {name: "Run left", cost: {'player.sp': 1},
        text: "Run from the enemy",
        isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'run_left';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - 4 - state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Run < "});
            return state;
        }},
    run_right: {name: "Run right", cost: {'player.sp': 1},
        text: "Run towards enemy",
        isHidden: false,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] >= (state.battleground[defender] - 4 + state[attacker].stats.dex),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'run_right';
            state[attacker].action_timer += getActionDelay(20, state[attacker]);
            state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 4 + state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Run > "});
            return state;
        }},


    hit:  {name: "Hit!", cost: {'player.sp': 1},  
        text: "Damages the defender by weapon if the defender did not block or dodge",
        isHidden: (state, attacker, defender) => state[attacker].stats.str < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'hit';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    push: {name: "Push", cost: {'player.sp': 2},  
        text: "Hit that stuns the defender and throws them back",
        isHidden: (state, attacker, defender) => state[attacker].stats.str < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 2),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'push';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {
                        state.chat.unshift({text: attacker + " Push! Damage: " + dmg});
                        state.battleground[defender] = Math.min(100, state.battleground[defender] + state[attacker].stats.str);
                        state[defender].action_timer += _.random(1, 10 + state[attacker].stats.str);
                        return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + " Push Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    sprint: {name: "Sprint", cost: {'player.sp': 3},  
        text: "Fast and long sprint which pushed the defender back if the attacker gets to them",
        isHidden: (state, attacker, defender) => state[attacker].stats.str < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] >= (state.battleground[defender] - 9 + state[attacker].stats.dex + state[attacker].stats.str),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'sprint';
            state[attacker].action_timer += getActionDelay(15, state[attacker]);
            let long = 9 + state[attacker].stats.dex + state[attacker].stats.str;
            let new_point = Math.min(99, state.battleground[attacker] + long);
            state.battleground[attacker] = new_point;
            if (state.battleground[defender] < new_point) state.battleground[defender]++;
            //state.battleground[attacker] = Math.min(state.battleground[defender] - 1, state.battleground[attacker] + 9 + state[attacker].stats.dex + state[attacker].stats.str);
            state.chat.unshift({text: attacker + "  Sprint"});
            return state;
        }},
    roar: {name: "Roar", cost: {'player.sp': 4},  
        text: "Shout that scares the defender, their damage decreases",
        isHidden: (state, attacker, defender) => state[attacker].stats.str < 4,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'roar';
            state[attacker].action_timer += getActionDelay(40, state[attacker]);
            state[defender].action_timer += 10 * state[attacker].stats.str;
            state[defender].effects.fright++;
            state.chat.unshift({text: attacker + " Roar"});
            return state;
        }
    },
    double: {name: "Double", cost: {'player.sp': 5},  
        text: "Two attacks in a row",
        isHidden: (state, attacker, defender) => state[attacker].stats.str < 5,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'double';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }
    },

    roll: {name: "Roll", cost: {'player.sp': 1},  
        text: "Fast jump back that gives invulnerability during action time",
        isHidden: (state, attacker, defender) => state[attacker].stats.dex < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'roll';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state.battleground[attacker] = Math.max(0, state.battleground[attacker] - state[attacker].stats.dex);
            state.chat.unshift({text: attacker + "  Roll"});
            return state;
        }},
    parry: {name: "Parry", cost: {'player.sp': 2},  
        text: "Stance which blocks next attack of the defender and turns it into counterattack",
        isHidden: (state, attacker, defender) => state[attacker].stats.dex < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'parry';
            state[attacker].action_timer += getActionDelay(50, state[attacker]);
            return state;
        }},
    poison: {name: "Poison", cost: {'player.sp': 3},  
        text: "Hit that poisoning the defender instead of damaging",
        isHidden: (state, attacker, defender) => state[attacker].stats.dex < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'poison';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {
                        state[defender].hp += dmg;
                        state[defender].effects.poison += dmg;
                        state.chat.unshift({text: attacker + " Poison: " + dmg});
                        return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + " Poison Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }},
    exhaust: {name: "Exhaust", cost: {'player.sp': 4},  
        text: "Attack that decreases SP of the defender",
        isHidden: (state, attacker, defender) => state[attacker].stats.dex < 4,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'exhaust';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {
                        let ex_sp = Math.min(state[defender].sp, _.random(1, state[attacker].stats.dex));
                        state[defender].sp -= ex_sp;
                        state.chat.unshift({text: attacker + " Exhaust " + ex_sp + " sp! Damage: " + dmg});
                        return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + " Exhaust Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            return state;
        }
    },
    flip: {name: "Flip", cost: {'player.sp': 5},  
        text: "Hit with Roll!",
        isHidden: (state, attacker, defender) => state[attacker].stats.dex < 5,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {            
            state[attacker].action = 'flip';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state.chat.unshift({text: attacker + "  name"});
            return state;
        }
    },

    block: {name: "Block", cost: {'player.sp': 1},  
        text: "Stance which blocks next attack of the defender and stuns the attacker",
        isHidden: (state, attacker, defender) => state[attacker].stats.con < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'block';
            state[attacker].action_timer += getActionDelay(50, state[attacker]);
            return state;
        }},
    regen: {name: "Regen", cost: {'player.sp': 2},  
        text: "Buff that regains the attacker's HP during the round",
        isHidden: (state, attacker, defender) => state[attacker].stats.con < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'regen';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state[attacker].effects.regen++;
            return state;
        }},
    rage: {name: "Rage", cost: {'player.sp': 3},  
        text: "Buff that increases damage in exchange for hurt a little",
        isHidden: (state, attacker, defender) => state[attacker].stats.con < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state.battleground[attacker] === 0,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'rage';
            state[attacker].action_timer += getActionDelay(10, state[attacker]);
            state[attacker].hp--;
            state[attacker].effects.rage++;
            return state;
        }},
    trance: {name: "Trance", cost: {'player.sp': 4},  
        text: "Power stance that regenerate MP. Damage will turn into SP",
        isHidden: (state, attacker, defender) => state[attacker].stats.con < 4,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => {            
            state[attacker].action = 'trance';
            state[attacker].action_timer += getActionDelay(100, state[attacker]);
            state.chat.unshift({text: attacker + " in Trance"});
            return state;
        }
    },
    stun: {name: "Stun", cost: {'player.sp': 5},  
        text: "Attack which heavy stuns the defender",
        isHidden: (state, attacker, defender) => state[attacker].stats.con < 5,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, state[attacker].weapon.range),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'stunning';
            state = attack(state,
                {
                    attacker: attacker,
                    defender: defender,
                    onHit: (state, dmg) => {
                        state.chat.unshift({text: attacker + " Stun! Damage: " + dmg});
                        state[defender].action_timer += 10 * state[attacker].stats.con;
                        return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + " Stun Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state.chat.unshift({text: attacker + "  name"});
            return state;
        }
    },


    heal: {name: "Heal", cost: {'player.mp': 1},  
        text: "Light heal and cure poison",
        isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || state[attacker].hp >= state[attacker].max_hp,
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'heal';
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let hp = Math.min(state[attacker].max_hp - state[attacker].hp, _.random(state[attacker].stats.wiz, 3 + (2 * state[attacker].level * _.random(1, state[attacker].stats.wiz))));
            state[attacker].hp += hp;
            state[attacker].effects.poison = Math.max(0, state[attacker].effects.poison - hp);
            state.chat.unshift({text: attacker + "  Heal " + hp});
            return state;
        }},
    freeze: {name: "Freeze", cost: {'player.mp': 2},  
        text: "The stream of ice stuns, slightly hurts and freezes the target, slowing it down for the entire fight",
        isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'freeze';
            state[attacker].effects.fire = Math.max(0, state[attacker].effects.fire - 1);
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let atk = state[attacker].level + _.random(1, state[attacker].stats.wiz);
            let fire = hit(state, attacker, defender, atk, 'cold');
            state[defender].hp -= fire;
            state[defender].action_timer += fire * state[attacker].stats.wiz;
            state[defender].effects.freeze += state[attacker].stats.wiz;
            state.chat.unshift({text: attacker + "  Freeze " + fire});
            return state;
        }},
    sword: {name: "sword", cost: {'player.mp': 3},  
        text: "Conjure Soul Sword 5ft long that cuts the target",
        isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 5),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'sword';

            let soul_weapon = {name: "Soul Sword",    min_dmg: 1 + state[attacker].stats.wiz, max_dmg: 5 + (2 * state[attacker].stats.wiz), dmg_type: 'cutting', bonus_stat: 'wiz', stunning: 25, accuracy: 15, range: 5, speed: 50};

            let tpm_weapon = state[attacker].weapon;
            state[attacker].weapon = soul_weapon;
            state = attack(state, {
                    attacker: 'player',
                    defender: 'target',
                    onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                    onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
                });
            state[attacker].weapon = tpm_weapon;

            return state;
        }},
    iceshield: {name: "Shield", cost: {'player.mp': 4},
        text: "Clears all effects and creates an ice shield that blocks the next hit",
        isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 4,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'iceshield';
            state[attacker].action_timer += getActionDelay(40, state[attacker]);
            state[attacker].effects.firestorm = 0;
            state[attacker].effects = effects_0;
            state[attacker].effects.iceshield++;
            state.chat.unshift({text: attacker + " Cast Iceshield"});
            return state;
        }
    },
    spear: {name: "Spear", cost: {'player.mp': 5},  
        text: "Conjure Soul Spear 15ft long that pierces the target",
        isHidden: (state, attacker, defender) => state[attacker].stats.wiz < 5,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 15),
        onAction: (state, attacker, defender) => {            
            state[attacker].action = 'spear';

            let soul_weapon = {name: "Soul Spear",    min_dmg: 5 + state[attacker].stats.wiz, max_dmg: 10 + (2 * state[attacker].stats.wiz), dmg_type: 'pierce', bonus_stat: 'wiz', stunning: 40, accuracy: 10, range: 15, speed: 75};

            let tpm_weapon = state[attacker].weapon;
            state[attacker].weapon = soul_weapon;
            state = attack(state, {
                attacker: 'player',
                defender: 'target',
                onHit: (state, dmg) => {  state.chat.unshift({text: attacker + "  " + soul_weapon.name + " Hit! Damage: " + dmg}); return state; },
                onMiss: (state, chance) => { state.chat.unshift({text: attacker + "  Miss! Chance: " + chance.toFixed(0) + '%'}); return state; },
            });
            state[attacker].weapon = tpm_weapon;
            return state;
        }
    },


    blast: {name: "Blast", cost: {'player.mp': 1},  
        text: "A clot of dark energy that overtakes the target at a great distance",
        isHidden: (state, attacker, defender) => state[attacker].stats.int < 1,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 50),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'blast';
            state[attacker].action_timer += getActionDelay(25, state[attacker]);
            let atk = 1 + state[attacker].level + _.random(1, state[attacker].stats.int);
            let fire = hit(state, attacker, defender, atk, 'dark');
            state[defender].hp -= fire;
            state.chat.unshift({text: attacker + "  Blast " + fire});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 2},  
        text: "The stream of fire damages and sets the target on fire, inflicting damage on the entire fight",
        isHidden: (state, attacker, defender) => state[attacker].stats.int < 2,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer) || !isTargetInRange(state, 25),
        onAction: (state, attacker, defender) => {
            state[attacker].action = 'fire';
            state[attacker].effects.freeze = Math.max(0, state[attacker].effects.freeze - 1);
            state[attacker].action_timer += getActionDelay(30, state[attacker]);
            let atk = state[attacker].level * _.random(1, state[attacker].stats.int);
            let fire = hit(state, attacker, defender, atk, 'fire');
            state[defender].hp -= fire;
            state[defender].effects.fire++;
            state.chat.unshift({text: attacker + "  Fire " + fire});
            return state;
        }},
    blink: {name: "Blink", cost: {'player.mp': 3}, 
        text: "Instant teleportation within 25 steps in random direction is the best way to change the position in combat",
        isHidden: (state, attacker, defender) => state[attacker].stats.int < 3,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => blink(state, 25 + state[attacker].stats.int)},
    firestorm: {name: "Storm", cost: {'player.mp': 4},
        text: "Firestorm clears freeze, fright and poison effects and creates an fire shield that inflicting damage on target if they 5ft or closer",
        isHidden: (state, attacker, defender) => state[attacker].stats.int < 4,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => {            
            state[attacker].action = 'firestorm';
            state[attacker].action_timer += getActionDelay(40, state[attacker]);
            state[attacker].effects.iceshield = 0;
            state[attacker].effects.freeze = Math.max(0, state[attacker].effects.freeze - 5);
            state[attacker].effects.fright = Math.max(0, state[attacker].effects.fright - 5);
            state[attacker].effects.poison = Math.max(0, state[attacker].effects.poison - 5);
            state[attacker].effects.firestorm++;
            state.chat.unshift({text: attacker + " Rise Firestorm"});
            return state;
        }
    },
    name: {name: "Name", cost: {'player.mp': 5},  
        text: "",
        isHidden: (state, attacker, defender) => state[attacker].stats.int < 5,
        isNotAllowed: (state, attacker, defender) => (state[attacker].action_timer),
        onAction: (state, attacker, defender) => {            
            state[attacker].action = 'name';
            state.chat.unshift({text: attacker + "  name"});
            return state;
        }
    },

};