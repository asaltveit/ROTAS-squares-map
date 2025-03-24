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

export function findNewFloat(currentFloats, f) {
    let dif = 0.2
    let i = 1
    let sign = 1
    let newFloat = f
    while (currentFloats.filter(d => d == newFloat).length != 0){
        // Will add up to 2.0 more  
        if (i == 11) {
            // reset to original
            newFloat = f
            sign = -1
            }
        i += 1
        newFloat = sign*i*dif 
        // What if it gets real negative?
    }
    return newFloat
}