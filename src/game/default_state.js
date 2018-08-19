

import _ from 'lodash';

import {checkUnitStats} from './game_math';
import {genUnit} from './models/unit';
import {genTarget} from './models/targets';
import {combineWeapon, weapons_bodies, weapons_quality, weapons_mods, genWeapon} from './models/weapons';
import {combineShield, shields_bodies, shields_quality, shields_mods, genShield} from './models/shields';
import {combineArmor, armors_bodies, armors_quality, armors_mods, genArmor, free_armor} from './models/armors';

export const default_state = {

    tab: 'arena',
    in_fight: false,
    wins: 0,
    looses: 0,

    chat: [],
    inventory: {armors: [free_armor], shields: [], weapons: []},
    //player.belt: ['heal', 'stamina', 'manna'],

    player: {},

    target: {},

    battleground: {player: 0, target: 100},


    game_speed: 1000,
    frame_rate: 10,
    game_speed_multiplier: 1,
    frame: 0,
    tick: 0,
    game_paused: true,
    game_end: false,
    game_end_score: 0
};



export const getDefaultState = () => {
    let state = _.cloneDeep(default_state);
    state.player = checkUnitStats(genUnit(1));
    state.player.money = 100;
    state.player.belt = ['heal', 'stamina', 'manna', 'blink', 'dart', 'web'];
    state.player.armor =     combineArmor(1, armors_bodies.novice, armors_quality[1], armors_mods.flat);

    console.log(weapons_bodies.sword, weapons_bodies);

    state.player.equipment.push(combineWeapon(1, weapons_bodies.sword, weapons_quality[1], weapons_mods.flat));
    state.player.equipment.push(combineShield(1, shields_bodies.heater, shields_quality[1], shields_mods.flat));
    state.player.equipment.push(combineWeapon(1, weapons_bodies.trident, weapons_quality[1], weapons_mods.flat));
    state.player.equipment.push(combineWeapon(1, weapons_bodies.bow, weapons_quality[1], weapons_mods.flat));
    state.player.equipment.push(combineWeapon(1, weapons_bodies.mage1, weapons_quality[1], weapons_mods.flat));

    //state.player.equipment = _.times(_.random(3, 5), () => _.random(0, 1) === 0 ? genShield(1) : genWeapon(1) );
    //state.player.left_hand = genWeapon(1);
    //state.player.right_hand = genWeapon(1);
    //state.player.weapon = genWeapon(1);
    //state.player.armor = genArmor(1);
    state.target = genTarget(1);
    return state;
};
