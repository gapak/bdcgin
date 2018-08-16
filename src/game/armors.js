
import _ from 'lodash';


export var armors_bodies = {
    novice: {name: "Protection",          weight: 7, absorption: 3, resistance: 3, stability: 3, val1: 0, val2: 0},

    robe:  {name: "Robe",                 weight: 1, absorption: 0, resistance: 4, stability: 0, val1: 0, val2: 0},
    skin:  {name: "Skin",                 weight: 2, absorption: 1, resistance: 6, stability: 0, val1: 0, val2: 0},
    jacket:  {name: "Jacket",             weight: 5, absorption: 2, resistance: 4, stability: 1, val1: 0, val2: 0},
    leather:  {name: "Leather",           weight: 7, absorption: 3, resistance: 7, stability: 1, val1: 0, val2: 0},
    chain:  {name: "Chain",               weight: 8, absorption: 6, resistance: 2, stability: 3, val1: 0, val2: 0},
    gambeson:  {name: "Gambeson",         weight: 9, absorption: 4, resistance: 3, stability: 4, val1: 0, val2: 0},
    chest:  {name: "Chest",               weight: 10, absorption: 9, resistance: 1, stability: 6, val1: 0, val2: 0},
    brigand:  {name: "Brigand",           weight: 13, absorption: 6, resistance: 4, stability: 4, val1: 0, val2: 0},
    plate:  {name: "Plate",               weight: 16, absorption: 10, resistance: 2, stability: 8, val1: 0, val2: 0},
    full_plate:  {name: "Full Plate",     weight: 22, absorption: 12, resistance: 3, stability: 9, val1: 0, val2: 0},
    turtle_plate: {name: "Turtle Plate",  weight: 30, absorption: 15, resistance: 4, stability: 10, val1: 0, val2: 0},
};

/*
_.each(armors_bodies, (armor, key) => {
    let weight = Math.round(armor.absorption * 0.2 + armor.resistance * 0.3 + armor.stability * 0.1 + Math.sqrt(armor.absorption * armor.resistance * armor.stability));
    console.log(armors_bodies[key].weight === weight, armor.name, armors_bodies[key].weight, weight);
} );

//armors_bodies = _.sortBy(armors_bodies, (armor) => (armor.absorption + armor.resistance + armor.stability) / armor.weight );
*/

export const armors_quality = {
    1: {name: "Old",      weight: 0,  absorption: 0, resistance: 0, stability: 0, val1: 0, val2: 0},
    2: {name: "Rusty",    weight: 0,  absorption: 1, resistance: 1, stability: 1, val1: 1, val2: 1},
    3: {name: "Standard", weight: -0, absorption: 2, resistance: 2, stability: 2, val1: 2, val2: 2},
    4: {name: "Grete",    weight: -0, absorption: 3, resistance: 3, stability: 3, val1: 3, val2: 3},
    5: {name: "Shiny",    weight: -1, absorption: 4, resistance: 4, stability: 4, val1: 4, val2: 4},
    6: {name: "Godlike",  weight: -1, absorption: 5, resistance: 5, stability: 5, val1: 5, val2: 5},
};

export const armors_mods = {
    flat: {name: "Typical",       weight: 0, absorption: 0, resistance: 0, stability: 0, val1: 0, val2: 0},
    weight: {name: "Light",       weight: -3, absorption: -1, resistance: -1, stability: -1, val1: 0, val2: 0},
    absorption: {name: "Soft",    weight: 1, absorption: 3, resistance: -1, stability: -1, val1: 0, val2: 0},
    resistance: {name: "Resist",  weight: 1, absorption: -1, resistance: 3, stability: -1, val1: 0, val2: 0},
    stability: {name: "Stable",   weight: 1, absorption: -1, resistance: -1, stability: 3, val1: 0, val2: 0},
    //val1:    {name: "qwe",        weight: 0, absorption: 0, resistance: 1, stability: 0, val1: 3, val2: 0},
    //val2:    {name: "asd",        weight: 0, absorption: 0, resistance: 1, stability: 0, val1: 0, val2: 3},
    fast: {name: "Fast",          weight: -4, absorption: -2, resistance: -2, stability: 0, val1: 0, val2: 0},
    forty: {name: "Forty",        weight: 4, absorption: 2, resistance: 2, stability: 0, val1: 0, val2: 0},
    deft: {name: "Deft",          weight: -2, absorption: -2, resistance: -2, stability: 2, val1: 0, val2: 0},
    laden: {name: "Laden",        weight: 2, absorption: 2, resistance: 2, stability: -2, val1: 0, val2: 0},
};


export const genArmor = (level = 1) => {
    let body = (level === 1) ? armors_bodies.novice : _.sample(armors_bodies);
    let quality = armors_quality[Math.floor(_.random(1, Math.sqrt(level)))];
    let mod = (level === 1) ? armors_mods.flat : _.sample(armors_mods);

    //console.log('Gen Armor: ', level, body, quality, mod);

    let new_armor = {
        name:
            mod.name + ' ' +
            quality.name + ' ' +
            body.name,
        weight: quality.weight + mod.weight + body.weight,// + level,
        absorption: quality.absorption + mod.absorption + body.absorption,// + level,
        resistance: quality.resistance + mod.resistance + body.resistance,// + level,
        stability: quality.stability + mod.stability + body.stability,// + level,
        val1: quality.val1 + mod.val1 + body.val1,
        val2: quality.val2 + mod.val2 + body.val2,
        level: level,
        cost: 0
    };

    _.each(new_armor, (value, key) => {
        if (new_armor[key] < 1) {
            if (key === 'weight') {
                new_armor.level -= 1 - new_armor[key];
            }
            else {
                new_armor.level += 1 - new_armor[key];
            }
            new_armor[key] = 1;
        }
    });

    new_armor.cost = Math.floor(Math.sqrt(((new_armor.weight + new_armor.val1 + new_armor.val2) * level * (new_armor.absorption + new_armor.resistance + new_armor.stability) * 100) / (new_armor.weight)));

    //console.log('New Armor: ', level, body, quality, mod, new_armor);

    return new_armor;
};


