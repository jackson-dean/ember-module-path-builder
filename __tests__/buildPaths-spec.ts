import {
  buildPaths,
  isTemplateModule,
  isTestSupportModule,
} from '../src/buildPaths';

test('isTemplateModule should return true for template module names', () => {
  [
    'templates/components/my-component',
    '/templates/components/my-component',
  ].forEach(moduleName => {
    expect(isTemplateModule(moduleName)).toEqual(true);
  });
});

test('isTestSupportModule should return true for test support module names', () => {
  ['test-support/my-test-helper', '/test-support/my-test-helper'].forEach(
    moduleName => {
      expect(isTestSupportModule(moduleName)).toEqual(true);
    }
  );
});

describe('buildPaths', () => {
  const testProjectRoot = '/absolute/path/to/my-ember-app';
  test('buildPaths returns the correct paths for an namespaced component template module', () => {
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-addon';
    const testModuleInput = 'templates/components/my-component';
    const testReexportModule = 'components/my-component';
    const expectedPaths = [
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testReexportModule}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testReexportModule}.js`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testReexportModule}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testReexportModule}.js`,
    ];
    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );

    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths returns the correct paths for a namespaced top level route template module', () => {
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-addon';
    const testModuleInput = 'templates/my-route-template';
    const expectedPaths = [
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.js`,
    ];
    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );

    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths returns the correct paths for an namespaced nested route template module', () => {
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-addon';
    const testModuleInput = 'templates/nested-path/my-route-template';
    const expectedPaths = [
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.js`,
    ];
    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );

    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths returns the correct paths when extra addon sources are provided', () => {
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-addon';
    const testModuleInput = 'routes/my-route';
    const testExtraAddonSources = ['engines', 'node_modules/@namespace'];
    const expectedPaths = [
      `${testProjectRoot}/lib/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/lib/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/engines/${testAddonNamespace}/addon/${testModuleInput}.js`,
      `${testProjectRoot}/engines/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/@namespace/${testAddonNamespace}/app/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/@namespace/${testAddonNamespace}/addon/${testModuleInput}.js`,
    ];
    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput,
      testExtraAddonSources
    );

    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths builds the correct js module path when the addonNamespace equals the appName', () => {
    const testModuleInput = 'routes/my-route';
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-ember-app';

    const expectedPaths = [`${testProjectRoot}/app/${testModuleInput}.js`];

    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );
    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths builds the correct component hbs module paths when the addonNamespace equals the appName', () => {
    const testModuleInput = 'templates/components/my-component';
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-ember-app';
    const testReexportModule = 'components/my-component';

    const expectedPaths = [
      `${testProjectRoot}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/app/${testReexportModule}.js`,
    ];

    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );
    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths builds the correct route hbs module paths when the addonNamespace equals the appName', () => {
    const testModuleInput = 'templates/my-route-template';
    const testAppName = 'my-ember-app';
    const testAddonNamespace = 'my-ember-app';

    const expectedPaths = [
      `${testProjectRoot}/app/${testModuleInput}.hbs`,
      `${testProjectRoot}/app/${testModuleInput}.js`,
    ];

    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );
    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });

  test('buildPaths builds the correct test module paths', () => {
    const testAppName = 'my-ember-app';
    const testModuleInput = 'test-support/my-test-helper';
    const testAddonNamespace = 'my-ember-app';

    const expectedPaths = [
      `${testProjectRoot}/lib/${testAddonNamespace}/addon-test-support/${testModuleInput}.js`,
      `${testProjectRoot}/node_modules/${testAddonNamespace}/addon-test-support/${testModuleInput}.js`,
    ];

    const actualPaths = buildPaths(
      testProjectRoot,
      testAppName,
      testAddonNamespace,
      testModuleInput
    );
    expectedPaths.forEach(expectedPath => {
      expect(actualPaths).toContain(expectedPath);
    });
  });
});
