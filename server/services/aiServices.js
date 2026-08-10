const buildPrompt = require('./promptBuilder');

async function generateCodeWithAI(userPrompt, stack) {
  try {
    const prompt = buildPrompt(userPrompt, stack);

    const response = await fetch(process.env.AI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    // Debug full provider response
    console.log("FULL AI RESPONSE:", JSON.stringify(data, null, 2));

    // Check provider-level failure
    if (!response.ok) {
      throw new Error(data.error?.message || 'AI provider request failed');
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI response content is missing');
    }

    console.log("RAW AI CONTENT:", content);

    // Remove markdown wrappers if present
    const cleaned = content.replace(/```json|```/g, '').trim();

    console.log("CLEANED AI CONTENT:", cleaned);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      throw new Error(`JSON parse failed: ${parseError.message}`);
    }

    // Optional structure validation
    if (!parsed.files || !Array.isArray(parsed.files)) {
      throw new Error('Parsed AI response does not contain a valid files array');
    }

    return parsed;

  } catch (error) {
    throw new Error(`AI Service Error: ${error.message}`);
  }
}

module.exports = generateCodeWithAI;