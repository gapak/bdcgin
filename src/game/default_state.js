

import _ from 'lodash';

import {checkUnitStats} from './game_math';
import {genUnit} from './unit';
import {genTarget} from './targets';
import {genWeapon} from './weapons';
import {genArmor} from './armors';

export const default_state = {

    tab: 'arena',
    in_fight: false,
    wins: 0,
    looses: 0,

    chat: [],
    inventory: {armors: [], weapons: []},
    belt: [],
    //belt: ['heal', 'stamina', 'manna'],

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
    state.player.weapon = genWeapon(1);
    state.player.armor = genArmor(1);
    state.target = genTarget(1);
    return state;
};
