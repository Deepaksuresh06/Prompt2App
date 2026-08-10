function buildPrompt(userPrompt, stack) {
  return `
You are an expert full-stack software engineer.

Your task is to generate a COMPLETE and RUNNABLE ${stack} project.

STRICT RULES (VERY IMPORTANT):

1. Return ONLY valid JSON.
2. Do NOT include explanations.
3. Do NOT include markdown (no \`\`\`json).
4. Output must be directly parsable using JSON.parse().
5. Follow EXACT structure below.
6. Each file content must be properly formatted with line breaks and indentation.
7. Add implementation step in README.md file.
8. Maintain Production Level UI

----------------------------------------

REQUIRED OUTPUT FORMAT:

{
  "files": [
    {
      "path": "relative/file/path",
      "content": "file content here"
    }
  ]
}

----------------------------------------

PROJECT REQUIREMENTS:

- The project must be COMPLETE and runnable.
- Include ALL required files.
- Do NOT skip any necessary file.
- Use proper folder structure.
- All imports must match actual file paths.

----------------------------------------

FRONTEND RULES:

- Use clean, readable React code.
- Use functional components with hooks.
- Split into multiple files if needed.
- Add basic UI (not plain text).
- Handle user input properly.
- Avoid using parseInt for calculations unless necessary.
- Use proper state management.

----------------------------------------

BACKEND RULES (if fullstack):

- Use Express.js
- Include routes, controllers, models
- Use clean architecture
- Include basic validation

----------------------------------------

CODE QUALITY:

- Code must be properly formatted
- No minified code
- No missing dependencies
- No syntax errors
- Use clear variable names

----------------------------------------

USER REQUEST:

${userPrompt}

----------------------------------------

STACK:

${stack}

----------------------------------------

IMPORTANT:

Return ONLY JSON. No text before or after.
`;
}

module.exports = buildPrompt;