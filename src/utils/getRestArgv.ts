const trwlArgvNames = ["--config", "-c"];

export const getRestArgv = () =>
    process.argv
        .slice(3)
        .filter(
            (value, index, arr) =>
                !trwlArgvNames.includes(value) &&
                !trwlArgvNames.includes(value.substring(value.indexOf("="))) &&
                !(index > 0 && trwlArgvNames.includes(arr[index - 1]))
        );
