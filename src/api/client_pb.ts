import PocketBase from "pocketbase";
import { TypedPocketBase } from "./api_types";
import { pocketbaseUrl } from "./serverEnv";

const clientPocketBase = new PocketBase(
  "https://pocketbase.nextmove.kz"
) as TypedPocketBase;
clientPocketBase.autoCancellation(false);
export default clientPocketBase;
