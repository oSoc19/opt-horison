import React from 'react';
import Map from '../Map';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

const wrapper = shallow(<Map />);
describe('(Component) Map', () => {
	it('Should match snapshot', () => {
		expect(toJson(wrapper)).toMatchSnapshot();
	});
});

