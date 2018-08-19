import React, { Component } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import _ from 'lodash';

import './css/weapon_selector.css';
import './css/footer.css';
import './css/App.css';

import {game_name} from './game/app_config';
import {getDefaultState} from './game/default_state';
import {checkUnitStats, getAttackProb, getLoad, getMaxLoad} from './game/game_math';
import {actions} from './game/knowledge/actions';
import {consumables} from './game/knowledge/consumables';
import {armors_bodies} from './game/models/armors';
import {weapons_bodies} from './game/models/weapons';
import {shields_bodies} from './game/models/shields';
import {getArmor, getWeapon, getBeltForRightHand, getBeltForLeftHand} from './game/equipment';

//import {GinButton} from './core/GinButton';
import {frame} from './core/frame';
import {tick} from './core/tick';
import {isEnough, chargeCost, drawCost} from './core/bdcgin';



class App extends Component {
    constructor(props) {
        super(props);

        this.timerID = null;

        this.playGame = this.playGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);
        this.setGameSpeed = this.setGameSpeed.bind(this);
        this.tick = this.tick.bind(this);
        this.newGame = this.newGame.bind(this);

        this.state = getDefaultState();

    }


    componentDidCatch(error, info) {
        console.log('componentDidCatch', error, info);
        if (!localStorage.getItem(game_name+"_retry_flag")) { // production one-try-reloader
            localStorage.setItem(game_name+"_retry_flag", true);
            localStorage.setItem(game_name+"_app_state", null);
            window.location.reload(true);
            return true;
        }
        localStorage.setItem(game_name+"_retry_flag", false);
    }

    componentDidMount() {
        console.log('App '+game_name+' componentDidMount');
        var app_state = JSON.parse(localStorage.getItem(game_name+"_app_state"));
        this.setState(app_state ? app_state : getDefaultState());
        this.playGame();
    }

    playGame(speed_multiplier = false) {
        clearInterval(this.timerID);
        this.timerID = setInterval(
            () => this.frame(),
            Math.floor(this.state.game_speed / this.state.frame_rate / (speed_multiplier ? speed_multiplier : this.state.game_speed_multiplier))
        );
        this.setState({game_paused: false});
    }

    pauseGame() {
        clearInterval(this.timerID);
        this.setState({game_paused: true});
    }

    setGameSpeed(speed) {
        if (!this.state.game_paused) this.playGame(speed);
        this.setState({game_speed_multiplier: speed});
    }

    newGame() {
        // if (!window.confirm('Are you ready to start a new game? Your progress will be lost.')) return false;
        localStorage.setItem(game_name+"_app_state", null);
        let new_state = getDefaultState();
        this.setState(new_state);
        this.playGame(new_state.game_speed_multiplier);
    }

    frame() {
        let state = this.state;

        if (state.frame % state.frame_rate === 0) {
            state = this.tick(state);
            state.tick++;
        }

        state = frame(this.state);
        state.frame++;

        localStorage.setItem(game_name+"_app_state", JSON.stringify(state));
        this.setState(state);
        if (state.game_end) this.pauseGame();
    }

    tick(initial_state) {
        let state = tick(initial_state);
    //    localStorage.setItem(game_name+"_app_state", JSON.stringify(state));
        return state; // this.setState(state);
    }


    onClickWrapper(item) {
        //console.log(item);
        if (item.isDisabled && item.isDisabled(this.state)) {
            return false;
        }
        if (item.cost) {
            if (isEnough(this.state, item.cost)) {
                if (item.onClick) this.setState(item.onClick(chargeCost(this.state, item.cost)));
            }
            else {
                return false;
            }
        }
        else {
            if (item.onClick) this.setState(item.onClick(this.state));
        }
    }

    changeTab(tab_name) {
        this.setState({tab: tab_name});
    }


    render() {
        let state = this.state;

        //console.log(state.target);

        const GinButton = (props) => {
            let item = props.item;
            //console.log(item);
            return (item.isLocked && item.isLocked(this.state))
                ? ''
                :
                <button style={{padding: '4px 4px'}}
                    className={(item.isDisabled && item.isDisabled(this.state)) ? 'disabled' : (item.cost ? isEnough(this.state, item.cost) ? '' : 'disabled' : '')}
                    onClick={() => { this.onClickWrapper(item); }}>
                    {item.name}
                </button>
        };


        const ConsumableGinButton = (props) => <GinButton item={{
            name: props.item.name,
            isDisabled: (state) => !props.item.consumableIf(state, {attacker: 'player',  defender: 'target'}),
            onClick: (state) => { state.player.belt.splice(props.index, 1); return props.item.onConsume(state, {attacker: 'player',  defender: 'target'}); } }} />;

        const ShopGinButton = (props) => <GinButton item={{
            name: props.item.name,
            isDisabled: (state) => props.item.isDisabled(state, {attacker: 'player',  defender: 'target'}),
            onClick: (state) => props.item.onClick(state, {attacker: 'player',  defender: 'target'}) }} />;

        const ActionGinButton = (props) => <GinButton item={{
            name: props.item.name,
            cost: props.item.cost,
            isLocked: (state) => props.item.isHidden ? props.item.isHidden(state, {attacker: 'player',  defender: 'target'}) : false,
            isDisabled: (state) => props.item.isNotAllowed(state, {attacker: 'player',  defender: 'target'}),
            onClick: (state) => { return props.item.onAction(state, {attacker: 'player',  defender: 'target'}); } }} />;

        const time_panel =
            <div className="flex-element">
                <span onClick={() => {
                    if (this.state.game_paused) {
                        this.playGame();
                    } else {
                        this.pauseGame();
                    }
                }}>
                    <span className={classNames('glyphicon', (this.state.game_paused ? 'glyphicon-play' : 'glyphicon-pause'))} style={{width: 28, height: 28}}> </span>
                </span>
            <span>
                {[1, 2, 4, 8].map((speed, index) => {
                    let btn_text = {0: 'x1', 1: 'x2',  2: 'x4',  3: 'x8'}[index];
                    return <span key={index}>
                        {this.state.game_speed_multiplier === speed
                            ? <button className="" style={{width: 42, height: 28}}><u>{btn_text}</u></button>
                            : <button className="" style={{width: 42, height: 28}} onClick={() => {
                            this.setGameSpeed(speed); }}>{btn_text}
                        </button>}
                    </span>
                })}
                </span>
        </div>;

        const chat_subcomponent =
            <div className="flex-element panel">
                <div className="flex-element">
                    {_.map(state.chat, (item, key) =>
                        <div className="small" key={key}>
                            {item.text}
                        </div>
                    )}
                </div>
            </div>;


        const levelUp = (stat) => {
            return state.in_fight !== true
                ?
                <div>
                    {_.toUpper(stat)}: {state.player.stats[stat]}
                    <GinButton item={{
                        name: "+1",
                        isLocked: (state) => !state.player.bonus_points || state.player.stats[stat] >= 5,
                        onClick: (state) => {
                            state.player.stats[stat]++;
                            state.player.bonus_points--;
                            state.player = checkUnitStats(state.player);
                            return state;
                        } }} /> </div>
                : ''
        };

        const drawEquipmentLabel = (unit) => {
            let weapons = [state[unit].left_hand, state[unit].right_hand];

            if (weapons[0].name === 'Hand' && weapons[1].name === 'Hand') {
                return <div> with bare hands </div>
            }
            if (weapons[0].name === 'Hand' || weapons[1].name === 'Hand') {
                let weapon = _.filter(weapons, (item) => item.name !== 'Hand')[0];
                return <div> with {state.in_fight === true ? weapon.body_name + 'in both hand' : weapon.name} </div>
            }
            return <div>
                with {state.in_fight === true ? weapons[0].body_name : weapons[0].name} and {state.in_fight === true ? weapons[1].body_name : weapons[1].name}
            </div>
        };

        const player_subcomponent = (() => {
            let weapon = getWeapon(state, 'player');
            let armor  = getArmor(state, 'player');

            return <div className="flex-element panel filament">
                <div>Player</div>
                {drawEquipmentLabel('player')}
                <div> in {state.in_fight === true ? getArmor(state, 'player').body_name : getArmor(state, 'player').name} </div>
                <div> LVL: {state.player.level} ({state.player.expr}/{100 * state.player.level}) </div>
                {state.in_fight !== true
                    ? <div> DMG: {weapon.min_dmg} - {weapon.max_dmg + state.player.stats[weapon.bonus_stat]} dmg / [{weapon.stunning}] stun </div>
                    : <div> DMG: {weapon.min_dmg} - {weapon.max_dmg + state.player.stats[weapon.bonus_stat]} / [{weapon.stunning}] </div> }
                {state.in_fight !== true
                    ? <div> DEF: {armor.absorption} abs / {armor.resistance + state.player.stats.wiz} res / [{armor.stability + state.player.stats.con}] stab </div>
                    : <div> DEF: {armor.absorption} / {armor.resistance + state.player.stats.wiz} / [{armor.stability + state.player.stats.con}] </div> }
                <div>Load: {getLoad(state.player)} / {getMaxLoad(state.player)} kg</div>
                <div> HP: {state.player.hp}/{state.player.max_hp} </div>
                <div> SP: {state.player.sp}/{state.player.max_sp} </div>
                <div> MP: {state.player.mp}/{state.player.max_mp} </div>
                {levelUp('str')}
                {levelUp('dex')}
                {levelUp('con')}
                {levelUp('wiz')}
                {levelUp('int')}
                <div> Action: {state.player.action ? actions[state.player.action].name : ''} {state.player.action_timer} </div>
                {_.sum(_.values(state.player.effects)) > 0 ? <div>{_.map(state.player.effects, (val, key) => val > 0 ? <span key={key}>{key}: {val}</span> : '' )}</div> : ''}
            </div>
        })();

        const Hand = (weapon) =>
            <div className="flex-element panel">
                <div>{weapon.name}</div>
                <div>Damage: {weapon.min_dmg} - {weapon.max_dmg}</div>
                <div>Type: {weapon.dmg_type}</div>
                <div>Skill: {weapon.bonus_stat}</div>
                <div>Stunning: {weapon.stunning}</div>
                <div>Accuracy: {weapon.accuracy}</div>
                <div>Range: {weapon.range}</div>
                <div>Speed: {weapon.speed}</div>
                <div>Load: {weapon.load} kg</div>
                <div>Cost: {weapon.cost}</div>
            </div>;

        const hand_left_subcomponent = Hand(state.player.left_hand);
        const hand_right_subcomponent = Hand(state.player.right_hand);

        const armor_subcomponent =
            <div className="flex-element panel">
                <div>{getArmor(state, 'player').name}</div>
                <div>Absorption: {getArmor(state, 'player').absorption}</div>
                <div>Resistance: {getArmor(state, 'player').resistance}</div>
                <div>Stability: {getArmor(state, 'player').stability}</div>
                <div>Delay: {getArmor(state, 'player').delay}</div>
                <div>Load: {getArmor(state, 'player').load} kg</div>
                <div>Cost: {getArmor(state, 'player').cost}</div>
            </div>;

        const money_subcomponent =
            <div className="flex-element panel ">
                <h6>Player</h6>
                <h6>{state.player.name}</h6>
                <h6>Money: {state.player.money}</h6>
                <h6>Load: {getLoad(state.player)} / {getMaxLoad(state.player)} kg</h6>
            </div>;

        const target_subcomponent = (() => {
            let weapon = getWeapon(state, 'target');
            let armor  = getArmor(state, 'target');

            return <div className="flex-element panel filament">
                <div>{state.in_fight === true ? state.target.body_name : state.target.name}</div>
                {drawEquipmentLabel('target')}
                <div> in {state.in_fight === true ? state.target.armor.body_name : state.target.armor.name} </div>
                <div> LVL: {state.target.level} ({Math.floor((50 + (50 * state.target.level)) * state.target.level / state.player.level)} expr) </div>
                {state.in_fight !== true
                    ? <div> DMG: {weapon.min_dmg} - {weapon.max_dmg + state.target.stats[weapon.bonus_stat]} dmg / [{weapon.stunning}] stun </div>
                    : <div> DMG: {weapon.min_dmg} - {weapon.max_dmg + state.target.stats[weapon.bonus_stat]} / [{weapon.stunning}] </div> }
                {state.in_fight !== true
                    ? <div> DEF: {armor.absorption} abs / {armor.resistance + state.target.stats.wiz} res / [{armor.stability + state.target.stats.con}] stab </div>
                    : <div> DEF: {armor.absorption} / {armor.resistance + state.target.stats.wiz} / [{armor.stability + state.target.stats.con}] </div> }
                <div>Load: {getLoad(state.target)} / {getMaxLoad(state.target)} kg</div>
                <div> HP: {state.target.hp}/{state.target.max_hp} </div>
                <div> SP: {state.target.sp}/{state.target.max_sp} </div>
                <div> MP: {state.target.mp}/{state.target.max_mp} </div>
                {state.in_fight !== true ? <div> STR: {state.target.stats.str} </div> : ''}
                {state.in_fight !== true ? <div> DEX: {state.target.stats.dex} </div> : ''}
                {state.in_fight !== true ? <div> CON: {state.target.stats.con} </div> : ''}
                {state.in_fight !== true ? <div> WIZ: {state.target.stats.wiz} </div> : ''}
                {state.in_fight !== true ? <div> INT: {state.target.stats.int} </div> : ''}
                <div> Action: {state.target.action ? actions[state.target.action].name : ''} {state.target.action_timer} </div>
                {_.sum(_.values(state.target.effects)) > 0 ? <div>{_.map(state.target.effects, (val, key) => val > 0 ? <span key={key}>{key}: {val}</span> : '' )}</div> : ''}
            </div>
        })();

        const battle_ground_subcomponent =
            <div className="flex-element panel filament">
                <h6>Battle Ground</h6>
                <div className="flex-container-row">
                    <div className="flex-element"> Player: {state.battleground.player} </div>
                    <div className="flex-element"> Target: {state.battleground.target} </div>
                </div>
            </div>;

        const mowement_subcomponent =
            <div className="flex-element flex-container-row panel filament">
                <div className="flex-element"> <ActionGinButton item={actions.run_left}/> </div>
                <div className="flex-element"> <ActionGinButton item={actions.move_left}/> </div>
                <div className="flex-element"> <ActionGinButton item={actions.move_right}/> </div>
                <div className="flex-element"> <ActionGinButton item={actions.run_right}/> </div>
            </div>;

        const actions_subcomponent =
            <div className="flex-element slim">
                <div className="panel filament">
                    <div className="flex-container-row">
                        <div className="flex-element filament"> <ActionGinButton item={actions.hit}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.push}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.sprint}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.roar}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.double}/> </div>
                    </div>
                    <div className="flex-container-row">
                        <div className="flex-element filament"> <ActionGinButton item={actions.roll}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.parry}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.poison}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.exhaust}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.flip}/> </div>
                    </div>
                    <div className="flex-container-row">
                        <div className="flex-element filament"> <ActionGinButton item={actions.block}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.regen}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.rage}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.trance}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.stun}/> </div>
                    </div>
                    <div className="flex-container-row">
                        <div className="flex-element filament"> <ActionGinButton item={actions.heal}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.freeze}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.sword}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.iceshield}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.spear}/> </div>
                    </div>
                    <div className="flex-container-row">
                        <div className="flex-element filament"> <ActionGinButton item={actions.blast}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.fire}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.blink}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.firestorm}/> </div>
                        <div className="flex-element filament"> <ActionGinButton item={actions.banish}/> </div>
                    </div>
                </div>
            </div>;

        const belt_style = {
            control: (base, state) => ({
                ...base,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }),
            option: (base, state) => ({
                ...base,
                borderBottom: '1px solid white',
                color: 'white',
                backgroundColor: 'black',
            }),
            singleValue: (base, state) => ({
                ...base,
                borderBottom: '1px solid white',
                color: 'white',
                backgroundColor: 'black',
            }),
        };

        const belt_subcomponent =
            <div className="panel filament">
                <div className="flex-container-row">
                    {_.map(state.player.belt, (item, key) =>
                        <div className="flex-element panel slim" key={key}>
                            <ConsumableGinButton item={consumables[item]} index={key} />
                        </div>
                    )}
                    {state.player.belt.length < 6 && state.tab !== 'shop' && state.in_fight !== true ?
                        <GinButton item={{name: 'Buy Consumables', onClick: (state) => { state.tab = 'shop'; return state;} }}/> : ''}
                </div>

                <div className="flex-container-row">
                    <div className="flex-element">
                        Left Hand
                        <Select
                            styles={belt_style}
                            isDisabled={state.player.action_timer || state.player.right_hand.hands === 2}
                            value={{value: 0, label: state.player.left_hand.name}}
                            onChange={(selectedOption) => this.onClickWrapper({
                                onClick: (state) => {
                                    //console.log(state.player.equipment);
                                    let tmp = state.player.left_hand;
                                    let selected = getBeltForLeftHand(state, 'player')[selectedOption.value];
                                    state.player.left_hand = selected;
                                    _.pull(state.player.equipment, selected);
                                    state.player.equipment.unshift(tmp);
                                    return state; }})}
                            options={_.map(getBeltForLeftHand(state, 'player'), (weapon, id) => {
                                //console.log(weapon, id);
                                return {value: id, label: weapon.name}; } )}
                        />
                    </div>
                    <div className="flex-element">
                        Right Hand
                        <Select
                            styles={belt_style}
                            isDisabled={state.player.action_timer || state.player.left_hand.hands === 2}
                            value={{value: 0, label: state.player.right_hand.name}}
                            onChange={(selectedOption) => this.onClickWrapper({
                                onClick: (state) => {
                                    //console.log(state.player.equipment);
                                    let tmp = state.player.right_hand;
                                    let selected = getBeltForRightHand(state, 'player')[selectedOption.value];
                                    state.player.right_hand = selected;
                                    _.pull(state.player.equipment, selected);
                                    state.player.equipment.unshift(tmp);
                                    return state; }})}
                            options={_.map(getBeltForRightHand(state, 'player'), (weapon, id) => {
                                //console.log(weapon, id);
                                return {value: id, label: weapon.name}; } )}
                        />
                    </div>
                </div>
            </div>;

        const arena_subcomponent =
            <div>
                <div className="flex-container-row">
                    {player_subcomponent}
                    {state.in_fight === true ? chat_subcomponent : ''}
                    {target_subcomponent}
                </div>


                {state.in_fight !== true ? chat_subcomponent : ''}

                {belt_subcomponent}

                {state.in_fight === true ? battle_ground_subcomponent : ''}

                {state.in_fight === true ? mowement_subcomponent : ''}

                <div className="flex-container-row slim">
                    {state.in_fight === true ? actions_subcomponent :
                        <div className="flex-element">
                            <GinButton item={{name: "Start Fight!", isLocked: (state) => state.in_fight,
                                onClick: (state) => { state.in_fight = true; state.chat = []; return state; } }} />
                        </div>
                    }
                </div>
            </div>;

        const analysis_subcomponent =
            <div className="flex-element panel">
                <div>Player vs {state.target.name}:</div>
                <div>Hit:   {getAttackProb(state, {attacker: 'player',  defender: 'target'}).toFixed(2)}%</div>
                <div>Dodge: {(100 - getAttackProb(state, {attacker: 'target',  defender: 'player'})).toFixed(2)}%</div>
            </div>;



        const load_subcomponent =
                <div className="panel">
                    <h4>Load: {getLoad(state.player)} / {getMaxLoad(state.player)} kg</h4>
                </div>;

        const character_subcomponent =
            <div>
                {load_subcomponent}
                <div className="flex-container-row">
                    {hand_left_subcomponent}
                    {armor_subcomponent}
                    {hand_right_subcomponent}
                </div>
                <div className="flex-container-row">
                    {player_subcomponent}
                    <div className="flex-element flex-container-col">
                        {money_subcomponent}
                        <div className="flex-element panel">
                            <h6>Win: {state.wins} and Loose: {state.looses}</h6>
                        </div>
                        {analysis_subcomponent}
                    </div>
                </div>
            </div>;

        const inventory_subcomponent =
            <div>
                {load_subcomponent}
                <div className="flex-container-row">
                    {hand_left_subcomponent}
                    {armor_subcomponent}
                    {hand_right_subcomponent}
                </div>

                {belt_subcomponent}

                { state.player.equipment.length > 0 ?
                <div className="panel">
                    <h6>Equipment</h6>
                    <div className="flex-container-row">
                        <div className="flex-element">Name</div>
                        <div className="flex-element">Type</div>
                        <div className="flex-element">Load</div>
                        <div className="flex-element">Unequip</div>
                    </div>
                    <div className="flex-container-column">
                        {_.map(state.player.equipment, (item, key) =>
                            <div className="flex-element flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.type}</div>
                                <div className="flex-element">{item.load}</div>
                                <div className="flex-element">
                                    <GinButton item={{name: "unequip", isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => item.unsold,
                                        onClick: (state) => {
                                            if (item.type === 'weapon') { state.inventory.weapons.unshift(item); }
                                            else if (item.type === 'shield') { state.inventory.shields.unshift(item); }
                                            else { console.log('WRONG ITEM TYPE'); return false; }
                                            state.player.equipment.splice(key, 1);
                                            return state; } }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div> : ""}

                { state.inventory.weapons.length > 0 ?
                <div className="panel">
                    <h6>Weaponry</h6>
                    <div className="flex-container-row">
                        <div className="flex-element">Name</div>
                        <div className="flex-element">Damage</div>
                        <div className="flex-element">Accuracy</div>
                        <div className="flex-element">Range</div>
                        <div className="flex-element">Speed</div>
                        <div className="flex-element">Load</div>
                        <div className="flex-element">Equip</div>
                        <div className="flex-element">Sell</div>
                    </div>
                    <div className="flex-container-column">
                        {_.map(state.inventory.weapons, (item, key) =>
                            <div className="flex-element flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.min_dmg} - {item.max_dmg}</div>
                                <div className="flex-element">{item.accuracy}</div>
                                <div className="flex-element">{item.range}</div>
                                <div className="flex-element">{item.speed}</div>
                                <div className="flex-element">{item.load} kg</div>
                                <div className="flex-element">
                                    <GinButton item={{name: "equip", isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => getLoad(state.player) + item.load > getMaxLoad(state.player),
                                        onClick: (state) => {
                                            state.player.equipment.unshift(item);
                                            state.inventory.weapons.splice(key, 1);
                                            return state; } }} />
                                </div>
                                <div className="flex-element">
                                    <GinButton item={{name: "sell $"+item.cost, isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => item.unsold,
                                        onClick: (state) => {
                                            state.player.money += item.cost;
                                            state.inventory.weapons.splice(key, 1);
                                            return state; } }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div> : ""}

                { state.inventory.shields.length > 0 ?
                <div className="panel">
                    <h6>Shields</h6>
                    <div className="flex-container-row">
                        <div className="flex-element">Name</div>
                        <div className="flex-element">Absorption</div>
                        <div className="flex-element">Resistance</div>
                        <div className="flex-element">Stability</div>
                        <div className="flex-element">Delay</div>
                        <div className="flex-element">Load</div>
                        <div className="flex-element">Equip</div>
                        <div className="flex-element">Sell</div>
                    </div>
                    <div className="flex-container-column">
                        {_.map(state.inventory.shields, (item, key) =>
                            <div className="flex-element flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.absorption}</div>
                                <div className="flex-element">{item.resistance}</div>
                                <div className="flex-element">{item.stability}</div>
                                <div className="flex-element">{item.delay}</div>
                                <div className="flex-element">{item.load} kg</div>
                                <div className="flex-element">
                                    <GinButton item={{name: "equip", isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => getLoad(state.player) + item.load > getMaxLoad(state.player),
                                        onClick: (state) => {
                                            state.player.equipment.unshift(item);
                                            state.inventory.shields.splice(key, 1);
                                            return state; } }} />
                                </div>
                                <div className="flex-element">
                                    <GinButton item={{name: "sell $"+item.cost, isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => item.unsold,
                                        onClick: (state) => {
                                            state.player.money += item.cost;
                                            state.inventory.shields.splice(key, 1);
                                            return state; } }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div> : ""}

                { state.inventory.armors.length > 0 ?
                <div className="panel">
                    <h6>Armory</h6>
                    <div className="flex-container-row">
                        <div className="flex-element">Name</div>
                        <div className="flex-element">Absorption</div>
                        <div className="flex-element">Resistance</div>
                        <div className="flex-element">Stability</div>
                        <div className="flex-element">Delay</div>
                        <div className="flex-element">Load</div>
                        <div className="flex-element">Equip</div>
                        <div className="flex-element">Sell</div>
                    </div>
                    <div className="flex-container-column">
                        {_.map(state.inventory.armors, (item, key) =>
                            <div className="flex-element flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.absorption}</div>
                                <div className="flex-element">{item.resistance}</div>
                                <div className="flex-element">{item.stability}</div>
                                <div className="flex-element">{item.delay}</div>
                                <div className="flex-element">{item.load} kg</div>
                                <div className="flex-element">
                                    <GinButton item={{name: "equip", isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => getLoad(state.player) - state.player.armor.load + item.load > getMaxLoad(state.player),
                                        onClick: (state) => {
                                            state.inventory.armors[key] = state.player.armor;
                                            state.player.armor = item;
                                            //state.player.equipment.unshift(item);
                                            //state.inventory.armors.splice(key, 1);
                                            return state; } }} />
                                </div>
                                <div className="flex-element">
                                    <GinButton item={{name: "sell $"+item.cost, isLocked: (state) => state.in_fight,
                                        isDisabled: (state) => item.unsold,
                                        onClick: (state) => {
                                            state.player.money += item.cost;
                                            state.inventory.armors.splice(key, 1);
                                            return state; } }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div> : ""}
            </div>;

        const shop_subcomponent =
            <div>
                <div className="flex-container-row">
                    {money_subcomponent}
                </div>

                {belt_subcomponent}

                {state.player.belt.length >= 6 ? <div>Your belt is full</div> : ''}
                {getLoad(state.player) >= getMaxLoad(state.player) ? <div>You are fully loaded</div> : ''}

                <div className="flex-container-col panel">
                    <h6 className="slim">Shop</h6>
                    {_.map(consumables, (item, key) =>
                        <div className="flex-element flex-container-row panel slim" key={key}>
                            <div className="flex-element flex-container-col slim" key={key}>
                                <div className="flex-element">{drawCost(item.cost)}</div>
                                <div className="flex-element">{drawCost({load: item.load})} kg</div>
                            </div>
                            <div className="flex-element"><ShopGinButton item={item} key={key} /></div>
                            <div className="flex-element">{item.text}</div>
                        </div>
                    )}

                </div>
            </div>;

        const smith_subcomponent =
            <div className="flex-container-column panel">
                <h6 className="slim">Smith</h6>
                <div className="flex-element">

                </div>
            </div>;

        const options_subcomponent =
            <div className="flex-container-column panel">
                <div className="flex-element">
                    <button onClick = {this.newGame}>New game</button>
                </div>
                <div className="flex-element flex-container-column">
                    <div className="flex-element">
                        <h5>Round: {this.state.tick} Turn: {this.state.frame} </h5>
                    </div>
                    {time_panel}
                </div>
                <div>
                    <h3>Wiki</h3>
                    <div className="panel slim container">
                        From this Arena there are two ways out: victory over all or death. Improve your skills, select equipment and use consumables to defeat your opponents!
                    </div>
                    <div className="panel slim container">
                        <h4 className="slim">Stats</h4>
                        <div className="row">
                            <div className="col-xs-2">STR</div>
                            <div className="col-xs-10">Adds SP and increase maximum load</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2">DEX</div>
                            <div className="col-xs-10">Adds SP and accelerates action speed</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2">CON</div>
                            <div className="col-xs-10">Adds HP and increase stun resistance</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2">WIZ</div>
                            <div className="col-xs-10">Adds MP and increase magic resistance</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2">INT</div>
                            <div className="col-xs-10">Adds MP and increase attack accuracy</div>
                        </div>
                    </div>
                    <div className="panel slim">
                        <h4 className="slim">Weapons</h4>
                        <div className="slim flex-container-row">
                            <div className="flex-element">Name</div>
                            <div className="flex-element">Type</div>
                            <div className="flex-element">Damage</div>
                            <div className="flex-element">Stunning</div>
                            <div className="flex-element">Accur/Range</div>
                            <div className="flex-element">Speed/Load</div>
                        </div>
                        {_.map(weapons_bodies, (item, key) =>
                            <div className="slim flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.dmg_type}</div>
                                <div className="flex-element">{item.min_dmg}–{item.max_dmg} + {item.bonus_stat}</div>
                                <div className="flex-element">{item.stunning}</div>
                                <div className="flex-element">{item.accuracy} / {item.range} ft</div>
                                <div className="flex-element">{item.speed} / {item.load} kg</div>
                            </div>)
                        }
                    </div>
                    <div className="panel slim">
                        <h4 className="slim">Shields</h4>
                        <div className="slim flex-container-row">
                            <div className="flex-element">Name</div>
                            <div className="flex-element">Absorption</div>
                            <div className="flex-element">Resistance</div>
                            <div className="flex-element">Stability</div>
                            <div className="flex-element">Delay</div>
                            <div className="flex-element">Load</div>
                        </div>
                        {_.map(shields_bodies, (item, key) =>
                            <div className="slim flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.absorption}</div>
                                <div className="flex-element">{item.resistance}</div>
                                <div className="flex-element">{item.stability}</div>
                                <div className="flex-element">{item.delay}</div>
                                <div className="flex-element">{item.load} kg</div>
                            </div>)
                        }
                    </div>
                    <div className="panel slim">
                        <h4 className="slim">Armors</h4>
                        <div className="slim flex-container-row">
                            <div className="flex-element">Name</div>
                            <div className="flex-element">Absorption</div>
                            <div className="flex-element">Resistance</div>
                            <div className="flex-element">Stability</div>
                            <div className="flex-element">Delay</div>
                            <div className="flex-element">Load</div>
                        </div>
                        {_.map(armors_bodies, (item, key) =>
                            <div className="slim flex-container-row" key={key}>
                                <div className="flex-element">{item.name}</div>
                                <div className="flex-element">{item.absorption}</div>
                                <div className="flex-element">{item.resistance}</div>
                                <div className="flex-element">{item.stability}</div>
                                <div className="flex-element">{item.delay}</div>
                                <div className="flex-element">{item.load} kg</div>
                            </div>)
                        }
                    </div>
                    <div className="panel slim">
                        <h4 className="slim">Consumables</h4>
                        {_.map(consumables, (action, key) =>
                            <div className="panel filament flex-container-row" key={key}>
                                <h6 className="flex-element slim flex-container-row">
                                    <div className="flex-element">{_.values(action.cost)[0]}</div>
                                    <div className="flex-element">{action.name}</div>
                                </h6>
                                <p className="flex-element slim">{action.text}</p>
                            </div>)
                        }
                    </div>
                    <div className="panel slim">
                        <h4 className="slim">Action</h4>
                        {_.map(actions, (action, key) =>
                            <div className="panel filament flex-container-row" key={key}>
                                <h6 className="flex-element slim flex-container-row">
                                    <div className="flex-element">{_.values(action.cost)[0]}</div>
                                    <div className="flex-element">{action.name}</div>
                                </h6>
                                <p className="flex-element slim">{action.text}</p>
                            </div>)
                        }
                    </div>
                </div>
            </div>;


        return (
            <div className="App">
                <div className="filament content_container" role="main">
                    {this.state.tab === 'start' ?
                        <div>START</div>
                        : ''}

                    {this.state.tab === 'end' ?
                        <div className="col-xs-10 col">
                            <h3>Game End! Score: {this.state.game_end_score}</h3>
                            <h4><a className="btn btn-warning" onClick={this.newGame} title='Try One More Time'> New Game </a></h4>
                        </div>
                        : ''}

                    {this.state.tab === 'shop' ?
                        <div> {shop_subcomponent}</div>
                        : ''}
                    {this.state.tab === 'smith' ?
                        <div> {smith_subcomponent}</div>
                        : ''}

                    {this.state.tab === 'arena' ?
                        <div>{arena_subcomponent}</div>
                        : ''}
                    {this.state.tab === 'inventory' ?
                        <div> {inventory_subcomponent}</div>
                        : ''}
                    {this.state.tab === 'character' ?
                        <div>{character_subcomponent}</div>
                        : ''}
                    {this.state.tab === 'options' ?
                        <div> {options_subcomponent}</div>
                        : ''}

                    <div style={{width: '100%', height: '100px'}}></div>

                    {state.in_fight === true ? '' : <div className="footer row">
                        <span className="col-xs filament"><a onClick={() => { this.changeTab('arena'); }} title='Arena'>Arena</a></span>
                        <span className="col-xs filament"><a onClick={() => { this.changeTab('inventory'); }} title='Inventory'>Inventory</a></span>
                        <span className="col-xs filament"><a onClick={() => { this.changeTab('character'); }} title='Character'>Character</a></span>
                        <span className="col-xs filament"><a onClick={() => { this.changeTab('options'); }} title='Options'>Info</a></span>
                    </div>}
                </div>
            </div>
        );
    }
}

export default App;
