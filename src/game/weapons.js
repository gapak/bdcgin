
import _ from 'lodash';


const weapons_bodies = {
    sword:  {name: "Sword",    min_dmg: 2, max_dmg: 5, stunning: 5, accuracy: 5, range: 3, speed: 27},
    saber:  {name: "Saber",    min_dmg: 1, max_dmg: 6, stunning: 4, accuracy: 4, range: 2, speed: 24},
    machete:{name: "Machete",  min_dmg: 1, max_dmg: 4, stunning: 4, accuracy: 3, range: 1, speed: 18},
    rapier: {name: "Rapier",   min_dmg: 1, max_dmg: 4, stunning: 3, accuracy: 6, range: 3, speed: 20},
    claymore:{name:"Claymore", min_dmg: 3, max_dmg: 6, stunning: 9, accuracy: 5, range: 4, speed: 36},
    spear:  {name: "Spear",    min_dmg: 1, max_dmg: 3, stunning: 2, accuracy: 6, range: 6, speed: 22},
    trident:{name: "Trident",  min_dmg: 2, max_dmg: 6, stunning: 3, accuracy: 5, range: 6, speed: 30},
    axe:    {name: "Axe",      min_dmg: 3, max_dmg: 7, stunning: 8, accuracy: 2, range: 2, speed: 32},
    hammer: {name: "Hammer",   min_dmg: 4, max_dmg: 6, stunning: 10, accuracy: 1, range: 1, speed: 32},
    bow:    {name: "Bow",      min_dmg: 1, max_dmg: 3, stunning: 1, accuracy: 4, range: 24, speed: 37},
    cross:  {name: "Arbalest", min_dmg: 2, max_dmg: 4, stunning: 2, accuracy: 5, range: 20, speed: 39},
};

const weapons_quality = {
    1: {name: "Old",      min_dmg: 0, max_dmg: 1, stunning: 1, accuracy: 1, range: 0, speed: 1},
    2: {name: "Rusty",    min_dmg: 0, max_dmg: 2, stunning: 1, accuracy: 2, range: 0, speed: 2},
    3: {name: "Standard", min_dmg: 1, max_dmg: 3, stunning: 1, accuracy: 3, range: 0, speed: 3},
    4: {name: "Grete",    min_dmg: 1, max_dmg: 4, stunning: 1, accuracy: 4, range: 0, speed: 4},
    5: {name: "Shiny",    min_dmg: 2, max_dmg: 5, stunning: 1, accuracy: 5, range: 0, speed: 5},
    6: {name: "Godlike",  min_dmg: 2, max_dmg: 6, stunning: 1, accuracy: 6, range: 0, speed: 6},
};

const weapons_mods = {
    flat: {name: "Typical",       min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: 0},
    min_dmg: {name: "Tuned",      min_dmg: 3, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: 0},
    max_dmg: {name: "Sharped",    min_dmg: 0, max_dmg: 3, stunning: 1, accuracy: 0, range: 0, speed: 0},
    all_dmg: {name: "Powerful",   min_dmg: 1, max_dmg: 2, stunning: 1, accuracy: 0, range: 0, speed: 0},
    accuracy: {name: "Accurate",  min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 3, range: 0, speed: 0},
    range:    {name: "Longed",    min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 3, speed: 0},
    speed:    {name: "Lighted",   min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: -3},
    application: {name: "Handle", min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 1, range: 1, speed: -1},
};


export const genWeapon = (level = 1) => {
    let body = _.sample(weapons_bodies);
    let q = Math.floor(Math.min(_.random(1, 6), _.random(1, Math.sqrt(level))));
    let quality = weapons_quality[q];
    let mod = (level === 1) ? weapons_mods.flat : _.sample(weapons_mods);

    let new_weapon = {
        name: mod.name + ' ' + quality.name + ' ' + body.name,
        min_dmg: quality.min_dmg + mod.min_dmg + body.min_dmg + level,
        max_dmg: quality.max_dmg + mod.max_dmg + body.max_dmg + level,
        stunning: quality.stunning + mod.stunning + body.stunning + level,
        accuracy: quality.accuracy + mod.accuracy + body.accuracy + level,
        range: quality.range + mod.range + body.range,
        speed: quality.speed + mod.speed + body.speed,
        level: level,
        cost: 0
    };

    _.each(new_weapon, (value, key) => {
        if (new_weapon[key] < 1) {
            if (key === 'speed') {
                new_weapon.level -= 1 - new_weapon[key];
            }
            else {
                new_weapon.level += 1 - new_weapon[key];
            }
            new_weapon[key] = 1;
        }
    });

    new_weapon.cost = Math.floor(Math.sqrt(((new_weapon.min_dmg + new_weapon.max_dmg) * level * (new_weapon.accuracy + new_weapon.range) * 100) / (new_weapon.speed * level)));

    console.log('Gen Weapon: ', level, body, quality, mod, new_weapon);

    return new_weapon;
};


