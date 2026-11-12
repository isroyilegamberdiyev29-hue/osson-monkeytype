import { ThemeConfig } from './types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'serika_dark',
    name: 'Serika Dark',
    bgColor: '#323437',
    mainColor: '#e2b714',
    caretColor: '#e2b714',
    subColor: '#646669',
    subAltColor: '#2c2e31',
    textColor: '#d1d0c5',
    errorColor: '#ca4754',
    errorExtraColor: '#7e2a33',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    bgColor: '#282a36',
    mainColor: '#bd93f9',
    caretColor: '#ff79c6',
    subColor: '#6272a4',
    subAltColor: '#21222c',
    textColor: '#f8f8f2',
    errorColor: '#ff5555',
    errorExtraColor: '#a12b2b',
  },
  {
    id: 'nord',
    name: 'Nord',
    bgColor: '#2e3440',
    mainColor: '#88c0d0',
    caretColor: '#88c0d0',
    subColor: '#4c566a',
    subAltColor: '#242933',
    textColor: '#eceff4',
    errorColor: '#bf616a',
    errorExtraColor: '#7a3e44',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    bgColor: '#1a102f',
    mainColor: '#ffe600',
    caretColor: '#ffe600',
    subColor: '#594380',
    subAltColor: '#120b22',
    textColor: '#00ffc2',
    errorColor: '#ff0055',
    errorExtraColor: '#9e0035',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    bgColor: '#313131',
    mainColor: '#f66e0d',
    caretColor: '#f66e0d',
    subColor: '#616161',
    subAltColor: '#202020',
    textColor: '#f5e6c8',
    errorColor: '#e44141',
    errorExtraColor: '#8c2626',
  },
  {
    id: 'matrix',
    name: 'Matrix',
    bgColor: '#0d1117',
    mainColor: '#00ff66',
    caretColor: '#00ff66',
    subColor: '#238636',
    subAltColor: '#080c10',
    textColor: '#7ee787',
    errorColor: '#da3633',
    errorExtraColor: '#7e2321',
  },
  {
    id: 'espresso',
    name: 'Coffee / Espresso',
    bgColor: '#211714',
    mainColor: '#c69774',
    caretColor: '#c69774',
    subColor: '#534641',
    subAltColor: '#160e0c',
    textColor: '#e8dacf',
    errorColor: '#b84646',
    errorExtraColor: '#692525',
  },
  {
    id: 'botanical',
    name: 'Botanical',
    bgColor: '#1b2b22',
    mainColor: '#7ba087',
    caretColor: '#7ba087',
    subColor: '#495e52',
    subAltColor: '#132019',
    textColor: '#e1ebe5',
    errorColor: '#e06c75',
    errorExtraColor: '#8c4248',
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    bgColor: '#191f28',
    mainColor: '#40a9ff',
    caretColor: '#40a9ff',
    subColor: '#566173',
    subAltColor: '#131820',
    textColor: '#c8d3f5',
    errorColor: '#ff5370',
    errorExtraColor: '#8f2e3e',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bgColor: '#1a162b',
    mainColor: '#ff7e67',
    caretColor: '#ff7e67',
    subColor: '#5b5377',
    subAltColor: '#120f20',
    textColor: '#f3e9e8',
    errorColor: '#f85149',
    errorExtraColor: '#962b25',
  },
  {
    id: 'paper_light',
    name: 'Paper Light',
    bgColor: '#f4f4f4',
    mainColor: '#e09f00',
    caretColor: '#e09f00',
    subColor: '#999999',
    subAltColor: '#e2e2e2',
    textColor: '#333333',
    errorColor: '#cc3333',
    errorExtraColor: '#882222',
    isLight: true,
  },
];

export const DEFAULT_THEME = THEMES[0];

export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  root.style.setProperty('--bg-color', theme.bgColor);
  root.style.setProperty('--main-color', theme.mainColor);
  root.style.setProperty('--caret-color', theme.caretColor);
  root.style.setProperty('--sub-color', theme.subColor);
  root.style.setProperty('--sub-alt-color', theme.subAltColor);
  root.style.setProperty('--text-color', theme.textColor);
  root.style.setProperty('--error-color', theme.errorColor);
  root.style.setProperty('--error-extra-color', theme.errorExtraColor);

  if (theme.isLight) {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }
}
