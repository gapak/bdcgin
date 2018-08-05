
import _ from 'lodash';

import {genWeapon} from './weapons';


const targets_bodies = {
    barbarian:  {name: "Barbarian", hp: 5, sp: 0, mp: 0, stats: {str: 1, dex: 1, int: 1}},
    ranger:     {name: "Ranger",    hp: 0, sp: 3, mp: 0, stats: {str: 1, dex: 1, int: 1}},
    mage:       {name: "Mage",      hp: 0, sp: 0, mp: 2, stats: {str: 1, dex: 1, int: 1}},
    warrior:    {name: "Warrior",   hp: 3, sp: 2, mp: 0, stats: {str: 1, dex: 1, int: 1}},
    battlemage: {name: "Warmage",hp: 3, sp: 0, mp: 1, stats: {str: 1, dex: 1, int: 1}},
    trickster:  {name: "Trickster", hp: 0, sp: 2, mp: 1, stats: {str: 1, dex: 1, int: 1}},
};

const targets_quality = {
    1: {name: "Weak",     hp: 0, sp: 0, mp: 0, stats: {str: 0, dex: 0, int: 0}},
    2: {name: "Novice",   hp: 1, sp: 1, mp: 0, stats: {str: 0, dex: 0, int: 0}},
    3: {name: "Standard", hp: 2, sp: 1, mp: 1, stats: {str: 0, dex: 0, int: 0}},
    4: {name: "Grete",    hp: 3, sp: 2, mp: 1, stats: {str: 0, dex: 0, int: 0}},
    5: {name: "Shiny",    hp: 4, sp: 2, mp: 2, stats: {str: 0, dex: 0, int: 0}},
    6: {name: "Godlike",  hp: 5, sp: 3, mp: 2, stats: {str: 0, dex: 0, int: 0}},
};

const targets_mods = {
    heavy: {name: "Heavy",         hp: 6, sp: -2, mp: -1, stats: {str: 2, dex: -1, int: -1}},
    nimble: {name: "Nimble",       hp: -3, sp: 4, mp: -1, stats: {str: -1, dex: 2, int: -1}},
    brilliant: {name: "Smart",     hp: -3, sp: -2, mp: 2, stats: {str: -1, dex: -1, int: 2}},
    athlete: {name: "Athlete",     hp: 3, sp: 2, mp: -2, stats: {str: 1, dex: 1, int: -2}},
    forceful: {name: "Force",   hp: 3, sp: -4, mp: 1, stats: {str: 1, dex: -2, int: 1}},
    sly: {name: "Sly",             hp: -6, sp: 2, mp: 1, stats: {str: -2, dex: 1, int: 1}},
    flat: {name: "Typical",              hp: 0, sp: 0, mp: 0, stats: {str: 0, dex: 0, int: 0}},
};


export const genTarget = (level = 1) => {
    let body = _.sample(targets_bodies);
    let q = Math.floor(Math.min(_.random(1, 6), _.random(1, Math.sqrt(level))));
    console.log('quality', q);
    let quality = targets_quality[q];
    let mod = level === 1 ? targets_mods.flat : _.sample(targets_mods);

    console.log(body);
    console.log(q);
    console.log(quality);
    console.log(mod);

    let target = {
        name: mod.name + ' ' + quality.name + ' ' + body.name,
        level: level,
        hp: 10,
        max_hp: 10,
        sp: 10,
        max_sp: 10,
        mp: 10,
        max_mp: 10,
        stats: {
            str: 1,
            dex: 1,
            int: 1
        },
        weapon: genWeapon(level),
        action_timer: 0
    };

    _.times(level - 1, target.stats[_.sample(_.keys(target.stats))]++);

    target.stats.str = Math.max(1, quality.stats.str + mod.stats.str + body.stats.str);
    target.stats.dex = Math.max(1, quality.stats.dex + mod.stats.dex + body.stats.dex);
    target.stats.int = Math.max(1, quality.stats.int + mod.stats.int + body.stats.int);

    let hp = level * Math.max(1, 14 + target.stats.str + quality.hp + mod.hp + body.hp);
    target.hp = hp;
    target.max_hp = hp;

    let sp = level * Math.max(1, 9 + target.stats.dex + quality.sp + mod.sp + body.sp);
    target.sp = sp;
    target.max_sp = sp;

    let mp = level * Math.max(1, 2 + target.stats.int + quality.mp + mod.mp + body.mp);
    target.mp = mp;
    target.max_mp = mp;

    return target;
};


