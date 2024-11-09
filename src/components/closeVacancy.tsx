"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { archiveById, disArchiveById, vacancyById } from "@/api/vacancy";
import { VacancyRecord, VacancyResponse } from "@/api/api_types";

const CloseVacancy = ({ item }: { item: VacancyResponse }) => {
  return (
    <>
      {item.archive != true ? (
        <Button
          variant={"destructive"}
          onClick={() => {
            archiveById(item.id);
            window.location.reload();
          }}
        >
          В архив
        </Button>
      ) : (
        <>
          <Button
            onClick={() => {
              disArchiveById(item.id);
              window.location.reload();
            }}
          >
            Разархивировать
          </Button>
        </>
      )}
    </>
  );
};

export default CloseVacancy;
