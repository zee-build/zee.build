import type { ModuleContent } from './types';
import { maqasidAlShariah } from './maqasid-al-shariah';
import { riba } from './riba';
import { ghararAndMaysir } from './gharar-and-maysir';
import { halalHaramSectors } from './halal-haram-sectors';
import { sourcesOfIslamicLaw } from './sources-of-islamic-law';

export const moduleContentRegistry: Record<string, ModuleContent> = {
  'maqasid-al-shariah': maqasidAlShariah,
  riba,
  'gharar-and-maysir': ghararAndMaysir,
  'halal-haram-sectors': halalHaramSectors,
  'sources-of-islamic-law': sourcesOfIslamicLaw,
};
