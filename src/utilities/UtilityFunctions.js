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

/*
// TODO Move this to server side?
// TODO - not working
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
        newFloat += sign*i*dif
        // What if it gets real negative?
    }
    return newFloat
}

// TODO: Rename?
export function mergeObjects(source) {
    const out = {};
  
    for (const key in source) {
        if (source[key] !== null && source[key] !== undefined) {
            out[key] = source[key]
        } else if (key == "discovered_year" || key == "created_year_end") {
            out[key] = null
        } else {
            out[key] = ""
        }
    }
    return out;
}

export function numberTransform(value) {
    // TODO: Not working?
    if (value && Number(value)) {
        return Number(value)
    } else {
        return null
    }
}
*/
export function estimateLegendHeight(typeCount, containerWidth) {
    const swatchesPerRow = Math.max(1, Math.floor(containerWidth / 120));
    const rows = Math.ceil(typeCount / swatchesPerRow);
    return rows * 18 + 20;
}

export function getMapProjection(locations, markerRadius = 7) {
    const validLocations = (locations ?? []).filter(
        (loc) => loc.longitude != null && loc.latitude != null
    );

    if (validLocations.length === 0) {
        return {
            type: "orthographic",
            rotate: [-15, -43],
            domain: { type: "Sphere" },
            inset: 12,
        };
    }

    const lons = validLocations.map((loc) => Number(loc.longitude));
    const lats = validLocations.map((loc) => Number(loc.latitude));
    const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;

    return {
        type: "orthographic",
        rotate: [-centerLon, -centerLat],
        domain: {
            type: "FeatureCollection",
            features: validLocations.map((loc) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [Number(loc.longitude), Number(loc.latitude)],
                },
                properties: {},
            })),
        },
        inset: markerRadius * 2 + 10,
    };
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

// TODO: still needed?
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