import { pocketbase } from "./pocketbase";

export const getResume = async (id: string) => {
    const pb = pocketbase();
    const resume = await pb.collection("resume").getOne(id);
    return resume;
};