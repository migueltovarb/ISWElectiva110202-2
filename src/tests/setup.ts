// src/setupTests.ts
import '@testing-library/jest-dom/vitest'; 
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

afterEach(() => {
  cleanup();



global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

});