import React from 'react';
import Enzyme, { mount } from 'enzyme';
import App from '../src/App';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('App Test Suites', () => {
  it('should render App', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('p').text()).toBe('Hook Dev Starter');
  });
});
