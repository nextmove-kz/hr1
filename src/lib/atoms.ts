import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'


export const inviteAtom = atomWithStorage<Boolean>('invite', false);
