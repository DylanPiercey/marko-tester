const { render, fixtures } = require('../../../../src/index')('../component.js');

beforeEach(() => {
  window.alert = jest.fn();
});

describe('When component is rendered with data', () => {
  let component;

  beforeEach(() => {
    component = render(fixtures.index);
  });

  afterEach(() => {
    component.destroy();
  });

  it('should init legacy component', () => {
    expect(window.alert).toBeCalledWith(fixtures.index.visible);
  });

  // describe('When user clicks the button', () => {
  //   beforeEach((done) => {
  //     component.getEl('button').click();
  //     component.once('update', done);
  //   });

  //   it('should set change the state and rerender the template', () => {
  //     expect(component.state.visible).toBe(false);
  //   });
  // });
});
