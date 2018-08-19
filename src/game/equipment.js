

import _ from 'lodash';


import {zero_weapon} from './models/weapons';


export const getWeapon = (state, unit_key) => {
    let weapons = _.filter([state[unit_key].left_hand, state[unit_key].right_hand], (item) => item.type !== 'shield' && item.name !== 'Hand');

    //console.log(state[unit_key].left_hand, state[unit_key].right_hand);

    if (weapons.length === 0) return zero_weapon;
    if (weapons.length === 1) return weapons[0];

    let total_weapon = _.clone(zero_weapon);

    total_weapon.name = weapons[0].name + ' and ' + weapons[1].name;
    total_weapon.hands = 2;
    total_weapon.accuracy = Math.min(weapons[0].accuracy, weapons[1].accuracy);
    total_weapon.range = Math.min(weapons[0].range, weapons[1].range);

    console.log('getWeapon', unit_key, weapons, total_weapon);

    _.each(weapons, (weapon) => {
        _.each(['load', 'min_dmg', 'max_dmg', 'stunning', 'speed', 'cost'], (stat) => { total_weapon[stat] += weapon[stat]; });
    });

    console.log('total_weapon', unit_key, weapons, total_weapon);

    return total_weapon;
};

export const getArmor = (state, unit_key) => {
    let shields = _.filter([state[unit_key].left_hand, state[unit_key].right_hand], (item) => item.type === 'shield');

    //console.log(state[unit_key].left_hand, state[unit_key].right_hand);

    if (shields.length === 0) return state[unit_key].armor;

    let total_armor = _.clone(state[unit_key].armor);

    //console.log('getArmor', unit_key, shields, total_armor);

    _.each(shields, (shield) => {
        _.each(['load', 'delay', 'absorption', 'resistance', 'stability'], (stat) => { total_armor[stat] += shield[stat]; });
    });

    //console.log('total_armor', unit_key, shields, total_armor);

    return total_armor;
};

export const getBeltForRightHand = (state, unit_key) => {
    let fit = state[unit_key].left_hand.name === 'Hand'
                ? state[unit_key].equipment
                : _.filter(state[unit_key].equipment, (item) => item.hands === 1);
    //console.log(state, unit_key, state[unit_key].equipment);
    return _.concat([state[unit_key].right_hand], fit);
};
export const getBeltForLeftHand = (state, unit_key) => {
    //console.log(unit_key, state[unit_key]);
    let fit = state[unit_key].right_hand.name === 'Hand'
        ? state[unit_key].equipment
        : _.filter(state[unit_key].equipment, (item) => item.hands === 1);
    //console.log(unit_key, state[unit_key].equipment, state[unit_key].left_hand, _.concat([state[unit_key].left_hand], state[unit_key].equipment));
    return _.concat([state[unit_key].left_hand], fit);
};
