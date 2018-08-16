
import _ from 'lodash';

/***
 *
 *
 *  accuracy 5 - medium
 *
 * *
 * Damage types:
 *     crushing
 *     cutting
 *     pierce
 *
 *     poison
 *
 *     fire
 *     cold
 *     light
 *     dark
 *
 *
 *
 *
 */

export var weapons_bodies = {
    sword:  {name: "Sword",    min_dmg: 2, max_dmg: 5, dmg_type: 'cutting', bonus_stat: 'str', stunning: 20, accuracy: 5, range: 3, speed: 32},
    saber:  {name: "Saber",    min_dmg: 1, max_dmg: 6, dmg_type: 'cutting', bonus_stat: 'str', stunning: 16, accuracy: 4, range: 2, speed: 28},
    machete:{name: "Machete",  min_dmg: 1, max_dmg: 4, dmg_type: 'cutting', bonus_stat: 'str', stunning: 16, accuracy: 3, range: 1, speed: 22},

    bastard: {name:"Bastard",  min_dmg: 3, max_dmg: 6, dmg_type: 'cutting', bonus_stat: 'str', stunning: 22, accuracy: 4, range: 3, speed: 36},
    flamberg:{name:"Flamberg", min_dmg: 4, max_dmg: 8, dmg_type: 'cutting', bonus_stat: 'str', stunning: 30, accuracy: 3, range: 4, speed: 46},
    claymore:{name:"Claymore", min_dmg: 5, max_dmg: 10,dmg_type: 'cutting', bonus_stat: 'str', stunning: 42, accuracy: 3, range: 4, speed: 58},
    greatsword:{name:"Greatsword",min_dmg:6,max_dmg:12,dmg_type: 'cutting', bonus_stat: 'str', stunning: 54, accuracy: 2, range: 5, speed: 70},

    axe:    {name: "Axe",      min_dmg: 3, max_dmg: 8, dmg_type: 'cutting', bonus_stat: 'str', stunning: 20, accuracy: 4, range: 2, speed: 38},
    batleaxe:{name: "Batleaxe",min_dmg: 4, max_dmg: 10,dmg_type: 'cutting', bonus_stat: 'str', stunning: 30, accuracy: 3, range: 3, speed: 49},
    grandaxe:{name: "Grandaxe",min_dmg: 5, max_dmg: 15,dmg_type: 'cutting', bonus_stat: 'str', stunning: 40, accuracy: 2, range: 4, speed: 66},

    foil:   {name: "Foil",     min_dmg: 1, max_dmg: 3, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 2, accuracy: 8, range: 2, speed: 19},
    epee:   {name: "Epee",     min_dmg: 1, max_dmg: 4, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 4, accuracy: 7, range: 3, speed: 22},
    rapier: {name: "Rapier",   min_dmg: 2, max_dmg: 5, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 8, accuracy: 6, range: 3, speed: 27},
    estoc:  {name: "Estoc",    min_dmg: 3, max_dmg: 6, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 16, accuracy: 5, range: 3, speed: 34},

    spear:  {name: "Spear",    min_dmg: 1, max_dmg: 3, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 8,  accuracy: 6, range: 6, speed: 24},
    trident:{name: "Trident",  min_dmg: 2, max_dmg: 6, dmg_type: 'pierce', bonus_stat: 'str', stunning: 12, accuracy: 5, range: 6, speed: 33},
    halberd:{name: "Halberd",  min_dmg: 3, max_dmg: 8, dmg_type: 'cutting', bonus_stat: 'str', stunning: 24, accuracy: 4, range: 6, speed: 44},

    staff:  {name: "Staff",    min_dmg: 1, max_dmg: 4, dmg_type: 'crushing', bonus_stat: 'str', stunning: 20, accuracy: 3, range: 3, speed: 26},
    mace:   {name: "Mace",     min_dmg: 2, max_dmg: 6, dmg_type: 'crushing', bonus_stat: 'str', stunning: 30, accuracy: 2, range: 2, speed: 35},
    hammer: {name: "Hammer",   min_dmg: 4, max_dmg: 8, dmg_type: 'crushing', bonus_stat: 'str', stunning: 40, accuracy: 1, range: 2, speed: 47},
    club:   {name: "Сlub",     min_dmg: 6, max_dmg: 10,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 1, range: 3, speed: 65},
    Crasher:{name: "Crasher",  min_dmg: 8, max_dmg: 12,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 3, range: 5, speed: 78},

    sling:    {name: "Sling",  min_dmg: 1, max_dmg: 3, dmg_type: 'crushing', bonus_stat: 'dex', stunning: 16,  accuracy: 3, range: 16, speed: 35},
    bow:    {name: "Bow",      min_dmg: 1, max_dmg: 4, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 4,  accuracy: 4, range: 24, speed: 40},
    cross:  {name: "Arbalest", min_dmg: 2, max_dmg: 5, dmg_type: 'pierce', bonus_stat: 'dex', stunning: 18, accuracy: 5, range: 28, speed: 56},

    wiz1:   {name: "Wand",     min_dmg: 1, max_dmg: 3, dmg_type: 'light', bonus_stat: 'wiz', stunning: 24, accuracy: 6, range: 25, speed: 51},
    wiz2:   {name: "Rod",      min_dmg: 2, max_dmg: 4, dmg_type: 'light', bonus_stat: 'wiz', stunning: 32, accuracy: 5, range: 30, speed: 63},
    mage1:  {name: "Familiar", min_dmg: 3, max_dmg: 5, dmg_type: 'dark', bonus_stat: 'int', stunning: 2,  accuracy: 6, range: 40, speed: 63},
    mage2:  {name: "Grimoire", min_dmg: 4, max_dmg: 8, dmg_type: 'dark', bonus_stat: 'int', stunning: 12,  accuracy: 8, range: 35, speed: 73},
};

/*
_.each(weapons_bodies, (weapon, key) => {
    let speed = weapon.min_dmg * 2 + weapon.max_dmg * 2 + weapon.stunning / 2 + weapon.accuracy + weapon.range;
    //console.log(weapons_bodies[key].speed === speed, weapon.name, weapons_bodies[key].speed, speed);
} );
*/

weapons_bodies = _.sortBy(weapons_bodies, (weapon) => (weapon.min_dmg + weapon.max_dmg) / weapon.speed );

export const weapons_quality = {
    1: {name: "Old",      min_dmg: 0, max_dmg: 1, stunning: 1, accuracy: 1, range: 0, speed: 1},
    2: {name: "Rusty",    min_dmg: 0, max_dmg: 2, stunning: 1, accuracy: 2, range: 0, speed: 2},
    3: {name: "Standard", min_dmg: 1, max_dmg: 3, stunning: 1, accuracy: 3, range: 0, speed: 3},
    4: {name: "Grete",    min_dmg: 1, max_dmg: 4, stunning: 1, accuracy: 4, range: 0, speed: 4},
    5: {name: "Shiny",    min_dmg: 2, max_dmg: 5, stunning: 1, accuracy: 5, range: 0, speed: 5},
    6: {name: "Godlike",  min_dmg: 2, max_dmg: 6, stunning: 1, accuracy: 6, range: 0, speed: 6},
};

export const weapons_mods = {
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
    let body = _.cloneDeep(_.sample(weapons_bodies));
    let quality = weapons_quality[Math.floor(_.random(1, Math.sqrt(level)))];
    let mod = (level === 1) ? weapons_mods.flat : _.sample(weapons_mods);

    //console.log('Gen Weapon: ', level, body, quality, mod);

    let new_weapon = {
        name: mod.name + ' ' + quality.name + ' ' + body.name,
        min_dmg: quality.min_dmg + mod.min_dmg + body.min_dmg,// + level,
        max_dmg: quality.max_dmg + mod.max_dmg + body.max_dmg,// + level,
        bonus_stat:  body.bonus_stat,
        stunning: quality.stunning + mod.stunning + body.stunning,// + level,
        accuracy: quality.accuracy + mod.accuracy + body.accuracy,// + level,
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

    new_weapon.cost = Math.floor(Math.sqrt(((new_weapon.min_dmg + new_weapon.max_dmg) * level * (new_weapon.accuracy + new_weapon.range) * 100) / (new_weapon.speed)));

    //console.log('New Weapon: ', level, body, quality, mod, new_weapon);

    return new_weapon;
};


