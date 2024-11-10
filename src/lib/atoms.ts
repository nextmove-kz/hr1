import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils'

type ButtonStatus = "ready" | "accept" | "archive";


export const inviteAtom = atomWithStorage<Boolean>('invite', false);
export const buttonStatusAtom = atomWithStorage<ButtonStatus>('buttonStatus', "ready");