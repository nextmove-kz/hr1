"use server";
import Anthropic from "@anthropic-ai/sdk";

export const getAnthropicKey = () => {
  return process.env.ANTHROPIC_KEY;
};
