/**
 * Check if a module is installed.
 * @param  {string}  name - Module name.
 * @return {Boolean} - True fi the module is installed, false in the other case.
 */
function isInstalled(name) {
  try {
    require.resolve(name)
    return true
  } catch (e) {
    return false
  }
}
export default isInstalled;
