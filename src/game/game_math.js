
export const checkPlayerStats = (state) => {
    let level = state.player.level;

    let hp = level * (9 + state.player.stats.str);
    state.player.hp = Math.min(hp, state.player.hp);
    state.player.max_hp = hp;

    let sp = level * (4 + state.player.stats.dex);
    state.player.sp = Math.min(sp, state.player.sp);
    state.player.max_sp = sp;

    let mp = level * (state.player.stats.int);
    state.player.mp = Math.min(mp, state.player.mp);
    state.player.max_mp = mp;

    return state;
};