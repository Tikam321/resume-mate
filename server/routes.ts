import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import * as pdfLib from "pdf-parse";
// Handle CommonJS import compatibility
const pdf = (pdfLib as any).default || pdfLib;

import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// The integration sets these env vars
const genAI = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post(
    api.resume.analyze.path,
    upload.single("resume"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "Resume PDF is required" });
        }
        if (!req.body.job_description) {
          return res
            .status(400)
            .json({ message: "Job Description is required" });
        }

        // Parse PDF
        let resumeText = "";
        try {
          console.log("Processing file buffer size:", req.file.buffer.length);
          const pdfData = await pdf(req.file.buffer);
          resumeText = pdfData.text;
          console.log("Extracted text length:", resumeText.length);

          if (!resumeText || resumeText.trim().length < 5) {
            throw new Error(
              "Extracted text is too short or empty. The PDF might be image-based or protected.",
            );
          }
        } catch (e: any) {
          console.error("PDF parsing error detail:", e);
          return res.status(400).json({
            message: `Failed to parse PDF file: ${e.message || "Unknown error"}. Please ensure it's a text-based (not scanned) PDF.`,
          });
        }

        const jobDescription = req.body.job_description;

        // Call Gemini
        const model = (genAI as any).getGenerativeModel({
          model: "gemini-1.5-flash",
        });

        const prompt = `
        You are an expert ATS and Technical Recruiter.
        Analyze the following Resume against the Job Description.

        Resume Content:
        ${resumeText.slice(0, 15000)}

        Job Description:
        ${jobDescription.slice(0, 5000)}

        Output a JSON object with this structure:
        {
          "match_score": "85%",
          "matching_strengths": ["strength 1", "strength 2"],
          "missing_skills": ["skill 1", "skill 2"],
          "improvement_suggestions": ["suggestion 1", "suggestion 2"],
          "cold_email": "Subject: ... Body: ..."
        }
        Do not include markdown formatting like \`\`\`json. Just the raw JSON.
      `;

        try {
          const result = await model.generateContent(prompt);
          const responseText = result.response.text();

          // Clean cleanup markdown json code block if present
          const jsonStr = responseText.replace(/```json\n?|\n?```/g, "").trim();
          const analysis = JSON.parse(jsonStr);

          res.json(analysis);
        } catch (e) {
          console.error("Gemini API error:", e);
          res.status(500).json({ message: "Failed to generate analysis" });
        }
      } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  );

  return httpServer;
}
