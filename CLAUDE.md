# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a VS Code extension called "Context Reminder" that warns users when their prompt/document reaches a configurable token limit for Claude or GPT models. It helps prevent hitting context limits when working with AI assistants.

## Commands

### Build/Compile
- `npm run compile` - Compile TypeScript to JavaScript (outputs to `out/` directory)
- `npm run watch` - Watch mode compilation for development
- `npm run vscode:prepublish` - Prepare for publishing (runs compile)

### Development
- Use `npm run watch` during development to auto-compile changes
- The extension entry point is `out/extension.js` (compiled from `src/extension.ts`)

## Architecture

### Core Components

**Extension Entry Point (`src/extension.ts`)**:
- `activate()`: Sets up configuration monitoring and document change listeners
- `checkDocumentTokens()`: Core function that counts tokens and shows warnings
- Uses `gpt-tokenizer` library for token counting with model-specific configurations

**Configuration System**:
- `contextReminder.model`: "claude" or "gpt" (default: "claude")
- `contextReminder.tokenLimit`: Number threshold for warnings (default: 2000)
- Real-time configuration updates via `onDidChangeConfiguration`

**Token Monitoring**:
- Monitors active document changes via `onDidChangeTextDocument`
- Counts tokens using gpt-tokenizer with model-specific settings
- Shows warning message when token limit exceeded

### Key Dependencies
- `gpt-tokenizer`: For counting tokens with different model configurations
- `@types/vscode`: TypeScript definitions for VS Code API

### Build Configuration
- TypeScript compilation from `src/` to `out/`
- Target: ES2020, CommonJS modules
- Strict TypeScript settings enabled