// Mock utils module for testing
export const getConfig = () => ({
  locale: { ietf: 'en-US', region: 'US' },
  contentRoot: '/express',
  codeRoot: '/express/code',
  locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } },
});

export const createTag = (tag, attrs) => {
  const element = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
};

export const replaceKey = (key) => `[${key}]`;

export const getMetadata = (key) => {
  if (key === 'test-metadata') return 'test-value';
  return null;
};

export const loadStyle = (href) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  return link;
};

export const getIconElementDeprecated = (name) => {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  return span;
};

export const getLibs = () => '/libs';

// Add functions that are causing errors
export const decorateAutoBlock = (block) => block;

export const decorateLinks = (block) => block;

export const addTempWrapperDeprecated = (block, className) => {
  if (block) {
    block.classList.add(className);
  }
};

export const decorateButtonsDeprecated = () => Promise.resolve();
