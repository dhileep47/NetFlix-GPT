import OpenAI from "openai";
import { GPT_KEY } from "./constants";

const openai = new OpenAI({
  apiKey: GPT_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export default openai;
