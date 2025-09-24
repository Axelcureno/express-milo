// Mock placeholders module for testing
export const getPlaceholdersPath = () => '/express/placeholders.json';
export const fetchPlaceholders = () => Promise.resolve({});
export const getPlaceholder = (key) => '[' + key + ']';
export const replaceKey = (key) => '[' + key + ']';
export const replaceKeyArray = (keys) => keys.map(key => '[' + key + ']');

