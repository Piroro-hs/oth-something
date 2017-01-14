import {join} from 'path';

import * as oth from '../../oth';

const base = join(CONFIG_PATH, 'plugins', 'node_modules');

export default function playerParser(id) {
  const {name, description} = __non_webpack_require__(join(base, id, 'package.json'));
  return {
    [name.slice(7)]: {
      description,
      interactive: false,
      testCellClickable: () => false,
      ...__non_webpack_require__(join(base, id))(oth),
    },
  };
}
