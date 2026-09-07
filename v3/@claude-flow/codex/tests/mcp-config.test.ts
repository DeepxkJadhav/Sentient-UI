import { describe, expect, it } from 'vitest';
import {
  getSentientMcpAddCommand,
  getCodexCliInvocation,
  getSentientMcpServerConfig,
  hasExpectedSentientMcpTimeout,
  hasExpectedSentientMcpTransport,
  renderMcpServerToml,
  upsertMcpServerStartupTimeout,
} from '../src/mcp-config.js';

describe('Sentient Codex MCP configuration', () => {
  it('uses cmd /c to resolve npx on Windows', () => {
    expect(getSentientMcpServerConfig('win32')).toMatchObject({
      command: 'cmd',
      args: ['/c', 'npx', '-y', 'sentient@latest', 'mcp', 'start'],
      startupTimeout: 120,
    });
    expect(getSentientMcpAddCommand('win32')).toBe(
      'codex mcp add sentient -- cmd /c npx -y sentient@latest mcp start',
    );
  });

  it('uses npx directly on POSIX systems', () => {
    expect(getSentientMcpServerConfig('linux')).toMatchObject({
      command: 'npx',
      args: ['-y', 'sentient@latest', 'mcp', 'start'],
      startupTimeout: 120,
    });
  });

  it('launches npm Codex shims through cmd.exe on Windows', () => {
    expect(getCodexCliInvocation(
      'C:\\Users\\dev\\AppData\\Roaming\\npm\\codex\r\nC:\\Users\\dev\\AppData\\Roaming\\npm\\codex.cmd\r\n',
      'win32',
      'C:\\Windows\\System32\\cmd.exe',
    )).toEqual({
      command: 'C:\\Windows\\System32\\cmd.exe',
      prefixArgs: ['/d', '/s', '/c', 'codex'],
    });
  });

  it('prefers a native Codex executable on Windows', () => {
    expect(getCodexCliInvocation(
      'C:\\Tools\\codex.exe\r\nC:\\Users\\dev\\npm\\codex.cmd\r\n',
      'win32',
    )).toEqual({ command: 'C:\\Tools\\codex.exe', prefixArgs: [] });
  });

  it('renders both startup and tool timeouts', () => {
    const toml = renderMcpServerToml(getSentientMcpServerConfig('win32', 300)).join('\n');
    expect(toml).toContain('command = "cmd"');
    expect(toml).toContain('startup_timeout_sec = 120');
    expect(toml).toContain('tool_timeout_sec = 300');
  });

  it('detects stale and current Codex registrations', () => {
    const current = {
      name: 'sentient',
      transport: {
        type: 'stdio',
        command: 'cmd',
        args: ['/c', 'npx', '-y', 'sentient@latest', 'mcp', 'start'],
      },
      startup_timeout_sec: 120,
    };
    expect(hasExpectedSentientMcpTransport(current, 'win32')).toBe(true);
    expect(hasExpectedSentientMcpTimeout(current)).toBe(true);
    expect(hasExpectedSentientMcpTransport({
      ...current,
      transport: { type: 'stdio', command: 'npx', args: ['sentient', 'mcp', 'start'] },
    }, 'win32')).toBe(false);
  });

  it('updates only the Sentient timeout while preserving the rest of config.toml', () => {
    const source = [
      '# user comment',
      '[mcp_servers.sentient]',
      'command = "cmd"',
      'startup_timeout_sec = 30',
      '',
      '[mcp_servers.other]',
      'command = "node"',
      'startup_timeout_sec = 45',
      '',
    ].join('\r\n');

    const updated = upsertMcpServerStartupTimeout(source);
    expect(updated).toContain('# user comment\r\n');
    expect(updated).toContain('[mcp_servers.sentient]\r\ncommand = "cmd"\r\nstartup_timeout_sec = 120');
    expect(updated).toContain('[mcp_servers.other]\r\ncommand = "node"\r\nstartup_timeout_sec = 45');
  });

  it('inserts a missing timeout before the next TOML table', () => {
    const source = '[mcp_servers.sentient]\ncommand = "npx"\n\n[history]\npersistence = "save-all"\n';
    expect(upsertMcpServerStartupTimeout(source)).toBe(
      '[mcp_servers.sentient]\ncommand = "npx"\n\nstartup_timeout_sec = 120\n[history]\npersistence = "save-all"\n',
    );
  });

  it('preserves a user timeout that is already above the minimum', () => {
    const source = '[mcp_servers.sentient]\ncommand = "npx"\nstartup_timeout_sec = 300 # slow cold start\n';
    expect(upsertMcpServerStartupTimeout(source)).toBe(source);
  });

  it('raises a low timeout without deleting its inline comment', () => {
    const source = '[mcp_servers.sentient]\ncommand = "npx"\n  startup_timeout_sec = 30 # user note\n';
    expect(upsertMcpServerStartupTimeout(source)).toContain(
      '  startup_timeout_sec = 120 # user note',
    );
  });
});
