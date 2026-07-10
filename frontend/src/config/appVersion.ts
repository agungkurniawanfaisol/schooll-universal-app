import packageJson from '../../package.json'

interface AppPackageJson {
  version: string
  versionCode?: number
  displayName?: string
  name: string
}

const pkg = packageJson as AppPackageJson

export const APP_VERSION = pkg.version
export const APP_VERSION_CODE = pkg.versionCode ?? 100
export const APP_NAME = pkg.displayName ?? pkg.name

export function formatAppVersion(): string {
  return `v${APP_VERSION} (${APP_VERSION_CODE})`
}

export function formatAppVersionShort(): string {
  return `v${APP_VERSION}`
}
