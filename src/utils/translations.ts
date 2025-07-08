export type Language = 'en' | 'ja';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  
  // Control Panel
  simulationControls: string;
  play: string;
  pause: string;
  reset: string;
  clear: string;
  simulationMode: string;
  normal: string;
  panic: string;
  gathering: string;
  populationSize: string;
  flockingBehavior: string;
  separationDistance: string;
  alignmentDistance: string;
  cohesionDistance: string;
  forceWeights: string;
  separation: string;
  alignment: string;
  cohesion: string;
  speedForce: string;
  maxSpeed: string;
  maxForce: string;
  visualOptions: string;
  showTrails: string;
  showForces: string;
  on: string;
  off: string;
  
  // Stats Panel
  simulationStats: string;
  averageSpeed: string;
  averageDensity: string;
  clusterCount: string;
  totalDistance: string;
  frameRate: string;
  
  // Footer
  footerDescription: string;
  population: string;
  mode: string;
  fps: string;
  
  // Language selector
  language: string;
  english: string;
  japanese: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    title: 'Population Crowd Simulation',
    subtitle: 'Interactive flocking behavior with realistic crowd dynamics',
    
    // Control Panel
    simulationControls: 'Simulation Controls',
    play: 'Play',
    pause: 'Pause',
    reset: 'Reset',
    clear: 'Clear',
    simulationMode: 'Simulation Mode',
    normal: 'Normal',
    panic: 'Panic',
    gathering: 'Gathering',
    populationSize: 'Population Size',
    flockingBehavior: 'Flocking Behavior',
    separationDistance: 'Separation Distance',
    alignmentDistance: 'Alignment Distance',
    cohesionDistance: 'Cohesion Distance',
    forceWeights: 'Force Weights',
    separation: 'Separation',
    alignment: 'Alignment',
    cohesion: 'Cohesion',
    speedForce: 'Speed & Force',
    maxSpeed: 'Max Speed',
    maxForce: 'Max Force',
    visualOptions: 'Visual Options',
    showTrails: 'Show Trails',
    showForces: 'Show Forces',
    on: 'On',
    off: 'Off',
    
    // Stats Panel
    simulationStats: 'Simulation Stats',
    averageSpeed: 'Average Speed',
    averageDensity: 'Average Density',
    clusterCount: 'Cluster Count',
    totalDistance: 'Total Distance',
    frameRate: 'Frame Rate',
    
    // Footer
    footerDescription: 'Advanced crowd simulation with emergent behavior patterns',
    population: 'Population',
    mode: 'Mode',
    fps: 'FPS',
    
    // Language selector
    language: 'Language',
    english: 'English',
    japanese: '日本語'
  },
  ja: {
    title: '集団群衆シミュレーション',
    subtitle: '現実的な群衆動態を伴うインタラクティブな群れ行動',
    
    // Control Panel
    simulationControls: 'シミュレーション制御',
    play: '再生',
    pause: '一時停止',
    reset: 'リセット',
    clear: 'クリア',
    simulationMode: 'シミュレーションモード',
    normal: '通常',
    panic: 'パニック',
    gathering: '集合',
    populationSize: '人口サイズ',
    flockingBehavior: '群れ行動',
    separationDistance: '分離距離',
    alignmentDistance: '整列距離',
    cohesionDistance: '凝集距離',
    forceWeights: '力の重み',
    separation: '分離',
    alignment: '整列',
    cohesion: '凝集',
    speedForce: '速度と力',
    maxSpeed: '最大速度',
    maxForce: '最大力',
    visualOptions: '視覚オプション',
    showTrails: '軌跡を表示',
    showForces: '力を表示',
    on: 'オン',
    off: 'オフ',
    
    // Stats Panel
    simulationStats: 'シミュレーション統計',
    averageSpeed: '平均速度',
    averageDensity: '平均密度',
    clusterCount: 'クラスター数',
    totalDistance: '総距離',
    frameRate: 'フレームレート',
    
    // Footer
    footerDescription: '創発的行動パターンを伴う高度な群衆シミュレーション',
    population: '人口',
    mode: 'モード',
    fps: 'FPS',
    
    // Language selector
    language: '言語',
    english: 'English',
    japanese: '日本語'
  }
};

export const getTranslation = (language: Language, key: keyof Translations): string => {
  return translations[language][key];
}; 