
import _ from 'lodash';


const weapons_bodies = {
    sword:  {name: "Sword",    min_dmg: 4, max_dmg: 6, accuracy: 5, range: 4, speed: 17},
    spear:  {name: "Spear",    min_dmg: 2, max_dmg: 3, accuracy: 6, range: 6, speed: 14},
    axe:    {name: "Axe",      min_dmg: 5, max_dmg: 11,accuracy: 2, range: 2, speed: 18},
    hammer: {name: "Hammer",   min_dmg: 6, max_dmg: 9, accuracy: 1, range: 1, speed: 16},
    bow:    {name: "Bow",      min_dmg: 1, max_dmg: 6, accuracy: 4, range: 18, speed: 20},
    cross:  {name: "Arbalest", min_dmg: 3, max_dmg: 7, accuracy: 3, range: 12, speed: 22},
};

const weapons_quality = {
    1: {name: "Old",      min_dmg: 0, max_dmg: 1, accuracy: 1, range: 0, speed: 1},
    2: {name: "Rusty",    min_dmg: 0, max_dmg: 2, accuracy: 2, range: 0, speed: 2},
    3: {name: "Standard", min_dmg: 1, max_dmg: 3, accuracy: 3, range: 0, speed: 3},
    4: {name: "Grete",    min_dmg: 1, max_dmg: 4, accuracy: 4, range: 0, speed: 4},
    5: {name: "Shiny",    min_dmg: 2, max_dmg: 5, accuracy: 5, range: 0, speed: 5},
    6: {name: "Godlike",  min_dmg: 2, max_dmg: 6, accuracy: 6, range: 0, speed: 6},
};

const weapons_mods = {
    min_dmg: {name: "Tuned",      min_dmg: 3, max_dmg: 0, accuracy: 0, range: 0, speed: 0},
    max_dmg: {name: "Sharped",    min_dmg: 0, max_dmg: 3, accuracy: 0, range: 0, speed: 0},
    all_dmg: {name: "Powerful",   min_dmg: 1, max_dmg: 2, accuracy: 0, range: 0, speed: 0},
    accuracy: {name: "Accurate",  min_dmg: 0, max_dmg: 0, accuracy: 3, range: 0, speed: 0},
    range:    {name: "Longed",    min_dmg: 0, max_dmg: 0, accuracy: 0, range: 3, speed: 0},
    speed:    {name: "Lighted",   min_dmg: 0, max_dmg: 0, accuracy: 0, range: 0, speed: -3},
    application: {name: "Handle", min_dmg: 0, max_dmg: 0, accuracy: 1, range: 1, speed: -1},
};


export const genWeapon = (level = 1) => {
    let body = _.sample(weapons_bodies);
    let q = Math.floor(Math.min(_.random(1, 6), _.random(1, Math.sqrt(level))));
    console.log('quality', q);
    let quality = weapons_quality[q];
    let mod = _.sample(weapons_mods);

    let new_weapon = {
        name: mod.name + ' ' + quality.name + ' ' + body.name,
        min_dmg: quality.min_dmg + mod.min_dmg + body.min_dmg + level,
        max_dmg: quality.max_dmg + mod.max_dmg + body.max_dmg + level,
        accuracy: quality.accuracy + mod.accuracy + body.accuracy + level,
        range: quality.range + mod.range + body.range,
        speed: quality.speed + mod.speed + body.speed,
        cost: 0
    };

    new_weapon.cost = Math.floor(Math.sqrt(((new_weapon.min_dmg + new_weapon.max_dmg) * level * (new_weapon.accuracy + new_weapon.range) * 100) / (new_weapon.speed * level)));

    return new_weapon;
};


