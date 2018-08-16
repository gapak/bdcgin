

import _ from 'lodash';

import {checkUnitStats} from './game_math';


export const effects_0 = {poison: 0, regen: 0, rage: 0, fire: 0, freeze: 0, fright: 0, iceshield: 0, firestorm: 0};

export const default_unit = {
    money: 0,
    level: 1,
    expr: 0,
    bonus_points: 0,
    hp: 1,
    max_hp: 1,
    sp: 1,
    max_sp: 1,
    mp: 1,
    max_mp: 1,
    stats: {
        str: 1,
        dex: 1,
        con: 1,
        wiz: 1,
        int: 1
    },
    weapon: null,
    armor: null,
    action_timer: 0,
    action: null, // до конца action
    effects: effects_0
};


export const genUnit = () => {
    let unit = _.cloneDeep(default_unit);
    return checkUnitStats(unit);
};