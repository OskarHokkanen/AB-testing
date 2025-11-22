import OpenAI from "openai";
import { DesignChoice, MetricsResult } from "./metrics";

const client = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReport(
  designChoices: DesignChoice[],
  metrics: MetricsResult,
): Promise<string> {
  const prompt = `You are an expert in UX design and A/B testing for e-commerce websites. A computer science student has made the following design changes to a simulated shopping website as part of an educational exercise on A/B testing.

## Design Choices Made:

${designChoices
  .map(
    (choice, i) => `
### Change ${i + 1}:
- **Element:** ${choice.object}
- **Action:** ${choice.action}
- **New Value:** ${choice.value}
- **Student's Reasoning:** ${choice.reasoning || "No reasoning provided"}
`,
  )
  .join("\n")}

## Resulting Metrics (simulated):

- **Conversion Rate:** ${metrics.conversionRate}% (baseline: 2.5%)
- **Bounce Rate:** ${metrics.bounceRate}% (baseline: 45%) - lower is better
- **Click-Through Rate:** ${metrics.clickThroughRate}% (baseline: 3.5%)
- **Average Time on Page:** ${metrics.avgTimeOnPage} seconds (baseline: 120s)
- **Cart Abandonment Rate:** ${metrics.cartAbandonmentRate}% (baseline: 70%) - lower is better

## Your Task:

Generate an educational report analyzing the student's design choices. The report should:

1. **Summary**: Provide a brief overview of the overall effectiveness of the changes
2. **Analysis of Each Change**: For each design choice:
   - Evaluate whether the choice was effective based on the metrics
   - Explain the UX principles that make this choice good or bad
   - Comment on the student's reasoning - was their hypothesis correct?
3. **Metric Breakdown**: Explain how the changes affected each metric and why
4. **Recommendations**: Suggest 2-3 improvements or alternative approaches they could test
5. **A/B Testing Principles**: Include a brief section on what the student can learn about A/B testing from this exercise

Keep the tone educational and encouraging. Use markdown formatting for readability. Be specific about UX principles and cite them where relevant (e.g., Fitts's Law, visual hierarchy, color psychology, etc.).`;

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
