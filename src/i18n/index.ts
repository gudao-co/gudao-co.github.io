import i18n from 'i18next';
import { useTranslation as _useTranslation, initReactI18next } from 'react-i18next';
import zh_CN from './zh_CN'
import en_US from './en_US'

export var useTranslation = _useTranslation

export interface Language {
    name: string
    title: string
    symbol: string
}

export var Languages: Language[] = [{
    name: "en_US",
    title: "English",
    symbol: "EN"
},
{
    name: "zh_CN",
    title: "简体中文",
    symbol: "CN"
}]

export var lang: Language = Languages[0];

(function () {

    let v = localStorage.getItem("lang")

    for (let i of Languages) {
        if (i.name === v) {
            lang = i;
            break
        }
    }

})();

export function setLang(v: Language): void {
    lang = v
    localStorage.setItem("lang", v.name)
    i18n.changeLanguage(v.name)
}

export function getLang(): Language {
    return lang
}

i18n.use(initReactI18next).init({
    resources: {
        'zh_CN': zh_CN,
        'en_US': en_US,
    },
    lng: lang.name,
    fallbackLng: lang.name,
    interpolation: {
        escapeValue: false,
    }
})
