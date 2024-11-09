import clientPocketBase from "./client_pb";
import { pocketbase } from "./pocketbase";

export const getResume = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").getFullList({ filter: `vacancy = "${id}"` });
    return resume;
};
