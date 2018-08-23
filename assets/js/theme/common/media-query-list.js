/*
 * Remember to update /assets/scss/settings/global/screensizes/screensizes.scss
 * if you decide to change breakpoint values
 */
const breakpointSizes = {
    large: 1467,
    medium: 801,
    small: 501,
};

/**
 * Create MediaQueryList using breakpoint name
 * @param {string} breakpointName
 * @return {MediaQueryList|null}
 */
export default function mediaQueryListFactory(breakpointName) {
    if (!breakpointName || !window.matchMedia) {
        return null;
    }

    const breakpoint = breakpointSizes[breakpointName];
    const mediaQuery = `(min-width: ${breakpoint}px)`;
    const mediaQueryList = window.matchMedia(mediaQuery);

    return mediaQueryList;
}
