
import _ from 'lodash';


export const actions = {
    move_left: {name: "Go <", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action_timer += 10;
            state.battleground.player = Math.max(0, state.battleground.player - state.player.stats.dex);
            let sp = _.random(1, state.player.stats.dex);
            state.player.sp = Math.min(state.player.max_sp, state.player.sp + sp);
            state.chat.unshift({text: "Go < " + sp});
            return state;
        }},
    move_right: {name: "Go >", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === state.battleground.target - 1,
        onClick: (state) => {
            state.player.action_timer += 10;
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + state.player.stats.dex);
            let sp = _.random(1, state.player.stats.dex);
            state.player.sp = Math.min(state.player.max_sp, state.player.sp + sp);
            state.chat.unshift({text: "Go > " + sp});
            return state;
        }},
    run_left: {name: "Run <", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player === 0,
        onClick: (state) => {
            state.player.action_timer += 20;
            state.battleground.player = Math.max(0, state.battleground.player - 9 - state.player.stats.dex);
            state.chat.unshift({text: "Run < "});
            return state;
        }},
    run_right: {name: "Run >", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.battleground.player >= state.battleground.target - 10,
        onClick: (state) => {
            state.player.action_timer += 20;
            state.battleground.player = Math.min(state.battleground.target - 1, state.battleground.player + 9 + state.player.stats.dex);
            state.chat.unshift({text: "Run > "});
            return state;
        }},
    roll: {name: "Roll", cost: {}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.player.sp >= state.player.max_sp,
        onClick: (state) => {
            state.player.action_timer += 10;
            let sp = _.random(1, state.player.stats.dex);
            state.player.sp += sp;
            state.chat.unshift({text: "Roll " + sp});
            return state;
        }},
    hit:  {name: "Hit!", cost: {'player.sp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || (state.player.weapon.range < (state.battleground.target - state.battleground.player)),
        onClick: (state) => {
            state.player.action_timer += state.player.weapon.speed;
            let dmg = _.random(state.player.weapon.min_dmg, state.player.weapon.max_dmg) + _.random(0, state.player.stats.str);
            state.target.hp -= dmg;
            state.chat.unshift({text: "Hit! " + dmg});
            return state;
        }},
    heal: {name: "Heal", cost: {'player.mp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.player.hp >= state.player.max_hp,
        onClick: (state) => {
            state.player.action_timer += 40;
            let hp = _.random(1, state.player.stats.int);
            state.player.hp += hp;
            state.chat.unshift({text: "Heal " + hp});
            return state;
        }},
    fire: {name: "Fire", cost: {'player.mp': 1}, isLocked: false,
        isDisabled: (state) => (state.player.action_timer) || state.player.hp >= state.player.max_hp,
        onClick: (state) => {
            state.player.action_timer += 40;
            let dmg = state.player.level * _.random(1, state.player.stats.str);
            state.target.hp -= dmg;
            state.chat.unshift({text: "Fire " + dmg});
            return state;
        }},

};