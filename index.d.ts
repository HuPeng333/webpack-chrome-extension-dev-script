declare const SCRIPT_MODE: 'development' | 'production'

declare module 'webpack-chrome-extension-dev-script'{
  export const launchHotUpdate: () => void
}
