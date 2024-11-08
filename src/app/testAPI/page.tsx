"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Anthropic from "@anthropic-ai/sdk";
import { viewVacancy } from "@/api/vacancy";
import { getAnthropicKey } from "@/api/ai/anthropic";

const page = () => {
  const [allVacancy, setAllVacancy] = useState("");
  const zaprosText = `Я отправлю тебе резюме кандидата(-ов) и описание вакансии. Пожалуйста, проанализируй насколько каждое резюме соответствует требованиям вакансии и заполни для каждого резюме следующий JSON: { \"resumeScore\": , // оценка от 1 до 10, где 10 - идеальное совпадение с требованиями \"advantages\": [ // список преимуществ резюме относительно требований вакансии \"\" ], \"disadvantages\": [ // список несоответствий или недостатков относительно требований \"\" ] } При анализе, пожалуйста, учитывай: 1) Соответствие опыта работы требованиям 2) Наличие требуемых навыков и технологий 3) Соответствие уровня образования 4) Релевантность предыдущих проектов 5) Соответствие дополнительным требованиям вакансии Для каждого резюме предоставь только заполненный JSON
  Вакансия: ${allVacancy}
  Резюме: Кожахметов Давид ,   React Frontend Developer  E-mail: dkozahmetov132@gmail.com  Phone: +77058275283  Telegram: @pumba444  Живу в Казахстане (Караганда)  Обо мне  Фронтенд-разработчик с 2 годами опыта в создании и оптимизации пользовательских интерфейсов.  Работал в динамичном стартапе, где успешно разрабатывал и внедрял решения с упором на быстрый  time-to-market. Обладаю глубоким интересом к информационным технологиям и их роли в трансформации  бизнеса. Стараюсь следовать лучшим практикам и тенденциям в разработке, уделяя особое внимание  пользовательскому опыту и производительности приложений. Имею опыт работы в  кросс-функциональных командах и стремлюсь к постоянному профессиональному росту и освоению  новых технологий.  Навыки  HTML, JavaScript, JSX, Vite React, Css, Docker, Insomnia  Опыт работы  React Frontend Developer  Работал в стартапе LabsEasy  19.02.2024 – 14.05.2024  Обязанности:  ●   Разработка и поддержка фронтенд-части веб-приложения для сервиса онлайн  оформления заявок на выполнение работ для студентов и учеников.  ●   Создание интуитивно понятных и привлекательных пользовательских интерфейсов.  ●   Обеспечение адаптивности интерфейсов для различных устройств и браузеров.  ●   Взаимодействие с командой бэкенд-разработчиков для интеграции API и обеспечения  бесперебойной работы сервиса.  ●   Проведение тестирования и отладки кода для повышения производительности и  устранения ошибок.  ●   Внедрение новых функций и улучшение существующих на основе обратной связи от  пользователей и анализа их поведения.  Достижения:  ●   Успешно разработал и запустил ключевые компоненты пользовательского интерфейса.  ●   Содействовал улучшению пользовательского опыта, внедрив современные UI/UX  практики и провел несколько циклов тестирования с пользователями.  Образование  Студент Карагандинского Технического Университета им. Абылкаса Сагинова  Специальность: Информационные системы`;
  useEffect(() => {
    const data = viewVacancy();
    setAllVacancy(JSON.stringify(data));
    console.log(allVacancy);
  }, []);

  const [inputValue, setInputValue] = useState("");
  const anthropic = new Anthropic({
    // НЕ КОММИТИТЬ АПИ КЛЮЧ НИКОГДА НИКОГДА НИКОГДА НИКОГДА НИКОГДА
    apiKey: getAnthropicKey(),
    dangerouslyAllowBrowser: true,
  });
  async function zapros(text: string) {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: zaprosText }],
    });
    const response = msg.content[0] as { text: string };
    JSON.parse(response.text).advantages.join("\n");
    console.log(msg);
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex w-full max-w-sm space-x-2">
        <Input
          type="text"
          value={inputValue}
          placeholder="text"
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            zapros(inputValue);
          }}
        >
          GO
        </Button>
      </div>
    </div>
  );
};

export default page;
