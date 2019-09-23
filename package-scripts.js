module.exports = {
  scripts: {
    start: 'yarn start',
    client: {
      default: 'yarn start',
      codegen: 'apollo client:codegen --target flow',
    },
    lint: {
      fix: 'sh ./script/fast-lint.sh ./src --fix',
    },
    test: {
      default: 'yarn test',
      since: {
        default: 'yarn test --changedSince ',
        lastDeploy: 'nps "test.since origin/to_production"',
      },
    },
    deploy: 'yarn run deploy',
  },
};
