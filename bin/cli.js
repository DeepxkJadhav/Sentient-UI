#!/usr/bin/env node
/**
 * Sentient CLI - Umbrella entry point
 * Proxies to @claude-flow/cli bin for cross-platform compatibility.
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sentientCliPath = join(__dirname, 'sentient.js');
await import(pathToFileURL(sentientCliPath).href);
