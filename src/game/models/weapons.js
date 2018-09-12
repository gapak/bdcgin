
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
    knife:  {name: "Knife",    type: 'weapon', hands: 1, load: 2, min_dmg: 1, max_dmg: 3, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 6, accuracy: 3, range: 1, speed: 17},
    machete:{name: "Machete",  type: 'weapon', hands: 1, load: 4, min_dmg: 1, max_dmg: 4, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 16, accuracy: 3, range: 1, speed: 20},
    saber:  {name: "Saber",    type: 'weapon', hands: 1, load: 5, min_dmg: 2, max_dmg: 6, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 14, accuracy: 4, range: 2, speed: 32},
    sword:  {name: "Sword",    type: 'weapon', hands: 1, load: 6, min_dmg: 3, max_dmg: 6, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 20, accuracy: 5, range: 3, speed: 42},

    bastard: {name:"Bastard",  type: 'weapon', hands: 1, load: 7, min_dmg: 3, max_dmg: 8, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 22, accuracy: 4, range: 5, speed: 49},
    flamberg:{name:"Flamberg", type: 'weapon', hands: 2, load: 9, min_dmg: 4, max_dmg: 9, dmg_type: 'cutting',  bonus_stat: 'str', stunning: 30, accuracy: 3, range: 6, speed: 54},
    claymore:{name:"Claymore", type: 'weapon', hands: 2, load: 11, min_dmg: 5, max_dmg: 10,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 42, accuracy: 3, range: 6, speed: 63},
    greatsword:{name:"Greatsword",type: 'weapon', hands: 2, load: 15, min_dmg:6,max_dmg:12,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 54, accuracy: 2, range: 7, speed: 71},

    axe:    {name: "Axe",      type: 'weapon', hands: 1, load: 7, min_dmg: 3, max_dmg: 8, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 20, accuracy: 4, range: 2, speed: 42},
    batleaxe:{name: "Batleaxe",type: 'weapon', hands: 2, load: 10, min_dmg: 4, max_dmg: 10,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 30, accuracy: 3, range: 4, speed: 51},
    grandaxe:{name: "Grandaxe",type: 'weapon', hands: 2, load: 14, min_dmg: 5, max_dmg: 15,dmg_type: 'cutting',  bonus_stat: 'str', stunning: 40, accuracy: 2, range: 7, speed: 69},

    foil:   {name: "Foil",     type: 'weapon', hands: 1, load: 2, min_dmg: 1, max_dmg: 3, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 2, accuracy: 8, range: 2, speed: 17},
    epee:   {name: "Epee",     type: 'weapon', hands: 1, load: 2, min_dmg: 1, max_dmg: 4, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 4, accuracy: 7, range: 4, speed: 23},
    rapier: {name: "Rapier",   type: 'weapon', hands: 1, load: 4, min_dmg: 2, max_dmg: 5, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 8, accuracy: 6, range: 4, speed: 32},
    estoc:  {name: "Estoc",    type: 'weapon', hands: 2, load: 5, min_dmg: 3, max_dmg: 6, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 16, accuracy: 5, range: 5, speed: 42},

    spear:  {name: "Spear",    type: 'weapon', hands: 2, load: 3, min_dmg: 1, max_dmg: 3, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 8,  accuracy: 6, range: 9, speed: 27},
    trident:{name: "Trident",  type: 'weapon', hands: 2, load: 5, min_dmg: 2, max_dmg: 6, dmg_type: 'pierce',    bonus_stat: 'str', stunning: 12, accuracy: 5, range: 9, speed: 39},
    halberd:{name: "Halberd",  type: 'weapon', hands: 2, load: 7, min_dmg: 3, max_dmg: 8, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 24, accuracy: 4, range: 9, speed: 53},

    whip:   {name: "Whip",     type: 'weapon', hands: 1, load: 4, min_dmg: 1, max_dmg: 2, dmg_type: 'cutting',   bonus_stat: 'str', stunning: 16, accuracy: 3, range: 10, speed: 30},
    chain:  {name: "Chain",    type: 'weapon', hands: 1, load: 7, min_dmg: 3, max_dmg: 4, dmg_type: 'crushing', bonus_stat: 'str', stunning: 24, accuracy: 2, range: 8, speed: 42},
    flail:  {name: "Flail",    type: 'weapon', hands: 2, load: 10, min_dmg: 4, max_dmg: 6, dmg_type: 'crushing', bonus_stat: 'str', stunning: 32, accuracy: 1, range: 5, speed: 41},

    staff:  {name: "Staff",    type: 'weapon', hands: 2, load: 4, min_dmg: 1, max_dmg: 4, dmg_type: 'crushing',  bonus_stat: 'str', stunning: 20, accuracy: 3, range: 3, speed: 24},
    mace:   {name: "Mace",     type: 'weapon', hands: 1, load: 7, min_dmg: 2, max_dmg: 6, dmg_type: 'crushing', bonus_stat: 'str', stunning: 30, accuracy: 2, range: 2, speed: 34},
    hammer: {name: "Hammer",   type: 'weapon', hands: 1, load: 11, min_dmg: 4, max_dmg: 8, dmg_type: 'crushing', bonus_stat: 'str', stunning: 40, accuracy: 1, range: 2, speed: 47},
    club:   {name: "Сlub",     type: 'weapon', hands: 2, load: 16, min_dmg: 6, max_dmg: 10,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 1, range: 3, speed: 55},
    crasher:{name: "Crasher",  type: 'weapon', hands: 2, load: 16, min_dmg: 8, max_dmg: 12,dmg_type: 'crushing', bonus_stat: 'str', stunning: 60, accuracy: 3, range: 5, speed: 78},

    sling:    {name: "Sling",  type: 'weapon', hands: 1, load: 4, min_dmg: 1, max_dmg: 3, dmg_type: 'crushing',  bonus_stat: 'dex', stunning: 16,  accuracy: 3, range: 16, speed: 37},
    bow:    {name: "Bow",      type: 'weapon', hands: 2, load: 4, min_dmg: 1, max_dmg: 4, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 4,  accuracy: 4, range: 24, speed: 29},
    longbow:{name: "Longbow",  type: 'weapon', hands: 2, load: 6, min_dmg: 2, max_dmg: 6, dmg_type: 'pierce',    bonus_stat: 'dex', stunning: 8,  accuracy: 5, range: 32, speed: 48},
    arbalest:{name: "Arbalest",type: 'weapon', hands: 2, load: 6, min_dmg: 2, max_dmg: 5, dmg_type: 'pierce',   bonus_stat: 'dex', stunning: 18, accuracy: 5, range: 28, speed: 57},
    crossbow:{name: "Crossbow",type: 'weapon', hands: 2, load: 11, min_dmg: 4, max_dmg: 8, dmg_type: 'pierce',   bonus_stat: 'dex', stunning: 32, accuracy: 4, range: 36, speed: 83},

    wiz1:   {name: "Wand",     type: 'weapon', hands: 1, load: 4, min_dmg: 1, max_dmg: 3, dmg_type: 'light',     bonus_stat: 'wiz', stunning: 24, accuracy: 7, range: 25, speed: 60},
    wiz2:   {name: "Rod",      type: 'weapon', hands: 2, load: 7, min_dmg: 2, max_dmg: 4, dmg_type: 'light',    bonus_stat: 'wiz', stunning: 32, accuracy: 5, range: 30, speed: 67},
    mage1:  {name: "Orb",      type: 'weapon', hands: 1, load: 6, min_dmg: 3, max_dmg: 5, dmg_type: 'dark',      bonus_stat: 'int', stunning: 2,  accuracy: 6, range: 40, speed: 43},
    mage2:  {name: "Grimoire", type: 'weapon', hands: 2, load: 7, min_dmg: 4, max_dmg: 8, dmg_type: 'dark',     bonus_stat: 'int', stunning: 12,  accuracy: 8, range: 35, speed: 76},
};
  /*
_.each(weapons_bodies, (weapon, key) => {
    let load = Math.round((((weapon.min_dmg * 5) + (weapon.max_dmg * 3) + (weapon.stunning)) / (5 + weapon.accuracy)) + Math.sqrt(weapon.range));
    let speed = Math.round((weapon.min_dmg * 2 * (1 + 0.1 * weapon.accuracy)) + (weapon.max_dmg * (1 + 0.1 * weapon.accuracy)) + (weapon.stunning / 2 * (1 + 0.1 * weapon.accuracy)) + weapon.range);
    console.log(weapons_bodies[key].speed === speed, weapon.name, 'speed', weapons_bodies[key].speed, speed);
    console.log(weapons_bodies[key].load === load, weapon.name, 'load', weapons_bodies[key].load, load);
} );
  */

/*
_.each(weapons_bodies, (weapon, key) => {
    let acc_factor = (1 + 0.1 * weapon.accuracy);

    let load = Math.round(((weapon.min_dmg * 10 + weapon.max_dmg * 5 + weapon.stunning + weapon.range) / acc_factor) / 10);
    console.log(weapons_bodies[key].load === load, weapon.name, 'load', weapons_bodies[key].load, load);

    let speed =
        Math.round((
            Math.sqrt(weapon.min_dmg * 10 * weapon.max_dmg * 5)
            + Math.sqrt(weapon.range)
            + Math.sqrt(weapon.stunning)
            + Math.sqrt(weapon.stunning * weapon.range)
                * acc_factor)
            - (weapon.load * (weapon.hands === 2 ? 1.5 : 1)));
    console.log(weapons_bodies[key].speed === speed, weapon.name, 'speed', weapons_bodies[key].speed, speed);
} );
*/

// weapons_bodies = _.sortBy(weapons_bodies, (weapon) => (weapon.min_dmg + weapon.max_dmg) / weapon.speed );

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

    return combineWeapon(level, body, quality, mod);
};

export const combineWeapon = (level, body, quality, mod) => {
    //console.log('Gen Weapon: ', level, body, quality, mod);
    let new_weapon = {
        name: _.trim(mod.name + ' ' + quality.name + ' ' + body.name),
        unsold: body.unsold ? body.unsold : false,
        mod_name: mod.name,
        quality_name: quality.name,
        body_name: body.name,
        type: body.type,
        hands: body.hands,
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

    /*
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
    */

    new_weapon.cost = Math.floor(Math.sqrt(((new_weapon.min_dmg + new_weapon.max_dmg) * level * (new_weapon.accuracy + new_weapon.range) * 100) / (1 + new_weapon.load)));

    //console.log('New Weapon: ', level, body, quality, mod, new_weapon);

    return new_weapon;
};

export const free_hand = combineWeapon(0,
    {name: "Fist", unsold: true, type: 'weapon', hands: 1, load: 0, min_dmg: 1, max_dmg: 2, dmg_type: 'crushing',   bonus_stat: 'str', stunning: 16, accuracy: 5, range: 1, speed: 20},
    {name: "",       load: 0, min_dmg: 0, max_dmg: 0, stunning: 0, accuracy: 0, range: 0, speed: 0},
    {name: "",       load: 0, min_dmg: 0, max_dmg: 0, stunning: 0, accuracy: 0, range: 0, speed: 0},
);

export const zero_weapon = combineWeapon(0,
    {name: "", unsold: true, type: 'weapon', hands: 1, load: 0, min_dmg: 0, max_dmg: 0, dmg_type: 'crushing',   bonus_stat: 'str', stunning: 0, accuracy: 0, range: 0, speed: 0},
    {name: "",       load: 0, min_dmg: 0, max_dmg: 0, stunning: 0, accuracy: 0, range: 0, speed: 0},
    {name: "",       load: 0, min_dmg: 0, max_dmg: 0, stunning: 0, accuracy: 0, range: 0, speed: 0},
);
