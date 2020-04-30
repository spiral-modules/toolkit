const core = require('@spiral-toolkit/core').default;

require('./template');
require('./form/input');
require('./action/action');
require('./ui/localdate/LocalDate');
require('./form/pattern/PatternInput');

// require('@spiral-toolkit/autocomplete');
require('@spiral-toolkit/locker');
require('@spiral-toolkit/form');
require('@spiral-toolkit/datagrid');


module.exports = core;
