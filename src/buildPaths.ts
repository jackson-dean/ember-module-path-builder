import * as path from 'path';

const TEMPLATE_MODULE_REGEX = new RegExp(`^${path.sep}?templates${path.sep}`);
const COMPONENT_TEMPLATE_MODULE_REGEX = new RegExp(
  `^${path.sep}?templates${path.sep}components${path.sep}`
);
const TEST_SUPPORT_MODULE_REGEX = new RegExp(
  `^${path.sep}?test-support${path.sep}`
);
const DEFAULT_ADDON_SOURCES = ['lib', 'node_modules'];
const DEFAULT_SUB_DIRECTORIES = ['app', 'addon', 'addon-test-support'];

export function isTemplateModule(moduleName: string): boolean {
  return TEMPLATE_MODULE_REGEX.test(moduleName);
}

export function isTestSupportModule(moduleName: string): boolean {
  return TEST_SUPPORT_MODULE_REGEX.test(moduleName);
}

export function isComponentTemplateModule(moduleName: string): boolean {
  return COMPONENT_TEMPLATE_MODULE_REGEX.test(moduleName);
}

interface IAppPathSegments {
  projectRootPath: string;
  modulePath: string;
  extension: string;
}

interface IAddonPathSegments extends IAppPathSegments {
  addonSource: string;
  addonNamespace: string;
  subdirectory: string;
}

export function addonPathBuilder({
  projectRootPath,
  addonSource,
  addonNamespace,
  subdirectory,
  modulePath,
  extension,
}: IAddonPathSegments): string {
  return path
    .join(
      projectRootPath,
      addonSource,
      addonNamespace,
      subdirectory,
      modulePath
    )
    .concat(extension);
}

export function appPathBuilder({
  projectRootPath,
  modulePath,
  extension,
}: IAppPathSegments): string {
  return path.join(projectRootPath, 'app', modulePath).concat(extension);
}

export function buildPaths(
  projectRootPath: string,
  appName: string,
  addonNamespace: string,
  baseModulePath: string,
  extraAddonSources: string[] = []
): string[] {
  const addonSources = DEFAULT_ADDON_SOURCES.concat(extraAddonSources);
  const addonSubdirectories = isTestSupportModule(baseModulePath)
    ? DEFAULT_SUB_DIRECTORIES.slice(2)
    : DEFAULT_SUB_DIRECTORIES.slice(0, 2);

  let result: string[] = [];

  if (isTestSupportModule(baseModulePath)) {
    addonSources.forEach(addonSource => {
      addonSubdirectories.forEach(subdirectory => {
        result = result.concat([
          addonPathBuilder({
            addonNamespace,
            addonSource,
            extension: '.js',
            modulePath: baseModulePath,
            projectRootPath,
            subdirectory,
          }),
        ]);
      });
    });
  } else if (isTemplateModule(baseModulePath)) {
    const reexportPath = isComponentTemplateModule(baseModulePath)
      ? baseModulePath.replace(TEMPLATE_MODULE_REGEX, '')
      : baseModulePath;
    if (addonNamespace === appName) {
      result = [
        appPathBuilder({
          extension: '.hbs',
          modulePath: baseModulePath,
          projectRootPath,
        }),
        appPathBuilder({
          extension: '.js',
          modulePath: reexportPath,
          projectRootPath,
        }),
      ];
    } else {
      addonSources.forEach(addonSource => {
        addonSubdirectories.forEach(subdirectory => {
          result = result.concat([
            addonPathBuilder({
              addonNamespace,
              addonSource,
              extension: '.hbs',
              modulePath: baseModulePath,
              projectRootPath,
              subdirectory,
            }),
            addonPathBuilder({
              addonNamespace,
              addonSource,
              extension: '.js',
              modulePath: reexportPath,
              projectRootPath,
              subdirectory,
            }),
          ]);
        });
      });
    }
  } else {
    if (addonNamespace === appName) {
      result = [
        appPathBuilder({
          extension: '.js',
          modulePath: baseModulePath,
          projectRootPath,
        }),
      ];
    } else {
      addonSources.forEach(addonSource => {
        addonSubdirectories.forEach(subdirectory => {
          result = result.concat([
            addonPathBuilder({
              addonNamespace,
              addonSource,
              extension: '.js',
              modulePath: baseModulePath,
              projectRootPath,
              subdirectory,
            }),
          ]);
        });
      });
    }
  }

  return result;
}
