
import _ from 'lodash';
import {genTarget} from './targets';
import {genWeapon} from './weapons';
import {checkPlayerStats} from './game_math';

export const default_state = {


    tab: 'arena',
    in_fight: false,

    chat: [],
    inventory: [],

    player: {
        money: 100,
        level: 1,
        expr: 0,
        bonus_points: 0,
        hp: 100,
        max_hp: 100,
        sp: 10,
        max_sp: 10,
        mp: 10,
        max_mp: 10,
        stats: {
            str: 1,
            dex: 1,
            int: 1
        },
        weapon: genWeapon(1),
        action_timer: 0
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
    wins: 0,
    game_end_score: 0
};



export const getDefaultState = () => {
    let state = _.cloneDeep(default_state);
    state = checkPlayerStats(state);
    state.target = genTarget(1);
    return state;
};
