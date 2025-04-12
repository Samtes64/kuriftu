import { ChatGroq,  } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export class LangchainService {
  private llm: ChatGroq;
  private persona: string;
  private systemMessage: SystemMessage;
  constructor() {
    this.llm = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      temperature: 0
    });
    this.persona = `You are an assistant helping on the decision of reward point system
    for loyalty program at kuriftu resorts and hotels.
    We will send you the actions you respond the reward points it deserves`;
    this.systemMessage = new SystemMessage(this.persona);
  }

  async generateResponse(prompt: string) {
    const humanMessage = new HumanMessage(prompt);
    const response = await this.llm.invoke([this.systemMessage, humanMessage]);
    return response.content;
  }
}


