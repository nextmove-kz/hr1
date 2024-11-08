import clientPocketBase from "./client_pb";

export const createVacancy = async (vacancy: any) => {
  try {
    const data = await clientPocketBase.collection("vacancy").create(vacancy);
    return data;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};

export const getVacancies = async (vacancy: string) => {
  try {
    const vacancies = await clientPocketBase
      .collection("vacancy")
      .getFullList({ filter: `{"title":"${vacancy}"}` });
    return vacancies;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
};
