import { GoogleGenAI } from "@google/genai";
import { Transaction, Stock, FinancialSummary } from "../types";

// Add declaration to satisfy TS without depending on @types/node being perfectly picked up
declare const process: {
  env: {
    API_KEY: string | undefined;
  }
};

// Safe initialization - prevents immediate crash if key is missing
const apiKey = process.env.API_KEY || "";
if (!apiKey) {
  console.warn("Gemini API Key is missing. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  stocks: Stock[],
  summary: FinancialSummary
): Promise<string> => {
  if (!apiKey) {
    return "Configuración incompleta: Falta la API Key de Gemini. Por favor configúrala en las variables de entorno.";
  }

  try {
    // Prepare data context for the model
    const recentTransactions = transactions.slice(0, 10);
    const contextData = JSON.stringify({
      summary,
      portfolio: stocks.map(s => ({ symbol: s.symbol, holdings: s.holdings, value: s.price * s.holdings })),
      recentActivity: recentTransactions
    });

    const prompt = `
      Actúa como un asesor financiero experto. Analiza los siguientes datos financieros de un usuario en formato JSON.
      
      Datos: ${contextData}
      
      Proporciona:
      1. Un breve resumen del estado de salud financiera (máximo 2 oraciones).
      2. Tres consejos concretos y accionables para mejorar sus ahorros o inversiones.
      3. Una predicción genérica sobre el portafolio basada en principios de diversificación (sin dar consejo de inversión real).
      
      Usa formato Markdown. Sé conciso, profesional y motivador.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No se pudo generar el consejo en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Hubo un error al conectar con el asistente financiero. Inténtalo más tarde.";
  }
};