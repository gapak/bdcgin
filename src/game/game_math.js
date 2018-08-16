
import _ from 'lodash';


export const checkUnitStats = (unit) => {
    let level = unit.level;

    //let hp = level * (13 + (unit.stats.con * 2));
    let hp = ((level + (unit.stats.con)) * 8) + 16;
    unit.max_hp = hp;
    unit.hp = Math.min(hp, unit.max_hp);

    //let sp = level * (8 + unit.stats.str + unit.stats.dex);
    let sp = ((level + (unit.stats.str + unit.stats.dex)) * 4) + 4;
    unit.max_sp = sp;
    unit.sp = Math.min(sp, unit.max_sp);

    //let mp = level * (3 + unit.stats.wiz + unit.stats.int);
    let mp = ((level + (unit.stats.wiz + unit.stats.int)) * 3) + 3;
    unit.max_mp = mp;
    unit.mp = Math.min(mp, unit.max_mp);

    return unit;
};

export const getAttackChance = (source, target) => {
    let attack = 10 + source.weapon.accuracy + source.stats.int;
    let def = 10 + target.stats.dex;
    let ratio = (attack / def);
    //console.log(attack, def, ratio, 50 * ratio);
    return 50 * ratio;
};


export const hit = (state, attacker, defender, dmg, dmg_type) => {

    const raw = (dmg) => {
        return dmg;
    };

    const physical = (dmg) => {
        let atk = dmg + state[attacker].effects.rage - state[attacker].effects.fright;
        let def = _.random(0, state[defender].armor.absorption);
        return Math.max(1, atk - def);
    };

    const magical = (dmg) => {
        let atk = dmg - state[attacker].effects.fright;
        let def = _.random(0, state[defender].armor.resistance + state[defender].stats.wiz);
        return Math.max(1, atk - def);
    };

    switch (dmg_type) {
        case 'crushing':
            dmg = physical(dmg);
            break;
        case 'cutting':
            dmg = physical(dmg);
            break;
        case 'pierce':
            dmg = physical(dmg);
            break;
        case 'poison':
            dmg = raw(dmg);
            break;
        case 'fire':
            dmg = magical(dmg);
            break;
        case 'cold':
            dmg = magical(dmg);
            break;
        case 'dark':
            dmg = magical(dmg);
            break;
        case 'light':
            dmg = magical(dmg);
            break;
        default:
            console.log('Unknown damage type: ' + dmg_type);
            console.log(attacker, defender, dmg, dmg_type);
    }

    return dmg;
};


export const attack = (state, params) => {
    state[params.attacker].action_timer += getActionDelay(state[params.attacker].weapon.speed, state[params.attacker]);

    if (state.target.action === 'roll' && state.target.action === 'flip') {
        state.chat.unshift({text: params.defender + " Roll against attack"});
        return state;
    }
    if (state.target.action === 'block') {
        state.chat.unshift({text: params.defender + " Block against attack"});
        state[params.defender].action_timer = 0;
        state[params.defender].action = null;
        state[params.attacker].action_timer += 20;
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
    if (state.target.effects.iceshield > 0) {
        state.chat.unshift({text: params.defender + " Block by Ice"});
        state.target.effects.iceshield--;
        return state;
    }

    let chance = getAttackChance(state[params.attacker], state[params.defender]);
    if (_.random(0, 100) < chance) {
        console.log();
        let atk = _.random(state[params.attacker].weapon.min_dmg, state[params.attacker].weapon.max_dmg) + _.random(0, state[params.attacker].stats[state[params.attacker].weapon.bonus_stat]);
        let dmg = hit(state, params.attacker, params.defender, atk, state[params.attacker].weapon.dmg_type);

        state[params.defender].hp -= dmg;

        if (state.target.action === 'trance') {
            state[params.defender].sp = Math.min(state[params.defender].max_sp, state[params.defender].sp + dmg);
        }
        state[params.defender].action_timer += Math.max(0, state[params.attacker].weapon.stunning - (_.random(0, state[params.defender].armor.stability) + state[params.defender].stats.con));
        state = params.onHit(state, dmg);
    }
    else {
        state = params.onMiss(state, chance);
    }
    return state;
};

export const getActionDelay = (base, unit) => {
    return Math.max(1, base + unit.armor.weight - unit.stats.dex + unit.effects.freeze);
};

export const getRangeBetween = (state) => {
    return state.battleground.target - state.battleground.player;
};

export const isTargetInRange = (state, range) => {
    //console.log('isTargetInRange', range, getRangeBetween(state), range >= getRangeBetween(state));
    return range >= getRangeBetween(state);
};

export const blink = (state, long) => {
    //console.log('blink attempt ', long);

    let old_point = state.battleground.player;
    let new_point = null;
    let target_point = state.battleground.target;

    let min = Math.max(0, old_point - long);
    let max = Math.min(100, old_point + long);

    do {
        new_point = _.random(min, max);
        //console.log('point generation attempt', new_point);
    }
    while(new_point === old_point || new_point === target_point);

    state.battleground.player = new_point;

    //console.log(old_point, min, max, new_point);

    return state;
};


