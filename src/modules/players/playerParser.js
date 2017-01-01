import {join} from 'path';

import {remote} from 'electron';

import * as oth from '../../oth';

const base = join(remote.app.getPath('userData'), 'oth-config', 'plugins', 'node_modules');

export default function playerParser(id) {
  const {name, description} = __non_webpack_require__(join(base, id, 'package.json')); // eslint-disable-line no-undef
  return {
    [name.slice(7)]: {
      description,
      interactive: false,
      testCellClickable: () => false,
      ...__non_webpack_require__(join(base, id))(oth), // eslint-disable-line no-undef
    },
  };
}
