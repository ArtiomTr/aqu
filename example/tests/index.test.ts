import { sum } from '../src';

describe('sum', () => {
	it('should throw an error', () => {
		expect(() => sum('as', 0)).toThrow();
	});
});
