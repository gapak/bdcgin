
import _ from 'lodash';


export const checkStats = (state, unit_key) => {
    let level = state[unit_key].level;

    //let hp = level * (13 + (state[unit_key].stats.con * 2));
    let hp = ((level + (state[unit_key].stats.con * 2)) * 5) + 35;
    state[unit_key].max_hp = hp;
    state[unit_key].hp = Math.min(hp, state[unit_key].max_hp);

    //let sp = level * (8 + state[unit_key].stats.str + state[unit_key].stats.dex);
    let sp = ((level + (state[unit_key].stats.str + state[unit_key].stats.dex)) * 4) + 8;
    state[unit_key].max_sp = sp;
    state[unit_key].sp = Math.min(sp, state[unit_key].max_sp);

    //let mp = level * (3 + state[unit_key].stats.wiz + state[unit_key].stats.int);
    let mp = ((level + (state[unit_key].stats.wiz + state[unit_key].stats.int)) * 2) + 4;
    state[unit_key].max_mp = mp;
    state[unit_key].mp = Math.min(mp, state[unit_key].max_mp);

    return state;
};

export const getAttackChance = (source, target) => {
    let attack = 5 + source.weapon.accuracy + source.stats.int;
    let def = 5 + target.level + target.stats.dex;
    let ratio = (attack / def);
    //console.log(attack, def, ratio, 50 * ratio);
    return 50 * ratio;
};

export const attack = (state, params) => {
    state[params.attacker].action_timer += getActionDelay(state[params.attacker].weapon.speed, state[params.attacker]);

    if (state.target.action === 'roll') {
        state.chat.unshift({text: params.defender + " Roll against attack"});
        return state;
    }
    if (state.target.action === 'block') {
        state.chat.unshift({text: params.defender + " Block against attack"});
        return state;
    }
    if (state.target.action === 'parry') {
        state = attack(state,
            {
                attacker: params.defender,
                defender: params.attacker,
                onHit: (state, dmg) => {  state.chat.unshift({text: params.defender + " Counter Hit! Damage: " + dmg}); return state; },
                onMiss: (state, chance) => { state.chat.unshift({text: params.defender + " Counter Miss! Hit chance: " + chance.toFixed(0) + '%'}); return state; },
            });
        return state;
    }

    let chance = getAttackChance(state[params.attacker], state[params.defender]);
    if (_.random(0, 100) < chance) {
        console.log();
        let atk = _.random(state[params.attacker].weapon.min_dmg, state[params.attacker].weapon.max_dmg) + _.random(0, state[params.attacker].stats[state[params.attacker].weapon.bonus_stat] + state[params.attacker].effects.rage);
        let def = _.random(0, state[params.defender].armor.absorption + state[params.defender].effects.buff);
        let dmg = Math.max(1, atk - def);
        state[params.defender].hp -= dmg;
        state[params.defender].action_timer += Math.max(0, state[params.attacker].weapon.stunning - (state[params.defender].armor.stability + state[params.defender].stats.con));
        state = params.onHit(state, dmg);
    }
    else {
        state = params.onMiss(state, chance);
    }
    return state;
};

export const getActionDelay = (base, unit) => {
    return Math.max(1, base + unit.armor.weight - unit.stats.dex);
};

export const getRangeBetween = (state) => {
    return state.battleground.target - state.battleground.player;
};

export const isTargetInRange = (state, range) => {
    //console.log('isTargetInRange', range, getRangeBetween(state), range >= getRangeBetween(state));
    return range >= getRangeBetween(state);
};

export const blink = (state, long) => {
    console.log('blink attempt ', long);

    let old_point = state.battleground.player;
    let new_point = null;
    let target_point = state.battleground.target;

    let min = Math.max(0, old_point - long);
    let max = Math.min(100, old_point + long);

    do {
        new_point = _.random(min, max);
        console.log('point generation attempt', new_point);
    }
    while(new_point === old_point || new_point === target_point);

    state.battleground.player = new_point;

    console.log(old_point, min, max, new_point);

    return state;
};


