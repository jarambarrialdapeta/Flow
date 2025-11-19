import { GoogleGenAI } from "@google/genai";
import { Transaction, Stock, FinancialSummary } from "../types";

// Fix: Use process.env.API_KEY directly as per strict guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  stocks: Stock[],
  summary: FinancialSummary
): Promise<string> => {
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