export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function convertStringsToOptions(strings) {
    console.log("strings: " + strings)
    return strings.map((s) => {
        return {title: capitalize(s), value: s};
    });
}

export function collectVariableGroups(locations) {
    let types = new Set()
    let scripts = new Set()
    let firstWords = new Set()
    let locationOptions = new Set()
    let places = new Set()
    locations.map((loc) => {
        scripts.add(loc.script)
        firstWords.add(loc.first_word)
        loc.location && locationOptions.add(loc.location)
        types.add(loc.type) // var && for possible missing values
        loc.place && places.add(loc.place)
    }) // [...mySet]
    return [[...scripts], [...firstWords], [...locationOptions], [...types], [...places]]
}

export function collectVariableOptions([scripts, firstWords, locationOptions, types, places]) {
    // groups = [scripts, firstWords, locationOptions, types, places]
    return [
        convertStringsToOptions(scripts), 
        convertStringsToOptions(firstWords), 
        convertStringsToOptions(locationOptions), 
        convertStringsToOptions(types), 
        convertStringsToOptions(places)
    ]
}