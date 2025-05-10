export const googleLangMap: Record<string,string> = {
    Français: 'fr',
    Anglais:  'en',
    Espagnol: 'es',
    Allemand: 'de',
    Chinois:  'zh-CN',
    Japonais: 'ja',
    Coréen:   'ko',
    Russe:    'ru',
    Portugais:'pt',
    Italien:  'it',
};

export function changeGoogleTranslate(langCode: string) {
    console.log('Changing Google Translate language to:', langCode);
    const tryCombo = () => {
        const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (combo && combo.value !== langCode) { // Vérifie si la langue est déjà correcte
            combo.value = langCode;
            combo.dispatchEvent(new Event('change'));
        } else if (!combo) {
            setTimeout(tryCombo, 100);
        }
    };
    tryCombo();
}
