

import _ from 'lodash';

import {checkUnitStats} from '../game_math';

import {free_armor} from './armors';
import {free_hand} from './weapons';


export const effects_0 = {poison: 0, regen: 0, rage: 0, fire: 0, freeze: 0, fright: 0, iceshield: 0, firestorm: 0};

export const default_unit = {
    name: '',
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
    belt: [],
    equipment: [],
    right_hand: free_hand,
    left_hand: free_hand,
    //weapon: null,
    armor: free_armor,
    action_timer: 0,
    action: null, // до конца action
    effects: effects_0
};


export const genUnit = (level) => {
    let unit = _.cloneDeep(default_unit);
    unit.level = level;
    return checkUnitStats(unit);
};