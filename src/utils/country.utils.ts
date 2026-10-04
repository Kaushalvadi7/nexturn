/**
 * Country utilities for Company Employee Country Representative feature
 * Uses canonical country names and ISO codes from world-map-data
 */

// Canonical country names mapped to their ISO alpha-2 codes (lowercase)
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
    "afghanistan": "af",
    "aland islands": "ax",
    "albania": "al",
    "algeria": "dz",
    "american samoa": "as",
    "andorra": "ad",
    "angola": "ao",
    "anguilla": "ai",
    "antarctica": "aq",
    "antigua and barbuda": "ag",
    "argentina": "ar",
    "armenia": "am",
    "aruba": "aw",
    "australia": "au",
    "austria": "at",
    "azerbaijan": "az",
    "bahamas": "bs",
    "bahrain": "bh",
    "bangladesh": "bd",
    "barbados": "bb",
    "belarus": "by",
    "belgium": "be",
    "belize": "bz",
    "benin": "bj",
    "bermuda": "bm",
    "bhutan": "bt",
    "bolivia": "bo",
    "bosnia and herzegovina": "ba",
    "botswana": "bw",
    "bouvet island": "bv",
    "brazil": "br",
    "british indian ocean territory": "io",
    "brunei darussalam": "bn",
    "bulgaria": "bg",
    "burkina faso": "bf",
    "burundi": "bi",
    "cambodia": "kh",
    "cameroon": "cm",
    "canada": "ca",
    "cape verde": "cv",
    "cayman islands": "ky",
    "central african republic": "cf",
    "chad": "td",
    "chile": "cl",
    "china": "cn",
    "christmas island": "cx",
    "cocos (keeling) islands": "cc",
    "colombia": "co",
    "comoros": "km",
    "congo": "cg",
    "congo, the democratic republic of the": "cd",
    "cook islands": "ck",
    "costa rica": "cr",
    "cote d'ivoire": "ci",
    "croatia": "hr",
    "cuba": "cu",
    "curacao": "cw",
    "cyprus": "cy",
    "czech republic": "cz",
    "denmark": "dk",
    "djibouti": "dj",
    "dominica": "dm",
    "dominican republic": "do",
    "ecuador": "ec",
    "egypt": "eg",
    "el salvador": "sv",
    "equatorial guinea": "gq",
    "eritrea": "er",
    "estonia": "ee",
    "ethiopia": "et",
    "falkland islands (malvinas)": "fk",
    "faroe islands": "fo",
    "fiji": "fj",
    "finland": "fi",
    "france": "fr",
    "french guiana": "gf",
    "french polynesia": "pf",
    "french southern territories": "tf",
    "gabon": "ga",
    "gambia": "gm",
    "georgia": "ge",
    "germany": "de",
    "ghana": "gh",
    "gibraltar": "gi",
    "greece": "gr",
    "greenland": "gl",
    "grenada": "gd",
    "guadeloupe": "gp",
    "guam": "gu",
    "guatemala": "gt",
    "guernsey": "gg",
    "guinea": "gn",
    "guinea-bissau": "gw",
    "guyana": "gy",
    "haiti": "ht",
    "heard island and mcdonald islands": "hm",
    "holy see (vatican city state)": "va",
    "honduras": "hn",
    "hong kong": "hk",
    "hungary": "hu",
    "iceland": "is",
    "india": "in",
    "indonesia": "id",
    "iran, islamic republic of": "ir",
    "iraq": "iq",
    "ireland": "ie",
    "isle of man": "im",
    "israel": "il",
    "italy": "it",
    "jamaica": "jm",
    "japan": "jp",
    "jersey": "je",
    "jordan": "jo",
    "kazakhstan": "kz",
    "kenya": "ke",
    "kiribati": "ki",
    "korea, democratic people's republic of": "kp",
    "korea, republic of": "kr",
    "kuwait": "kw",
    "kyrgyzstan": "kg",
    "lao people's democratic republic": "la",
    "latvia": "lv",
    "lebanon": "lb",
    "lesotho": "ls",
    "liberia": "lr",
    "libya": "ly",
    "liechtenstein": "li",
    "lithuania": "lt",
    "luxembourg": "lu",
    "macao": "mo",
    "macedonia, the former yugoslav republic of": "mk",
    "madagascar": "mg",
    "malawi": "mw",
    "malaysia": "my",
    "maldives": "mv",
    "mali": "ml",
    "malta": "mt",
    "marshall islands": "mh",
    "martinique": "mq",
    "mauritania": "mr",
    "mauritius": "mu",
    "mayotte": "yt",
    "mexico": "mx",
    "micronesia, federated states of": "fm",
    "moldova, republic of": "md",
    "monaco": "mc",
    "mongolia": "mn",
    "montenegro": "me",
    "montserrat": "ms",
    "morocco": "ma",
    "mozambique": "mz",
    "myanmar": "mm",
    "namibia": "na",
    "nauru": "nr",
    "nepal": "np",
    "netherlands": "nl",
    "new caledonia": "nc",
    "new zealand": "nz",
    "nicaragua": "ni",
    "niger": "ne",
    "nigeria": "ng",
    "niue": "nu",
    "norfolk island": "nf",
    "northern mariana islands": "mp",
    "norway": "no",
    "oman": "om",
    "pakistan": "pk",
    "palau": "pw",
    "palestinian territory, occupied": "ps",
    "panama": "pa",
    "papua new guinea": "pg",
    "paraguay": "py",
    "peru": "pe",
    "philippines": "ph",
    "pitcairn": "pn",
    "poland": "pl",
    "portugal": "pt",
    "puerto rico": "pr",
    "qatar": "qa",
    "reunion": "re",
    "romania": "ro",
    "russian federation": "ru",
    "rwanda": "rw",
    "saint barthelemy": "bl",
    "saint helena, ascension and tristan da cunha": "sh",
    "saint kitts and nevis": "kn",
    "saint lucia": "lc",
    "saint martin (french part)": "mf",
    "saint pierre and miquelon": "pm",
    "saint vincent and the grenadines": "vc",
    "samoa": "ws",
    "san marino": "sm",
    "sao tome and principe": "st",
    "saudi arabia": "sa",
    "senegal": "sn",
    "serbia": "rs",
    "seychelles": "sc",
    "sierra leone": "sl",
    "singapore": "sg",
    "sint maarten (dutch part)": "sx",
    "slovakia": "sk",
    "slovenia": "si",
    "solomon islands": "sb",
    "somalia": "so",
    "south africa": "za",
    "south georgia and the south sandwich islands": "gs",
    "south sudan": "ss",
    "spain": "es",
    "sri lanka": "lk",
    "sudan": "sd",
    "suriname": "sr",
    "svalbard and jan mayen": "sj",
    "swaziland": "sz",
    "sweden": "se",
    "switzerland": "ch",
    "syrian arab republic": "sy",
    "taiwan": "tw",
    "tajikistan": "tj",
    "tanzania, united republic of": "tz",
    "thailand": "th",
    "timor-leste": "tl",
    "togo": "tg",
    "tokelau": "tk",
    "tonga": "to",
    "trinidad and tobago": "tt",
    "tunisia": "tn",
    "turkey": "tr",
    "turkmenistan": "tm",
    "turks and caicos islands": "tc",
    "tuvalu": "tv",
    "uganda": "ug",
    "ukraine": "ua",
    "united arab emirates": "ae",
    "united kingdom": "gb",
    "united states": "us",
    "united states minor outlying islands": "um",
    "uruguay": "uy",
    "uzbekistan": "uz",
    "vanuatu": "vu",
    "venezuela, bolivarian republic of": "ve",
    "viet nam": "vn",
    "virgin islands, british": "vg",
    "virgin islands, u.s.": "vi",
    "wallis and futuna": "wf",
    "western sahara": "eh",
    "yemen": "ye",
    "zambia": "zm",
    "zimbabwe": "zw",
};

// Common aliases that map to canonical country names
const COUNTRY_ALIASES: Record<string, string> = {
    "usa": "united states",
    "us": "united states",
    "uk": "united kingdom",
    "uae": "united arab emirates",
    "czechia": "czech republic",
    "russia": "russian federation",
    "south korea": "korea, republic of",
    "north korea": "korea, democratic people's republic of",
    "vietnam": "viet nam",
    "ivory coast": "cote d'ivoire",
    "macedonia": "macedonia, the former yugoslav republic of",
    "moldova": "moldova, republic of",
    "laos": "lao people's democratic republic",
    "burma": "myanmar",
    "syria": "syrian arab republic",
    "venezuela": "venezuela, bolivarian republic of",
    "iran": "iran, islamic republic of",
    "tanzania": "tanzania, united republic of",
    "cote d ivoire": "cote d'ivoire",
    "united states of america": "united states",
    "united states of america (usa)": "united states",
    "great britain": "united kingdom",
    "britain": "united kingdom",
    "the netherlands": "netherlands",
    "holland": "netherlands",
};

const ALL_COUNTRIES = Object.keys(COUNTRY_NAME_TO_CODE);

/**
 * Normalize a country name to its canonical form
 * Returns the canonical country name if valid, null otherwise
 */
export const normalizeCountryName = (countryName: string | null | undefined): string | null => {
    if (!countryName || typeof countryName !== "string") {
        return null;
    }

    const trimmed = countryName.trim();
    if (!trimmed) {
        return null;
    }

    const lower = trimmed.toLowerCase();

    // Check if it's already a canonical name (case-insensitive)
    const canonical = ALL_COUNTRIES.find((c) => c.toLowerCase() === lower);
    if (canonical) {
        // Return properly capitalized canonical name
        return canonical
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Check aliases
    const aliasTarget = COUNTRY_ALIASES[lower];
    if (aliasTarget) {
        return aliasTarget
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    // Not found - return null to indicate invalid
    return null;
};

/**
 * Get ISO alpha-2 code from canonical country name
 */
export const getCountryCode = (canonicalCountryName: string | null | undefined): string | null => {
    if (!canonicalCountryName) return null;
    const lower = canonicalCountryName.toLowerCase();
    return COUNTRY_NAME_TO_CODE[lower] || null;
};

/**
 * Validate if a country name is recognized
 */
export const isValidCountry = (countryName: string | null | undefined): boolean => {
    return normalizeCountryName(countryName) !== null;
};

/**
 * Get all valid canonical country names (for frontend dropdown)
 */
export const getAllCountries = (): string[] => {
    return ALL_COUNTRIES.map((c) =>
        c
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    ).sort();
};