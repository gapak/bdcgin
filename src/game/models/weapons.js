
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
    sword:  {name: "Sword",    load: 6, min_dmg: 2, max_dmg: 5, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 20, accuracy: 5, range: 3, speed: 32},
    saber:  {name: "Saber",    load: 6, min_dmg: 1, max_dmg: 6, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 16, accuracy: 4, range: 2, speed: 24},
    machete:{name: "Machete",  load: 5, min_dmg: 1, max_dmg: 4, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 16, accuracy: 3, range: 1, speed: 19},

    bastard: {name:"Bastard",  load: 8, min_dmg: 3, max_dmg: 6, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 22, accuracy: 4, range: 3, speed: 35},
    flamberg:{name:"Flamberg", load: 11, min_dmg: 4, max_dmg: 8, dmg_type: 'cutting',  bonus_stat: 'str', stunning: 30, accuracy: 3, range: 4, speed: 44},
    claymore:{name:"Claymore", load: 14, min_dmg: 5, max_dmg: 10,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 42, accuracy: 3, range: 4, speed: 57},
    greatsword:{name:"Greatsword",load: 19, min_dmg:6,max_dmg:12,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 54, accuracy: 2, range: 5, speed: 66},

    axe:    {name: "Axe",      load: 8, min_dmg: 3, max_dmg: 8, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 20, accuracy: 4, range: 2, speed: 36},
    batleaxe:{name: "Batleaxe",load: 12, min_dmg: 4, max_dmg: 10,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 30, accuracy: 3, range: 3, speed: 46},
    grandaxe:{name: "Grandaxe",load: 18, min_dmg: 5, max_dmg: 15,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 40, accuracy: 2, range: 4, speed: 58},

    foil:   {name: "Foil",     load: 3, min_dmg: 1, max_dmg: 3, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 2, accuracy: 8, range: 2, speed: 13},
    epee:   {name: "Epee",     load: 3, min_dmg: 1, max_dmg: 4, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 4, accuracy: 7, range: 3, speed: 17},
    rapier: {name: "Rapier",   load: 5, min_dmg: 2, max_dmg: 5, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 8, accuracy: 6, range: 3, speed: 24},
    estoc:  {name: "Estoc",    load: 7, min_dmg: 3, max_dmg: 6, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 16, accuracy: 5, range: 3, speed: 33},

    spear:  {name: "Spear",    load: 4, min_dmg: 1, max_dmg: 3, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 8,  accuracy: 6, range: 6, speed: 20},
    trident:{name: "Trident",  load: 6, min_dmg: 2, max_dmg: 6, dmg_type: 'pierce',    bonus_stat: 'str', stunning: 12, accuracy: 5, range: 6, speed: 30},
    halberd:{name: "Halberd",  load: 9, min_dmg: 3, max_dmg: 8, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 24, accuracy: 4, range: 6, speed: 42},

    whip:   {name: "Whip",     load: 7, min_dmg: 1, max_dmg: 2, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 16, accuracy: 3, range: 10, speed: 26},
    chain:  {name: "Chain",    load: 10, min_dmg: 3, max_dmg: 4, dmg_type: 'crushing', bonus_stat: 'str', stunning: 24, accuracy: 2, range: 8, speed: 34},

    staff:  {name: "Staff",    load: 6, min_dmg: 1, max_dmg: 4, dmg_type: 'crushing',  bonus_stat: 'str', stunning: 20, accuracy: 3, range: 3, speed: 24},
    mace:   {name: "Mace",     load: 10, min_dmg: 2, max_dmg: 6, dmg_type: 'crushing', bonus_stat: 'str', stunning: 30, accuracy: 2, range: 2, speed: 32},
    hammer: {name: "Hammer",   load: 15, min_dmg: 4, max_dmg: 8, dmg_type: 'crushing', bonus_stat: 'str', stunning: 40, accuracy: 1, range: 2, speed: 42},
    club:   {name: "Сlub",     load: 22, min_dmg: 6, max_dmg: 10,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 1, range: 3, speed: 60},
    crasher:{name: "Crasher",  load: 19, min_dmg: 8, max_dmg: 12,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 3, range: 5, speed: 80},

    sling:    {name: "Sling",  load: 8, min_dmg: 1, max_dmg: 3, dmg_type: 'crushing',  bonus_stat: 'dex', stunning: 16,  accuracy: 3, range: 16, speed: 33},
    bow:    {name: "Bow",      load: 7, min_dmg: 1, max_dmg: 4, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 4,  accuracy: 4, range: 24, speed: 35},
    cross:  {name: "Arbalest", load: 10, min_dmg: 2, max_dmg: 5, dmg_type: 'pierce',   bonus_stat: 'dex', stunning: 18, accuracy: 5, range: 28, speed: 55},

    wiz1:   {name: "Wand",     load: 8, min_dmg: 1, max_dmg: 3, dmg_type: 'light',     bonus_stat: 'wiz', stunning: 24, accuracy: 6, range: 25, speed: 52},
    wiz2:   {name: "Rod",      load: 11, min_dmg: 2, max_dmg: 4, dmg_type: 'light',    bonus_stat: 'wiz', stunning: 32, accuracy: 5, range: 30, speed: 66},
    mage1:  {name: "Familiar", load: 9, min_dmg: 3, max_dmg: 5, dmg_type: 'dark',      bonus_stat: 'int', stunning: 2,  accuracy: 6, range: 40, speed: 59},
    mage2:  {name: "Grimoire", load: 10, min_dmg: 4, max_dmg: 8, dmg_type: 'dark',     bonus_stat: 'int', stunning: 12,  accuracy: 8, range: 35, speed: 75},
};

  /*
_.each(weapons_bodies, (weapon, key) => {
    let load = Math.round((((weapon.min_dmg * 5) + (weapon.max_dmg * 3) + (weapon.stunning)) / (5 + weapon.accuracy)) + Math.sqrt(weapon.range));
    let speed = Math.round((weapon.min_dmg * 2 * (1 + 0.1 * weapon.accuracy)) + (weapon.max_dmg * (1 + 0.1 * weapon.accuracy)) + (weapon.stunning / 2 * (1 + 0.1 * weapon.accuracy)) + weapon.range);
    console.log(weapons_bodies[key].speed === speed, weapon.name, 'speed', weapons_bodies[key].speed, speed);
    console.log(weapons_bodies[key].load === load, weapon.name, 'load', weapons_bodies[key].load, load);
} );
  */

weapons_bodies = _.sortBy(weapons_bodies, (weapon) => (weapon.min_dmg + weapon.max_dmg) / weapon.speed );

export const weapons_quality = {
    1: {name: "Old",      load: 0, min_dmg: 0, max_dmg: 1, stunning: 1, accuracy: 1, range: 0, speed: 1},
    2: {name: "Rusty",    load: 0, min_dmg: 0, max_dmg: 2, stunning: 1, accuracy: 2, range: 0, speed: 2},
    3: {name: "Standard", load: 0, min_dmg: 1, max_dmg: 3, stunning: 1, accuracy: 3, range: 0, speed: 3},
    4: {name: "Grete",    load: 0, min_dmg: 1, max_dmg: 4, stunning: 1, accuracy: 4, range: 0, speed: 4},
    5: {name: "Shiny",    load: 0, min_dmg: 2, max_dmg: 5, stunning: 1, accuracy: 5, range: 0, speed: 5},
    6: {name: "Godlike",  load: 0, min_dmg: 2, max_dmg: 6, stunning: 1, accuracy: 6, range: 0, speed: 6},
};

export const weapons_mods = {
    flat: {name: "Typical",       load: 0, min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: 0},
    min_dmg: {name: "Tuned",      load: 0, min_dmg: 3, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: 0},
    max_dmg: {name: "Sharped",    load: 0, min_dmg: 0, max_dmg: 3, stunning: 1, accuracy: 0, range: 0, speed: 0},
    all_dmg: {name: "Powerful",   load: 0, min_dmg: 1, max_dmg: 2, stunning: 1, accuracy: 0, range: 0, speed: 0},
    accuracy: {name: "Accurate",  load: 0, min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 3, range: 0, speed: 0},
    range:    {name: "Longed",    load: 0, min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 3, speed: 0},
    speed:    {name: "Lighted",   load: 0, min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 0, range: 0, speed: -3},
    application: {name: "Handle", load: 0, min_dmg: 0, max_dmg: 0, stunning: 1, accuracy: 1, range: 1, speed: -1},
};


export const genWeapon = (level = 1) => {
    let body = _.cloneDeep(_.sample(weapons_bodies));
    let quality = weapons_quality[Math.floor(_.random(1, Math.sqrt(level)))];
    let mod = (level === 1) ? weapons_mods.flat : _.sample(weapons_mods);

    //console.log('Gen Weapon: ', level, body, quality, mod);

    let new_weapon = {
        name: mod.name + ' ' + quality.name + ' ' + body.name,
        mod_name: mod.name,
        quality_name: quality.name,
        body_name: body.name,
        load: quality.load + mod.load + body.load,
        min_dmg: quality.min_dmg + mod.min_dmg + body.min_dmg,// + level,
        max_dmg: quality.max_dmg + mod.max_dmg + body.max_dmg,// + level,
        dmg_type:  body.dmg_type,
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

    new_weapon.cost = Math.floor(Math.sqrt(((new_weapon.min_dmg + new_weapon.max_dmg) * level * (new_weapon.accuracy + new_weapon.range) * 100) / (new_weapon.load)));

    //console.log('New Weapon: ', level, body, quality, mod, new_weapon);

    return new_weapon;
};


