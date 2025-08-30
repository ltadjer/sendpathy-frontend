import axios from 'axios'

export const googleLangMap: Record<string, string> = {
  Français: 'fr',
  Anglais: 'en',
  Espagnol: 'es',
  Allemand: 'de',
  Chinois: 'zh-CN',
  Japonais: 'ja',
  Coréen: 'ko',
  Russe: 'ru',
  Portugais: 'pt',
  Italien: 'it'
}

export async function translateText(content: string, userLang: string): Promise<string | null> {
  const targetLang = googleLangMap[userLang] || 'en'

  try {
    const response = await axios.post(
      'http://localhost:5000/translate',
      {
        q: content,
        source: 'auto',
        target: targetLang
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return response.data.translatedText
  } catch (error) {
    console.error('Erreur lors de la traduction :', error)
    return null
  }
}
