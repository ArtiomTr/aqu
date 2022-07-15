export const timeFrom = (begin: Date) => {
    const ms = new Date().getTime() - begin.getTime();

    if (ms < 700) {
        return `${ms}ms`;
    } else if (ms < 7000) {
        return `${(ms / 1000).toFixed(1)}secs`;
    } else {
        return `${Math.round(ms / 1000)}secs`;
    }
};
