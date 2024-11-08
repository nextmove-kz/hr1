import PocketBase from "pocketbase";
import { TypedPocketBase } from "./api_types";
import { pocketbaseUrl } from "./serverEnv";

const clientPocketBase = new PocketBase(
  "http://pocketbase.nextmove.kz:4321"
) as TypedPocketBase;
clientPocketBase.autoCancellation(false);
export default clientPocketBase;
