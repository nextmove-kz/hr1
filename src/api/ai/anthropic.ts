"use server";
import Anthropic from "@anthropic-ai/sdk";
import { VacancyRecord } from "../api_types";

export type AISummary = {
  fullName: string;
  resumeJobName: string;
  resumeScore: string;
  advantages: string;
  disadvantages: string;
  summary: string;
};

export async function zapros(job_description: string, resume: string) {
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

    Для каждого резюме подготовьте анализ в следующем формате JSON:
    {
    "fullName": "",
    "resumeJobName": "",
    "resumeScore": 0,
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
    - resumeScore: оценка от 1 до 10, где 10 - идеальное совпадение с требованиями
    - advantages: список преимуществ резюме относительно требований вакансии
    - disadvantages: список несоответствий или недостатков относительно требований
    - summary: обобщенное описание кандидата и резюме в 2-3 предложения и оценка того, насколько он подходит на позицию
    Важные замечания:
    - Все значения в JSON должны быть только на русском языке
    - Предоставьте только заполненный JSON для каждого резюме, без дополнительных комментариев
    - Если предоставлено несколько резюме, проанализируйте каждое отдельно и предоставьте отдельный JSON для каждого

    Приступайте к анализу и формированию JSON для каждого резюме.`;

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: textMessage }],
  });
  const response = msg.content[0] as { text: any };
  const data = JSON.parse(response.text);
  const final = {
    fullName: data.fullName,
    resumeJobName: data.resumeJobName,
    resumeScore: data.resumeScore,
    advantages: data.advantages.join("\n"),
    disadvantages: data.disadvantages.join("\n"),
    summary: data.summary,
  } as AISummary;
  console.log(final);
  return final;
}
