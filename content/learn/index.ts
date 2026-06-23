import type { ModuleContent } from './types';
import { maqasidAlShariah } from './maqasid-al-shariah';
import { riba } from './riba';
import { ghararAndMaysir } from './gharar-and-maysir';
import { halalHaramSectors } from './halal-haram-sectors';
import { sourcesOfIslamicLaw } from './sources-of-islamic-law';
import { murabaha } from './murabaha';
import { musharakah } from './musharakah';
import { mudarabah } from './mudarabah';
import { ijarah } from './ijarah';
import { salamAndIstisna } from './salam-and-istisna';
import { qardHasan } from './qard-hasan';
import { wakalahAndKafalah } from './wakalah-and-kafalah';
import { islamicBankStructure } from './islamic-bank-structure';
import { islamicBankDeposits } from './islamic-bank-deposits';
import { islamicBankFinancing } from './islamic-bank-financing';
import { shariahGovernance } from './shariah-governance';
import { islamicBankingRegulation } from './islamic-banking-regulation';
import { islamicBankingCaseStudies } from './islamic-banking-case-studies';
import { sukuk } from './sukuk';
import { islamicEquityScreening } from './islamic-equity-screening';
import { takaful } from './takaful';
import { islamicReitsAndFunds } from './islamic-reits-and-funds';
import { indexMethodologyAndEtfs } from './index-methodology-and-etfs';

export const moduleContentRegistry: Record<string, ModuleContent> = {
  'maqasid-al-shariah': maqasidAlShariah,
  riba,
  'gharar-and-maysir': ghararAndMaysir,
  'halal-haram-sectors': halalHaramSectors,
  'sources-of-islamic-law': sourcesOfIslamicLaw,
  murabaha,
  musharakah,
  mudarabah,
  ijarah,
  'salam-and-istisna': salamAndIstisna,
  'qard-hasan': qardHasan,
  'wakalah-and-kafalah': wakalahAndKafalah,
  'islamic-bank-structure': islamicBankStructure,
  'islamic-bank-deposits': islamicBankDeposits,
  'islamic-bank-financing': islamicBankFinancing,
  'shariah-governance': shariahGovernance,
  'islamic-banking-regulation': islamicBankingRegulation,
  'islamic-banking-case-studies': islamicBankingCaseStudies,
  sukuk,
  'islamic-equity-screening': islamicEquityScreening,
  takaful,
  'islamic-reits-and-funds': islamicReitsAndFunds,
  'index-methodology-and-etfs': indexMethodologyAndEtfs,
};
