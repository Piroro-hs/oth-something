import {remote, shell} from 'electron';
import {join} from 'path';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {ApplicationMenu, MenuItem} from 'electron-menu-react';

import {updateConfig} from '../modules/config';
import {startGame} from '../modules/game';
import {reloadPlayers} from '../modules/players';
import {B, W} from '../oth';

const Menu = ({dispatch, player, players}) =>
  <ApplicationMenu>
    <MenuItem label="Game">
      <MenuItem click={() => {dispatch(startGame());}} label="New Game" />
      <MenuItem type="separator" />
      <MenuItem label="Black">
        {Object.keys(players).map(name =>
          <MenuItem
            click={() => {dispatch(updateConfig({path: ['player', B], value: name}));}}
            type="radio"
            label={name}
            checked={name === player[B]}
            key={name}
          />,
        )}
      </MenuItem>
      <MenuItem label="White">
        {Object.keys(players).map(name =>
          <MenuItem
            click={() => {dispatch(updateConfig({path: ['player', W], value: name}));}}
            type="radio"
            label={name}
            checked={name === player[W]}
            key={name}
          />,
        )}
      </MenuItem>
      <MenuItem type="separator" />
      <MenuItem
        click={() => {shell.openItem(join(remote.app.getPath('userData'), 'oth-config'));}}
        label="Config..."
      />
      <MenuItem type="separator" />
      <MenuItem
        click={(_, win) => {win.reload();}}
        label="Reload"
        accelerator="CommandOrControl+R"
      />
      <MenuItem click={() => {dispatch(reloadPlayers());}} label="Quick Reload" />
      <MenuItem type="separator" />
      <MenuItem role="quit" />
    </MenuItem>
  </ApplicationMenu>;

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
};

const MenuContainer = connect(({config: {player}, players}) => ({player, players}))(Menu);

export default MenuContainer;
