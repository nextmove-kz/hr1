"use server";
import Anthropic from "@anthropic-ai/sdk";
import { ResumeRecord, VacancyRecord } from "../api_types";

export type AISummary = {
  fullName: string;
  resumeJobName: string;
  resumeScore: string;
  advantages: string;
  disadvantages: string;
  summary: string;
  contactData: string;
  resumeSoft: string;
  resumeHard: string;
  city: string;
  experience: string;
  education: boolean;
};

export const formatJobDescription = (
  job_description: VacancyRecord
): string => {
  return `
  <title>${job_description.title}</title>
  <description>${job_description.description}</description>
  <city>${job_description.city}</city>
  <experience>${job_description.experience}</experience>
  <employment_type>${job_description.employment_type}</employment_type>
  `;
};

export async function zapros(
  job_description: string | VacancyRecord,
  resume: string
): Promise<ResumeRecord[]> {
  if (typeof job_description !== "string") {
    job_description = await formatJobDescription(job_description);
  }
  const anthropic = new Anthropic({
    // НЕ КОММИТИТЬ АПИ КЛЮЧ НИКОГДА НИКОГДА НИКОГДА НИКОГДА НИКОГДА
    apiKey: process.env.ANTHROPIC_KEY,
    dangerouslyAllowBrowser: true,
  });
  const textMessage = `Вы будете анализировать соответствие резюме кандидата требованиям вакансии. Вам будет предоставлено описание вакансии и одно или несколько резюме. Ваша задача - оценить каждое резюме и предоставить структурированный анализ в формате JSON.

    Сначала ознакомьтесь с описанием вакансии:

    <job_description>
    ${job_description}
    </job_description>

    Теперь ознакомьтесь с резюме кандидата(ов):

    <resume>
    ${resume}
    </resume>

    Проанализируйте каждое резюме на соответствие требованиям вакансии. При анализе учитывайте следующие аспекты:
    1) Соответствие опыта работы требованиям
    2) Наличие требуемых навыков и технологий
    3) Соответствие уровня образования
    4) Релевантность предыдущих проектов
    5) Соответствие дополнительным требованиям вакансии
    6) Соотвествие уровню заработной платы

    Для каждого резюме подготовьте анализ в следующем формате JSON:
    {
    "fullName": "",
    "resumeJobName": "",
    "resumeScore": 0,
    "resumeHard": 0,
    "resumeSoft": 0,
    "contactData": "",
    "city": "",
    "experience": "",
    "education": "",
    "advantages": [
        "",
        ""
    ],
    "disadvantages": [
        "",
        ""
    ],
    "summary": ""
    }

    Где:
    - fullName: полное имя кандидата, полученное из текста резюме
    - resumeJobName: как кандидат называет свою профессию в резюме (берите из первых строк резюме, не из опыта работы)
    - resumeScore: оценка от 1 до 100, где 100 - идеальное совпадение с требованиями
    - resumeHard: оценка от 1 до 100, где 100 - идеальное совпадение с требованиями
    - resumeSoft: оценка от 1 до 100, где 100 - идеальное совпадение с требованиями
    - contactData: Контактные данные кандидата
    - city: Город кандидата
    - experience: Опыт работы кандидата
    - education: Наличие или отсутсвие высшего образовния у кандидата (true/false)
    - advantages: список преимуществ резюме относительно требований вакансии
    - disadvantages: список несоответствий или недостатков относительно требований
    - summary: обобщенное описание кандидата и резюме в 2-3 предложения и оценка того, насколько он подходит на позицию
    Важные замечания:
    - Все значения в JSON должны быть только на русском языке
    - Предоставьте только заполненный JSON для каждого резюме, без дополнительных комментариев
    - Если предоставлено несколько резюме, проанализируйте каждое отдельно и предоставьте отдельный JSON для каждого. Финальный результат всегда должен быть списком JSON.  

    Приступайте к анализу и формированию JSON для каждого резюме.`;
  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2024,
    messages: [{ role: "user", content: textMessage }],
  });
  console.log("msg", msg.content);
  const response = msg.content[0] as { text: any };
  console.log(response.text);
  let data = JSON.parse(response.text);
  if (!Array.isArray(data)) data = [data];
  const final: ResumeRecord[] = data.map((item: any) => ({
    fullName: item.fullName,
    jobName: item.resumeJobName,
    rating: item.resumeScore,
    pros: item.advantages.join("\n"),
    cons: item.disadvantages.join("\n"),
    summary: item.summary,
    city: item.city,
    experience: item.experience,
    education: item.education,
    contactData: item.contactData,
    resumeSoft: item.resumeSoft,
    resumeHard: item.resumeHard,
  }));
  console.log(final);
  return final;
}
