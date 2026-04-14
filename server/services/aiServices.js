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
    // Extract AI content
    const content = data.choices?.[0]?.message?.content;
    if (!content)  {
      throw new Error('Invalid AI response');
    }

    //CLEAN RESPONSE
    const cleaned = content.replace(/```json|```/g, '').trim();
    //PARSE
    const parsed = JSON.parse(cleaned);
    return parsed;
  } 
  catch (error) {
    throw new Error(`AI Service Error: ${error.message}`);
  }
}

module.exports = generateCodeWithAI;