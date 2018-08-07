

export const consumables = {
    heal1: { name: 'Small Heal Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('heal1'); return state; },
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.hp = Math.min(state.player.hp + 10, state.player.max_hp);
            return state;
    }},
    heal2: { name: 'Medium Heal Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('heal2'); return state; },
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.hp = Math.min(state.player.hp + 20, state.player.max_hp);
            return state;
    }},
    heal3: { name: 'Big Heal Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('heal3'); return state; },
        consumableIf: (state) => state.player.hp < state.player.max_hp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.hp = Math.min(state.player.hp + 30, state.player.max_hp);
            return state;
    }},
    stamina1: { name: 'Small Stamina Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('stamina1'); return state; },
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.sp = Math.min(state.player.sp + 5, state.player.max_sp);
            return state;
    }},
    stamina2: { name: 'Medium Stamina Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('stamina2'); return state; },
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.sp = Math.min(state.player.sp + 10, state.player.max_sp);
            return state;
    }},
    stamina3: { name: 'Big Stamina Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('stamina3'); return state; },
        consumableIf: (state) => state.player.sp < state.player.max_sp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.sp = Math.min(state.player.sp + 15, state.player.max_sp);
            return state;
    }},
    manna1: { name: 'Small Manna Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('manna1'); return state; },
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.mp = Math.min(state.player.mp + 3, state.player.max_mp);
            return state;
    }},
    manna2: { name: 'Medium Manna Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('manna2'); return state; },
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.mp = Math.min(state.player.mp + 6, state.player.max_mp);
            return state;
    }},
    manna3: { name: 'Big Manna Bottle', cost: {money: 10},
        isDisabled: (state) => state.belt.length >= 6,
        onClick: (state) => { state.belt.push('manna3'); return state; },
        consumableIf: (state) => state.player.mp < state.player.max_mp && !state.player.action_timer,
        onConsume: (state) => {
            state.player.action_timer += 10;
            state.player.mp = Math.min(state.player.mp + 9, state.player.max_mp);
            return state;
    }},
};