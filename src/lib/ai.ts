import OpenAI from "openai";
import { DesignChoice, MetricsResult } from "./metrics";
import fs from "fs";
import path from "path";

// Validate API key at startup
if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY environment variable is not set");
}

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReport(
  designChoices: DesignChoice[],
  metrics: MetricsResult,
): Promise<string> {
  const defaultPrompt = `You are an expert in UX design and A/B testing for e-commerce websites. A computer science student has made the following design changes to a simulated shopping website as part of an educational exercise.

## Design Choices Made:
{{DESIGN_CHOICES}}

## Resulting Metrics (simulated):

- **Conversion Rate:** {{CONVERSION_RATE}}% (baseline: 2.5%)
- **Bounce Rate:** {{BOUNCE_RATE}}% (baseline: 45%) — lower is better
- **Click-Through Rate:** {{CLICK_THROUGH_RATE}}% (baseline: 3.5%)
- **Average Time on Page:** {{AVG_TIME_ON_PAGE}} seconds (baseline: 120s)
- **Cart Abandonment Rate:** {{CART_ABANDONMENT_RATE}}% (baseline: 70%) — lower is better

## Your Task

Generate a clear, student-focused report analyzing these design choices. Your report should include:

1. **Summary:** A brief overview of how effective the design changes were.

2. **Analysis of Each Change:**
   - Evaluate each choice using the provided metrics.
   - Explain the UX principles that relate to the choice (e.g., Fitts’s Law, visual hierarchy).
   - Comment on whether the student’s hypothesis was supported by the results.

3. **Metric Breakdown:** Describe how each metric was influenced and why.

4. **Recommendations:** Provide *only 2–3 concise suggestions* they might explore next.

5. **A/B Testing Takeaways:** Give a short explanation of what the student can learn about A/B testing from this experiment.

Keep the tone supportive and educational, and use markdown formatting for readability.
`;

  let promptTemplate = defaultPrompt;

  const designChoicesText = designChoices
    .map(
      (choice, i) => `
### Change ${i + 1}:
- **Element:** ${choice.object}
- **Action:** ${choice.action}
- **New Value:** ${choice.value}
- **Student's Reasoning:** ${choice.reasoning || "No reasoning provided"}
`,
    )
    .join("\n");

  const prompt = promptTemplate
    .replace("{{DESIGN_CHOICES}}", designChoicesText)
    .replace("{{CONVERSION_RATE}}", metrics.conversionRate.toString())
    .replace("{{BOUNCE_RATE}}", metrics.bounceRate.toString())
    .replace("{{CLICK_THROUGH_RATE}}", metrics.clickThroughRate.toString())
    .replace("{{AVG_TIME_ON_PAGE}}", metrics.avgTimeOnPage.toString())
    .replace(
      "{{CART_ABANDONMENT_RATE}}",
      metrics.cartAbandonmentRate.toString(),
    );

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-5-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    return (
      completion.choices[0].message.content ||
      "Unable to generate report. Please try again."
    );
  } catch (error) {
    console.error("Error generating AI report:", error);
    throw new Error("Failed to generate AI report");
  }
}
