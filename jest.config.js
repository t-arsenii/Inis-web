module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };