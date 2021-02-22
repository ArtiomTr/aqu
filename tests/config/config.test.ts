import { loadAndResolveAquConfig } from '../../src/config/loadAndResolveAquConfig';
import { DEFAULT_OPTIONS } from '../../src/constants';

const singleConfig = [
  {
    ...DEFAULT_OPTIONS,
    input: 'hello',
    name: 'aqu',
  },
];

const multipleConfig = [
  {
    ...DEFAULT_OPTIONS,
    input: 'hello',
    name: 'aqu',
  },
  {
    ...DEFAULT_OPTIONS,
    input: '2',
    name: 'aqu',
  },
];

describe('loadAndResolveAquConfig', () => {
  it('should load json config', async () => {
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.single.json'),
    ).toStrictEqual(singleConfig);
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.multiple.json'),
    ).toStrictEqual(multipleConfig);
  });
  it('should load commonjs config', async () => {
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.single.cjs'),
    ).toStrictEqual(singleConfig);
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.multiple.cjs'),
    ).toStrictEqual(multipleConfig);
  });
  it('should transpile and load es config', async () => {
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.single.mjs'),
    ).toStrictEqual(singleConfig);
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.multiple.mjs'),
    ).toStrictEqual(multipleConfig);
  });
  it('should transpile and load typescript config', async () => {
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.single.ts'),
    ).toStrictEqual(singleConfig);
    expect(
      await loadAndResolveAquConfig('./tests/config/aqu.multiple.ts'),
    ).toStrictEqual(multipleConfig);
  });
});
