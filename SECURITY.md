# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by emailing the maintainers directly. Do not create public GitHub issues for security vulnerabilities.

## Handling API Keys and Secrets

### Best Practices

1. **Never commit API keys or secrets to version control**
   - All sensitive credentials should be stored in `.env` files
   - `.env` files must be listed in `.gitignore`
   - Use `.env.example` as a template (without real values)

2. **Rotate keys immediately if exposed**
   - If you accidentally commit an API key, revoke it immediately
   - Generate a new key and update your local `.env` file
   - Remove the key from Git history using `git filter-branch` or `git filter-repo`

3. **Use environment-specific files**
   - `.env.local` for local development
   - `.env.production` for production (never commit these)
   - `.env.example` for documentation (safe to commit)

### Required Environment Variables

This project requires the following environment variables:

- `WP_API_BASE` - WordPress API base URL
- `WP_API_KEY` - WordPress API authentication key
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `GOOGLE_API_KEY` - Google Gemini API key for chat features

See [.env.example](file:///g:/wtx/.env.example) for the template.

### What to Do If You Expose a Key

1. **Immediately revoke the exposed key:**
   - Google Gemini: https://aistudio.google.com/app/apikey
   - OpenAI: https://platform.openai.com/api-keys

2. **Generate a new key** from the same platform

3. **Update your local `.env` file** with the new key

4. **Remove the key from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```

5. **Force push to update remote:**
   ```bash
   git push origin --force --all
   ```

## Dependency Security

- Regularly update dependencies to patch security vulnerabilities
- Run `npm audit` to check for known vulnerabilities
- Use `npm audit fix` to automatically update vulnerable packages

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Security Updates

Security updates will be released as soon as possible after a vulnerability is discovered and verified.
