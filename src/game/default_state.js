
import _ from 'lodash';
import {genTarget} from './targets';
import {genWeapon} from './weapons';
import {genArmor} from './armors';
import {checkStats} from './game_math';

export const default_state = {


    tab: 'arena',
    in_fight: false,
    wins: 0,
    looses: 0,

    chat: [],
    inventory: [],
    belt: [],
    //belt: ['heal', 'stamina', 'manna'],

    player: {
        money: 100,
        level: 1,
        expr: 0,
        bonus_points: 5,
        hp: 100,
        max_hp: 100,
        sp: 10,
        max_sp: 10,
        mp: 10,
        max_mp: 10,
        stats: {
            str: 1,
            dex: 1,
            con: 1,
            wiz: 1,
            int: 1
        },
        weapon: genWeapon(1),
        armor: genArmor(1),
        action_timer: 0,
        action: null, // до конца action
        effects: {buff: 0, rage: 0}, // до конца боя
    },

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
    state = checkStats(state, 'player');
    state.target = genTarget(1);
    state = checkStats(state, 'target');
    return state;
};
