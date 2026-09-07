/**
 * Regression guard for sentient/sentient#2612.
 *
 * The canonical MCP registration name is `claude-flow` — this preserves the
 * `mcp__claude-flow__*` prefix that ~166 plugin tool references depend on
 * (#2206). `sentient` is the legacy-duplicate name that pre-rename setup docs
 * (or a manual `claude mcp add sentient`) can create alongside the canonical
 * entry. init/doctor must detect this coexistence so Claude Code does not
 * start two identical Sentient MCP servers and load two identical tool schemas.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import doctorCommand from '../src/commands/doctor.js';

describe('#2612 — sentient MCP rename duplicate detection', () => {
  let home: string;
  let project: string;
  let oldHome: string | undefined;
  let oldUserProfile: string | undefined;
  let oldCwd: string;

  beforeEach(() => {
    home = mkdtempSync(path.join(tmpdir(), 'sentient-2612-home-'));
    project = mkdtempSync(path.join(tmpdir(), 'sentient-2612-project-'));
    oldHome = process.env.HOME;
    oldUserProfile = process.env.USERPROFILE;
    oldCwd = process.cwd();
    process.env.HOME = home;
    delete process.env.USERPROFILE;
    process.chdir(project);
  });

  afterEach(() => {
    process.chdir(oldCwd);
    if (oldHome === undefined) delete process.env.HOME;
    else process.env.HOME = oldHome;
    if (oldUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = oldUserProfile;
    rmSync(home, { recursive: true, force: true });
    rmSync(project, { recursive: true, force: true });
  });

  it('doctor warns when project .mcp.json has claude-flow and ~/.claude.json has sentient', async () => {
    writeFileSync(
      path.join(project, '.mcp.json'),
      JSON.stringify({
        mcpServers: {
          'claude-flow': { command: 'npx', args: ['-y', 'sentient@latest', 'mcp', 'start'] },
        },
      }),
      'utf-8',
    );
    writeFileSync(
      path.join(home, '.claude.json'),
      JSON.stringify({
        projects: {
          [project]: {
            mcpServers: {
              sentient: { command: 'npx', args: ['-y', 'sentient@latest', 'mcp', 'start'] },
            },
          },
        },
      }),
      'utf-8',
    );

    const result = await doctorCommand.action!({
      cwd: project,
      flags: { component: 'mcp', fix: false, install: false },
      args: [],
      interactive: false,
    } as any);

    const checks = (result.data as { results: Array<{ name: string; status: string; message: string }> }).results;
    const mcp = checks.find(check => check.name === 'MCP Servers');
    expect(mcp?.status).toBe('warn');
    expect(mcp?.message).toContain('Duplicate Sentient MCP registrations found');
    expect(mcp?.message).toContain('claude-flow');
    expect(mcp?.message).toContain('sentient');
  });
});
