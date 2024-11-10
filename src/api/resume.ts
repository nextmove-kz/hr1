import { useRouter } from "next/navigation";
import clientPocketBase from "./client_pb";
import { pocketbase } from "./pocketbase";

export const getResume = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").getFullList({ filter: `vacancy = "${id}"` });
    return resume;
};

export const accept = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").update(id, { status: "accept" });
    return resume;
};


export const reject = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").update( id, {status: "reject" });
    return resume;
};

export const inviteResume = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").update( id, {accepted: "invite"});
    return resume;
};

export const hireResume = async (id: string) => {
    const pb = clientPocketBase;
    const resume = await pb.collection("resume").update( id, {accepted: "hire"});
    return resume;
};