export function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function removeNulls(strings) {
    return strings.filter((string) => string)
}

export function convertStringsToOptions(strings) {
    return removeNulls(strings).map((s) => {
        return {title: capitalize(s), value: s};
    });
}

export function convertYearTypetoView(type) {
    return capitalize(type) + " year";
}

// TODO Move this to server side
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
        title += "-" + point.created_year_end
    }
    if (point.script) {
        title += "\n\n Script: " + point.script
    }
    if (point.text) {
        title += "\n\n Text: " + point.text
    }
    if (point.place) {
        title += "\n\n Place: " + point.place
    }
    if (point.location) {
        title += "\n\n Location: " + point.location
    }
    if (point.discovered_year) {
        title += "\n\n Year Discovered: " + point.discovered_year
    }
    if (point.shelfmark) {
        title += "\n\n Shelfmark: " + point.shelfmark
    }
    return title
}

// generate nonce to use for google id token sign-in
export const generateNonce = async () => { // returns a promise?
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
}