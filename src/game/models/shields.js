

import _ from 'lodash';


export var shields_bodies = {
    buckler:  {name: "Buckler",      type: 'shield', hands: 1, load: 3, delay: 5, absorption: 1, resistance: 1, stability: 5, val1: 0, val2: 0},
    parma:  {name: "Parma",          type: 'shield', hands: 1, load: 5, delay: 7, absorption: 2, resistance: 1, stability: 8, val1: 0, val2: 0},
    round:  {name: "Round",          type: 'shield', hands: 1, load: 8, delay: 14, absorption: 3, resistance: 3, stability: 10, val1: 0, val2: 0},
    heater:  {name: "Heater",        type: 'shield', hands: 1, load: 10, delay: 15, absorption: 4, resistance: 2, stability: 15, val1: 0, val2: 0},
    kite:  {name: "Kite",            type: 'shield', hands: 1, load: 14, delay: 17, absorption: 6, resistance: 3, stability: 15, val1: 0, val2: 0},
    tower:  {name: "Tower",          type: 'shield', hands: 1, load: 16, delay: 20, absorption: 7, resistance: 3, stability: 18, val1: 0, val2: 0},
    helm:  {name: "Helm",            type: 'shield', hands: 1, load: 18, delay: 22, absorption: 8, resistance: 3, stability: 20, val1: 0, val2: 0},
    turtle:  {name: "Turtle Shield", type: 'shield', hands: 1, load: 24, delay: 30, absorption: 10, resistance: 4, stability: 26, val1: 0, val2: 0},
};

 /*
_.each(shields_bodies, (shield, key) => {
    let load = Math.round(Math.sqrt(((shield.absorption) + (shield.resistance) + (shield.stability))) + Math.sqrt(shield.absorption * shield.resistance * shield.stability));
    let delay = Math.round(shield.absorption * 0.1 + shield.resistance * 0.1 + shield.stability * 0.1 + Math.sqrt(shield.absorption * shield.resistance * shield.stability));

    console.log(shields_bodies[key].load === load, shield.name, 'load', shields_bodies[key].load, load);
    console.log(shields_bodies[key].delay === delay, shield.name, 'delay', shields_bodies[key].delay, delay);

    //console.log(shields_bodies[key].delay === delay, shield.name, Math.round(Math.sqrt(shield.absorption * shield.resistance * shield.stability)), delay, load);
} );

//shields_bodies = _.sortBy(shields_bodies, (shield) => (shield.absorption + shield.resistance + shield.stability) / shield.delay );
 */

/*
_.each(shields_bodies, (shield, key) => {
    let delay = Math.round((shield.absorption * 2 + shield.resistance * 3 + shield.stability) + Math.sqrt(shield.absorption * shield.resistance * shield.stability) - (shield.load * 2.5));
    console.log(shields_bodies[key].delay === delay, shield.name, 'delay', shields_bodies[key].delay, delay);
} );
*/
 
 
export const shields_quality = {
    1: {name: "Old",      load: 0, delay: 0,  absorption: 0, resistance: 0, stability: 0, val1: 0, val2: 0},
    2: {name: "Rusty",    load: 0, delay: 0,  absorption: 1, resistance: 1, stability: 1, val1: 1, val2: 1},
    3: {name: "Standard", load: 0, delay: -0, absorption: 2, resistance: 2, stability: 2, val1: 2, val2: 2},
    4: {name: "Grete",    load: 0, delay: -0, absorption: 3, resistance: 3, stability: 3, val1: 3, val2: 3},
    5: {name: "Shiny",    load: 0, delay: -1, absorption: 4, resistance: 4, stability: 4, val1: 4, val2: 4},
    6: {name: "Godlike",  load: 0, delay: -1, absorption: 5, resistance: 5, stability: 5, val1: 5, val2: 5},
};

export const shields_mods = {
    flat: {name: "Typical",       load: 0, delay: 0, absorption: 0, resistance: 0, stability: 0, val1: 0, val2: 0},
    delay: {name: "Light",       load: 0, delay: -3, absorption: -1, resistance: -1, stability: -1, val1: 0, val2: 0},
    absorption: {name: "Soft",    load: 0, delay: 1, absorption: 3, resistance: -1, stability: -1, val1: 0, val2: 0},
    resistance: {name: "Resist",  load: 0, delay: 1, absorption: -1, resistance: 3, stability: -1, val1: 0, val2: 0},
    stability: {name: "Stable",   load: 0, delay: 1, absorption: -1, resistance: -1, stability: 3, val1: 0, val2: 0},
    //val1:    {name: "qwe",        load: 0, delay: 0, absorption: 0, resistance: 1, stability: 0, val1: 3, val2: 0},
    //val2:    {name: "asd",        load: 0, delay: 0, absorption: 0, resistance: 1, stability: 0, val1: 0, val2: 3},
    fast: {name: "Fast",          load: 0, delay: -4, absorption: -2, resistance: -2, stability: 0, val1: 0, val2: 0},
    forty: {name: "Forty",        load: 0, delay: 4, absorption: 2, resistance: 2, stability: 0, val1: 0, val2: 0},
    deft: {name: "Deft",          load: 0, delay: -2, absorption: -2, resistance: -2, stability: 2, val1: 0, val2: 0},
    laden: {name: "Laden",        load: 0, delay: 2, absorption: 2, resistance: 2, stability: -2, val1: 0, val2: 0},
};


export const genShield = (level = 1) => {
    let body = _.sample(shields_bodies);
    let quality = shields_quality[Math.floor(_.random(1, Math.sqrt(level)))];
    let mod = (level === 1) ? shields_mods.flat : _.sample(shields_mods);

    return combineShield(level, body, quality, mod);
};

export const combineShield = (level, body, quality, mod) => {
    let new_shield = {
        name: _.trim(mod.name + ' ' + quality.name + ' ' + body.name),
        unsold: body.unsold ? body.unsold : false,
        mod_name: mod.name,
        quality_name: quality.name,
        body_name: body.name,
        type: body.type,
        hands: body.hands,
        load: quality.load + mod.load + body.load,
        delay: quality.delay + mod.delay + body.delay,// + level,
        absorption: quality.absorption + mod.absorption + body.absorption,// + level,
        resistance: quality.resistance + mod.resistance + body.resistance,// + level,
        stability: quality.stability + mod.stability + body.stability,// + level,
        val1: quality.val1 + mod.val1 + body.val1,
        val2: quality.val2 + mod.val2 + body.val2,
        level: level,
        cost: 0
    };

    /*
    _.each(new_shield, (value, key) => {
        if (new_shield[key] < 1) {
            if (key === 'delay') {
                new_shield.level -= 1 - new_shield[key];
            }
            else {
                new_shield.level += 1 - new_shield[key];
            }
            new_shield[key] = 1;
        }
    });
    */

    new_shield.cost = Math.floor(Math.sqrt(((new_shield.delay + new_shield.val1 + new_shield.val2) * level * (new_shield.absorption + new_shield.resistance + new_shield.stability) * 100) / (new_shield.delay)));

    //console.log('New Shield: ', level, body, quality, mod, new_shield);

    return new_shield;
};