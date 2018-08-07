
export const checkPlayerStats = (state) => {
    let level = state.player.level;

    let hp = level * (14 + state.player.stats.str);
    state.player.hp = Math.min(hp, state.player.hp);
    state.player.max_hp = hp;

    let sp = level * (9 + state.player.stats.dex);
    state.player.sp = Math.min(sp, state.player.sp);
    state.player.max_sp = sp;

    let mp = level * (2 + state.player.stats.int);
    state.player.mp = Math.min(mp, state.player.mp);
    state.player.max_mp = mp;

    return state;
};

export const getAttackChance = (source, target) => {
    let attack = 10 + source.weapon.accuracy + source.stats.int;
    let def = 10 + target.level + target.stats.dex;
    let ratio = (attack / def);
    console.log(attack, def, ratio, 50 * ratio);
    return 50 * ratio;
};


