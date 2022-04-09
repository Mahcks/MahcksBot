//const translate = require('@vitalets/google-translate-api');
import translate from "@vitalets/google-translate-api";

/**
 *
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 5/15/16) alongside with their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */

var langs: any = {
  'auto': 'Automatic',
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'he': 'Hebrew',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pa': 'Punjabi',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'gd': 'Scots Gaelic',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu'
};
/**
* Returns the ISO 639-1 code of the desiredLang – if it is supported by Google Translate
* @param {string} desiredLang – the name or the code(case sensitive) of the desired language
* @returns {string|boolean} The ISO 639-1 code of the language or false if the language is not supported
*/
function getCode(desiredLang: string) {
  if (!desiredLang) {
    return false;
  }

  if (langs[desiredLang]) {
    return desiredLang;
  }

  var keys = Object.keys(langs).filter(function (key) {
    if (typeof langs[key] !== 'string') {
      return false;
    }

    return langs[key].toLowerCase() === desiredLang.toLowerCase();
  });

  return keys[0] || false;
}

/**
* Returns true if the desiredLang is supported by Google Translate and false otherwise
* @param desiredLang – the ISO 639-1 code or the name of the desired language
* @returns {boolean}
*/
function isSupported(desiredLang: any) {
  return Boolean(getCode(desiredLang));
}

export interface TranslatedText {
  translated: string;
  text: string;
}

interface TranslationHasTo {
  exists: boolean;
  search: string | null;
}

interface TranslationHasFrom {
  exists: boolean;
  search: string | null;
}

export interface TranslationObject {
  to: TranslationHasTo;
  from: TranslationHasFrom;
  text: string;
}

interface GoogleAPIOptions {
  text: string;
  from: string | null;
  to: string | null;
}

export async function translateText(obj: TranslationObject): Promise<TranslatedText> {
  
  let toSearch: GoogleAPIOptions = {
    from: null,
    to: null,
    text: obj.text
  };
  
  if (obj.from.exists) {
    if (!obj.from.search) {
      toSearch.from = null
    } else {
      toSearch.from = obj.from.search.replace("from:", "")
    }
  }
  
  if (obj.to.exists) {
    if (!obj.to.search) {
      toSearch.to = null
    } else {
      toSearch.to = obj.to.search.replace("to:", "")
    }
  }

  // Auto translate from any language to english.
  if (toSearch.from == null && toSearch.to == null) {
    let res = await translate(obj.text);
    let googleTranslation: TranslatedText = {
      text: res.text,
      translated: langs[res.from.language.iso]
    };
  
    return googleTranslation;
  } else if (toSearch.from !== null && toSearch.to !== null) {
    // Checks if there is both to: and from: in a translation
    let res = await translate(toSearch.text, { from: toSearch.from, to: toSearch.to });
    let googleTranslation: TranslatedText = {
      text: res.text,
      translated: `${langs[res.from.language.iso]} -> ${langs[toSearch.to]}`
    };

    return googleTranslation
  } else if (toSearch.from == null && toSearch.to !== null) {
    // Only if there is a to:
    let res = await translate(toSearch.text, { to: toSearch.to });
    let googleTranslation: TranslatedText = {
      text: res.text,
      translated: `${langs[res.from.language.iso]} -> ${langs[toSearch.to]}`
    };

    return googleTranslation
  }

  let empty: TranslatedText = {
    text: `Error translating that text.`,
    translated: ""
  };

  return empty;
}
