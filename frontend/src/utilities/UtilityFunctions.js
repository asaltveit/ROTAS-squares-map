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

export function plotPointTitle(point) {
    let title = "Created from: " + point.created_year_start
    if (point.created_year_end) {
        title += "-" + point.created_year_end + "\n\n"
    } else {
        title += "\n\n"
    }
    if (point.script) {
        title += "Script: " + point.script + "\n\n"
    }
    if (point.text) {
        title += "Text: " + point.text + "\n\n"
    }
    if (point.place) {
        title += "Place: " + point.place + "\n\n"
    }
    if (point.location) {
        title += "Location: " + point.location + "\n\n"
    }
    if (point.discovered_year) {
        title += "Year Discovered: " + point.discovered_year + "\n\n"
    }
    if (point.shelfmark) {
        title += "Shelfmark: " + point.shelfmark + "\n\n"
    }
    return title
}