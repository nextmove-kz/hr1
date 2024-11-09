import { pocketbase } from "./pocketbase";

export const getResume = async (id: string) => {
    const pb = pocketbase();
    const resume = await pb.collection("resume").getFullList({ filter: `vacancy = "${id}"` });
    return resume;
};
