import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // AI Homepage Planner Endpoint
  app.post("/api/ai/planner", async (req, res) => {
    try {
      const { industry, targetAudience, keywords } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `당신은 10년 차 웹 기획자이자 마케터입니다. 사용자가 입력한 정보를 바탕으로 전환율이 높은 랜딩페이지 구조와 카피를 기획해주세요.

서비스 업종: ${industry}
타겟 고객: ${targetAudience}
강조할 키워드: ${keywords}

다음 구조로 마크다운 형식으로 작성해주세요:
1. 메인 히어로 섹션 (메인 카피, 서브 카피, CTA 버튼)
2. 우리 서비스가 필요한 이유 (고객의 문제점 공감)
3. 서비스 특장점 3가지
4. 추천 타겟
5. 예상되는 자주 묻는 질문 2가지
전문적이고 신뢰감 있으면서도 행동을 유도(CTA)하는 톤앱매너를 사용하세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error(error);
      if (error?.status === 503 || error?.message?.includes("503")) {
        res.status(503).json({ error: "현재 이용자가 많아 AI 서비스가 지연되고 있습니다. 잠시 후 1~2분 뒤 다시 시도해주세요." });
      } else {
        res.status(500).json({ error: "Failed to generate content" });
      }
    }
  });

  // AI Copywriter Endpoint
  app.post("/api/ai/copywriter", async (req, res) => {
    try {
      const { topic, tone } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `당신은 천재적인 카피라이터입니다. 아래 주제로 웹사이트에 쓸 세련된 카피를 3가지 제안해주세요. 톤앤매너는 '${tone}'하게 작성해주세요.
주제: ${topic}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error(error);
      if (error?.status === 503 || error?.message?.includes("503")) {
        res.status(503).json({ error: "현재 이용자가 많아 AI 서비스가 지연되고 있습니다. 잠시 후 1~2분 뒤 다시 시도해주세요." });
      } else {
        res.status(500).json({ error: "Failed to generate content" });
      }
    }
  });
  
  // AI Chatbot Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemInstruction = "당신은 AI 홈페이지 제작 솔루션 '온오프마케팅'의 친절한 AI CS 직원입니다. 사용자의 질문에 짧고 간결하게, 이해하기 쉽게 답변해주세요. 요금제 문의 시 무료 체험은 가능하며, 정식은 베이직/프로/엔터프라이즈 요금제가 있다고 안내하세요. 업종별 제작 사례를 제공합니다.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error(error);
      if (error?.status === 503 || error?.message?.includes("503")) {
        res.status(503).json({ error: "현재 이용자가 많아 AI 어시스턴트 응답이 지연되고 있습니다. 잠시 후 다시 질문해주세요." });
      } else {
        res.status(500).json({ error: "Failed to respond" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
