export interface QuoteItem {
  id: string;
  text: string;
  source: string;
  length: 'short' | 'medium' | 'long';
  language: 'uzbek' | 'english';
}

export const QUOTES: QuoteItem[] = [
  {
    id: 'uz_1',
    text: 'Ilm o\'rganish har bir inson uchun eng sharafli va eng ulug\' yo\'ldir.',
    source: 'Sharq hikmati',
    length: 'short',
    language: 'uzbek',
  },
  {
    id: 'uz_2',
    text: 'Harakat qilgan har qanday odam o\'z maqsadiga erishadi, sabr esa eng yaxshi qurol.',
    source: 'O\'zbek maqoli',
    length: 'medium',
    language: 'uzbek',
  },
  {
    id: 'uz_3',
    text: 'Tezlik mahorat bilan uyg\'unlashganda har qanday to\'siq yengib o\'tiladi. Klaviaturada yozish mahorati esa zamonaviy tafakkurning ko\'zgusidir.',
    source: 'Zamonaviy nasihat',
    length: 'long',
    language: 'uzbek',
  },
  {
    id: 'en_1',
    text: 'The only way to do great work is to love what you do.',
    source: 'Steve Jobs',
    length: 'short',
    language: 'english',
  },
  {
    id: 'en_2',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    source: 'Winston Churchill',
    length: 'medium',
    language: 'english',
  },
  {
    id: 'en_3',
    text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit. Practice every single day to achieve true keyboard mastery.',
    source: 'Aristotle',
    length: 'long',
    language: 'english',
  },
];
