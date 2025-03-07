export const isMobile: boolean = (
    'ontouchstart' in document.documentElement && !!(navigator.userAgent.match(/Mobi/))
);