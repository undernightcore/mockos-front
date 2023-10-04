import { IsValidVersion } from './is-valid-version.pipe';

describe('IsValidVersionPipe', () => {
  it('create an instance', () => {
    const pipe = new IsValidVersion();
    expect(pipe).toBeTruthy();
  });
});
