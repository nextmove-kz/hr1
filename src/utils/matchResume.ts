import { VacancyRecord } from "@/api/api_types";

export function matchResumeToVacancy(resume: string, vacancy: VacancyRecord) {
  const resumeText = resume.toLowerCase();
  const vacancyText =
    `${vacancy.title} ${vacancy.description} ${vacancy.city}`.toLowerCase();

  const keyTerms = extractKeyTerms(vacancyText);

  const { score, foundKeywords, missingKeywords } = calculateMatchScore(
    resumeText,
    keyTerms
  );

  return score >= 0.3;
}

function extractKeyTerms(vacancyText: string) {
  const commonWords = new Set([
    "и",
    "в",
    "во",
    "не",
    "что",
    "он",
    "на",
    "я",
    "с",
    "со",
    "как",
    "а",
    "то",
    "все",
    "она",
    "так",
    "его",
    "но",
    "да",
    "ты",
    "к",
    "у",
    "же",
    "вы",
    "за",
    "бы",
    "по",
    "только",
    "ее",
    "мне",
    "было",
    "вот",
    "от",
    "меня",
    "еще",
    "нет",
    "о",
    "из",
    "ему",
    "теперь",
    "когда",
    "даже",
    "ну",
    "вдруг",
    "ли",
    "если",
    "уже",
    "или",
    "ни",
    "быть",
    "был",
    "него",
    "до",
    "вас",
    "нибудь",
    "опять",
    "уж",
    "вам",
    "ведь",
    "там",
    "потом",
    "себя",
    "ничего",
    "ей",
    "может",
    "они",
    "тут",
    "где",
    "есть",
    "надо",
    "ней",
    "для",
    "мы",
    "тебя",
    "их",
    "чем",
    "была",
    "сам",
    "чтоб",
    "без",
    "будто",
    "чего",
    "раз",
    "тоже",
    "себе",
    "под",
    "будет",
    "ж",
    "тогда",
    "кто",
    "этот",
    "того",
    "потому",
    "этого",
    "какой",
    "совсем",
    "ним",
    "здесь",
    "этом",
    "один",
    "почти",
    "мой",
    "тем",
    "чтобы",
    "нее",
    "сейчас",
    "были",
    "куда",
    "зачем",
    "всех",
    "никогда",
    "можно",
    "при",
    "наконец",
    "два",
    "об",
    "другой",
    "хоть",
    "после",
    "над",
    "больше",
    "тот",
    "через",
    "эти",
    "нас",
    "про",
    "всего",
    "них",
    "какая",
    "много",
    "разве",
    "три",
    "эту",
    "моя",
    "впрочем",
    "хорошо",
    "свою",
    "этой",
    "перед",
    "иногда",
    "лучше",
    "чуть",
    "том",
    "нельзя",
    "такой",
    "им",
    "более",
    "всегда",
    "конечно",
    "всю",
    "между",
  ]);

  return vacancyText
    .split(/[\s,.-]+/)
    .filter(
      (word: string) =>
        word.length > 2 && !commonWords.has(word) && !/^\d+$/.test(word)
    );
}
function checkCityMatch(resumeText: string, vacancyCity: string) {
  if (!vacancyCity) return true;

  const cityVariations = [
    vacancyCity.toLowerCase(),
    vacancyCity.toLowerCase() + "е",
    vacancyCity.toLowerCase() + "у",
  ];

  return cityVariations.some((city) => resumeText.includes(city));
}

function calculateMatchScore(resumeText: string, keyTerms: string[]) {
  const foundKeywords = new Set();
  const missingKeywords = new Set();

  for (const term of keyTerms) {
    if (resumeText.includes(term)) {
      foundKeywords.add(term);
    } else {
      missingKeywords.add(term);
    }
  }

  const score = foundKeywords.size / keyTerms.length;

  return {
    score,
    foundKeywords: Array.from(foundKeywords),
    missingKeywords: Array.from(missingKeywords),
  };
}
