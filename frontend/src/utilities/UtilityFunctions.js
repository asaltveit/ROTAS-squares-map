export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function convertStringsToOptions(strings) {
    return strings.map((s) => {
        return {title: capitalize(s), value: s};
    });
}

export function convertYearTypetoView(type) {
    return capitalize(type) + " year";
}