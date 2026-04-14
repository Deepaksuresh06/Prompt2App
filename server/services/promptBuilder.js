function buildPrompt(userPrompt, stack) {
    return `
        You are a senior full-stack software engineer.

        Generate a complete, production-ready project based on the following requirements.

        User Requirements:
        ${userPrompt}

        Tech Stack:
        ${stack}

        Strict Rules:
        - Generate full folder structure
        - Include backend, frontend, configs
        - Provide package.json for all services
        - Include environment variable examples
        - Use best practices and modular architecture
        - Do not include explanations outside code

        Output Format:
        Return ONLY valid JSON in the following schema:

        {
        "projectName": "string",
        "files": [
            {
            "path": "relative/path/to/file",
            "content": "file content here"
            }
        ]
        }`
    ;
}

module.exports = buildPrompt;