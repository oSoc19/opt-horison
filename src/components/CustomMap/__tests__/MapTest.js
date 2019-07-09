import React from 'react';
import Map from '../Map';
import { shallow } from 'enzyme';

const wrapper = shallow(<Map />);

describe('Map', () => {
	it('should exist', () => {
		expect(Map).toBeDefined();
	});
	it('renders without issues', () => {
		expect(wrapper.length).toBe(1);
	});
	
	// Test if child component is present
	//it('should render one ChildComponent component', () => {
	//	expect(wrapper.find(ChildComponent).length).toBe(1);
	//});
});

