const { render, fixtures, createEvent } = require('marko-tester')('../index.marko', { withAwait: true });

describe('When component is rendered with data', () => {
  let component;

  beforeEach(async () => {
    component = await render(fixtures.default);
  });

  afterEach(() => {
    component.destroy();
  });

  describe('When user clicks emit button', () => {
    let clickEvent;

    beforeEach(() => {
      clickEvent = createEvent('click');

      jest.spyOn(component, 'emit');
      component.getEl('emit-button').dispatchEvent(clickEvent);
    });

    it('should emit "hello" with event and element', () => {
      expect(component.emit).toBeCalledWith('hello', clickEvent, clickEvent.target);
    });
  });
});
