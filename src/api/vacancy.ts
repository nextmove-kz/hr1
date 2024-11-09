import clientPocketBase from "./client_pb";
import { pocketbase } from "./pocketbase";

export const createVacancy = async (vacancy: any) => {
  try {
    const data = await clientPocketBase.collection("vacancy").create(vacancy);
    return data;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};

export const viewVacancy = async () => {
  try {
    const data = await clientPocketBase.collection("vacancy").getFullList();
    console.log(data);

    return data;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};

export const getVacancyList = async () => {
  "use server";
  return await pocketbase().collection("vacancy").getFullList();
};
