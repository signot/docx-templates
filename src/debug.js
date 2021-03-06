// Cannot be covered by Flow! The purpose of this file is to isolate
// an optional dependency, only used in development (so that Flow
// doesn't throw errors when processing users' projects)
const { mainStory, addListener, chalk } = require('storyboard');
addListener(require('storyboard/lib/listeners/console').default);

module.exports = { mainStory, chalk };
