import { TrainingSession } from '../types/training';

export const trainings: Training[] = [
  {
    id: '1',
    title: 'Haladó Toborzási Stratégiák',
    shortDescription: 'Ismerje meg a legújabb technikákat a legjobb tehetségek vonzására és felvételére.',
    description: 'Ebben az intenzív tréningben megismerkedhet a modern toborzási technikákkal, a tehetségvonzás stratégiáival és a kiválasztási folyamat hatékonyabbá tételével. Megtanulja, hogyan építsen erős munkáltatói márkát, hogyan használja hatékonyan a közösségi médiát a toborzásban, és hogyan alkalmazzon adatvezérelt megközelítést a legjobb jelöltek azonosításához.',
    topic: 'recruitment',
    date: '2024-07-15',
    month: 'Július',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 49900,
    imageUrl: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Kovács Éva',
      bio: 'Kovács Éva 15 éves tapasztalattal rendelkezik a toborzás területén, és korábban több multinacionális vállalatnál dolgozott HR vezetőként.',
      imageUrl: 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  },
  {
    id: '2',
    title: 'Hatékony Teljesítménymenedzsment',
    shortDescription: 'Sajátítsa el a célok kitűzésének, a visszajelzés adásának és a teljesítményértékelések lefolytatásának művészetét.',
    description: 'A teljesítménymenedzsment tréningünk olyan gyakorlati eszközöket és technikákat kínál, amelyek segítenek a vezetőknek és HR szakembereknek hatékony célok kitűzésében, konstruktív visszajelzés adásában és objektív teljesítményértékelések lefolytatásában. Megtanulja, hogyan alakítson ki olyan teljesítménykultúrát, amely motiválja a munkavállalókat és elősegíti a folyamatos fejlődést.',
    topic: 'performance',
    date: '2024-07-22',
    month: 'Július',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 52900,
    imageUrl: 'https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Nagy Péter',
      bio: 'Nagy Péter teljesítménymenedzsment tanácsadó és tréner, aki több mint 100 vállalatnál segített már hatékony teljesítményértékelési rendszerek kialakításában.',
      imageUrl: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  },
  {
    id: '3',
    title: 'Navigálás a Munkavállalói Kapcsolatokban',
    shortDescription: 'Fejlessze készségeit a munkavállalói viták kezelésében és a pozitív munkakörnyezet fenntartásában.',
    description: 'Ez a tréning a munkavállalói kapcsolatok kezelésének minden aspektusát lefedi, beleértve a konfliktuskezelést, a kommunikációt és a csapatépítést. Gyakorlati eszközöket kap a munkavállalói elégedettség növelésére, a viták hatékony kezelésére és egy pozitív, támogató munkakörnyezet kialakítására, amely növeli a megtartást és a produktivitást.',
    topic: 'relations',
    date: '2024-08-05',
    month: 'Augusztus',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 45900,
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Tóth Andrea',
      bio: 'Tóth Andrea szervezeti pszichológus és munkavállalói kapcsolatok szakértő, aki specializálódott a munkahelyi konfliktusok kezelésére és a csapatdinamikára.',
      imageUrl: 'https://images.pexels.com/photos/5905520/pexels-photo-5905520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  },
  {
    id: '4',
    title: 'Javadalmazási és Juttatási Rendszerek Tervezése',
    shortDescription: 'Ismerje meg, hogyan hozhat létre versenyképes javadalmazási és juttatási csomagokat, amelyek vonzzák és megtartják a munkavállalókat.',
    description: 'Ezen a tréningen megismerheti a kompenzációs és juttatási rendszerek megtervezésének és megvalósításának legjobb gyakorlatait. Megtanulja, hogyan végezzen piaci elemzést, hogyan alakítson ki versenyképes fizetési struktúrákat, és hogyan fejlesszen ki olyan juttatási csomagokat, amelyek megfelelnek a különböző munkavállalói csoportok igényeinek, miközben megfelelnek a vállalat költségvetési korlátainak.',
    topic: 'compensation',
    date: '2024-08-19',
    month: 'Augusztus',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 54900,
    imageUrl: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Szabó Gábor',
      bio: 'Szabó Gábor kompenzációs és juttatási szakértő, aki korábban a pénzügyi szektorban dolgozott HR vezetőként, és széleskörű tapasztalattal rendelkezik a javadalmazási stratégiák területén.',
      imageUrl: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  },
  {
    id: '5',
    title: 'Vezetői Készségfejlesztés HR Szakembereknek',
    shortDescription: 'Fejlessze vezetői készségeit a HR gyakorlatban való hatékonyabb alkalmazáshoz.',
    description: 'Ez a tréning kifejezetten HR szakemberek számára készült, hogy fejlessze vezetői készségeiket és stratégiai gondolkodásukat. Megtanulhatja, hogyan kezelje a változásokat, hogyan befolyásolja a vállalati kultúrát, és hogyan váljon stratégiai partnerré a szervezeten belül. A tréning gyakorlati eszközöket és technikákat kínál a HR funkció hatékonyabb vezetéséhez és a szervezeti célok eléréséhez.',
    topic: 'performance',
    date: '2024-09-10',
    month: 'Szeptember',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 59900,
    imageUrl: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Varga Júlia',
      bio: 'Varga Júlia korábban HR igazgatóként dolgozott több nemzetközi vállalatnál, és szakterülete a HR stratégia és a vezetői készségfejlesztés.',
      imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  },
  {
    id: '6',
    title: 'Haladó Toborzási Stratégiák',
    shortDescription: 'Második alkalom: Ismerje meg a legújabb technikákat a legjobb tehetségek vonzására és felvételére.',
    description: 'Ebben az intenzív tréningben megismerkedhet a modern toborzási technikákkal, a tehetségvonzás stratégiáival és a kiválasztási folyamat hatékonyabbá tételével. Megtanulja, hogyan építsen erős munkáltatói márkát, hogyan használja hatékonyan a közösségi médiát a toborzásban, és hogyan alkalmazzon adatvezérelt megközelítést a legjobb jelöltek azonosításához.',
    topic: 'recruitment',
    date: '2024-09-25',
    month: 'Szeptember',
    year: '2024',
    location: 'Budapest, Központi Iroda',
    price: 49900,
    imageUrl: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    trainer: {
      name: 'Kovács Éva',
      bio: 'Kovács Éva 15 éves tapasztalattal rendelkezik a toborzás területén, és korábban több multinacionális vállalatnál dolgozott HR vezetőként.',
      imageUrl: 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  }
];

export const topicOptions = [
  { id: 'all', label: 'Összes téma' },
  { id: 'recruitment', label: 'Toborzás' },
  { id: 'performance', label: 'Teljesítménymenedzsment' },
  { id: 'relations', label: 'Munkavállalói kapcsolatok' },
  { id: 'compensation', label: 'Javadalmazás és juttatások' }
];

export const getTrainingById = (id: string): Training | undefined => {
  return trainings.find(training => training.id === id);
};

export const groupTrainingsByMonth = (sessions: TrainingSession[]): Record<string, TrainingSession[]> => {
  const grouped: Record<string, Training[]> = {};
  
  sessions.forEach(session => {
    if (!session.date) return;
    
    const date = new Date(session.date);
    const key = `${date.getFullYear()} ${date.toLocaleString('hu-HU', { month: 'long' })}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(session);
  });
  
  return grouped;
};
