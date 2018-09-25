const { readdirSync } = require('fs');
const {
  resolve: resolvePath, join, extname, basename,
} = require('path');
const { existsSync } = require('fs');
const stackTrace = require('stack-trace');
const clone = require('just-clone');
const markoModulesMockingMap = require('../marko-modules-mocking-map');

delete global.WeakMap;

jest.mock('marko/env', () => ({ isDebug: true }));

Object.keys(markoModulesMockingMap)
  .forEach(moduleToMock => jest.mock(
    moduleToMock,
    () => require.requireActual(markoModulesMockingMap[moduleToMock]),
  ));

const getFullPath = (componentPath) => {
  const stack = stackTrace.get();

  stack.splice(0, 2);

  const index = stack.findIndex((trace) => {
    const filename = trace.getFileName();
    const fullPath = resolvePath(filename || '', '..', componentPath);

    return existsSync(fullPath);
  });

  return index > -1 && resolvePath(stack[index].getFileName(), '..', componentPath);
};
const render = (fullPath, withAwait) => (input) => {
  /* eslint-disable-next-line global-require, import/no-dynamic-require */
  const component = require(fullPath);
  const mount = comp => comp.appendTo(document.body).getComponent();

  /* eslint-disable-next-line global-require, import/no-unresolved */
  require('marko/components').init();

  jest.resetModules();

  return withAwait
    ? component.render(clone(input)).then(mount)
    : mount(component.renderSync(clone(input)));
};
const getFixtures = (fixturesPath => () => (fixturesPath ? readdirSync(fixturesPath) : [])
  .filter(filename => /\.js(on)?$/.test(filename))
  .reduce((fixtures, filename) => {
    const absPath = join(fixturesPath, filename);
    const extension = extname(filename);
    const testName = basename(filename).replace(extension, '');

    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    Object.assign(fixtures, { [testName]: require(absPath) || {} });

    return fixtures;
  }, {}))(getFullPath('__snapshots__'));
const runFixtures = (fixtures, fullPath, withAwait) => (fixtureName) => {
  const fixturesEntries = Object.entries(fixtures);
  const fixturesPath = getFullPath('__snapshots__');

  if (fixturesEntries.length === 0 && fixturesPath) {
    throw new Error(`No fixtures where found for component in "${fullPath}".`);
  }

  fixturesEntries
    .filter(([name]) => (!fixtureName || fixtureName === name))
    .forEach(([name, fixture]) => it(`should render component with ${name} fixture`, async () => {
      const comp = await render(fullPath, withAwait)(clone(fixture));
      expect(Array.from(document.body.childNodes)).toMatchSnapshot();
      comp.destroy();
    }));

  return {};
};
const helpers = {
  createEvent: eventName => (customEvent => (customEvent.initEvent(eventName, true, true) || customEvent))(document.createEvent('Event')),
  defer: () => (toReturn => Object.assign(toReturn, {
    promise: new Promise((resolve, reject) => Object.assign(toReturn, {
      resolve,
      reject,
    })),
  }))({}),
};
const tester = (componentPath, { withoutFixtures, withAwait } = {}) => {
  const fullPath = getFullPath(componentPath);

  if (!fullPath) {
    throw new Error(`Cannot find specified component at "${componentPath}".`);
  }

  const fixtures = getFixtures();
  const boundRunFixtures = runFixtures(fixtures, fullPath, withAwait);

  return Object.assign(helpers, {
    fixtures: Object.assign(
      withoutFixtures ? boundRunFixtures : boundRunFixtures(),
      fixtures,
    ),
    render: render(fullPath, withAwait),
  });
};

module.exports = Object.assign(tester, helpers);
