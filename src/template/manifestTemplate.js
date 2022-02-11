module.exports = manifestTemplate = {
  name: '',
  version: '',
  manifest_version: 3,
  description: '',
  action: {
    default_popup: 'popup/index.html'
  },
  permissions: [],
  content_scripts: [],
  options_ui: {
    page: 'options/index.html'
  }
}
