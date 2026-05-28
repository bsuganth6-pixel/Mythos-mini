export const TOOLS = [
  {
    id: "review",
    label: "Code Review",
    color: "#ff6b35",
    glow: "#ff6b3544",
    emoji: "🛡",
    short: "Vulnerability Scanner",
    desc: "Paste any code → full vulnerability report with severity ratings & concrete fixes",
    placeholder: "Paste your code here for vulnerability scanning...\n\ne.g. a PHP login form, Python API endpoint, Node.js handler, or C++ function",
    category: "security",
  },
  {
    id: "ctf",
    label: "CTF Trainer",
    color: "#00d4ff",
    glow: "#00d4ff44",
    emoji: "🚩",
    short: "Challenge Coach",
    desc: "Describe a CTF challenge → progressive hints, technique explanation & walkthrough",
    placeholder: "Describe your CTF challenge...\n\ne.g. 'Web challenge with a login form. Hint says: think about what the server trusts'",
    category: "security",
  },
  {
    id: "static",
    label: "Static Analysis",
    color: "#a855f7",
    glow: "#a855f744",
    emoji: "🔬",
    short: "Deep Code Analysis",
    desc: "Submit code → static analysis, dangerous patterns, code smells & quality score /10",
    placeholder: "Paste your code for static analysis...\n\ne.g. a Node.js module, Python class, or C++ function",
    category: "security",
  },
  {
    id: "cve",
    label: "CVE Intel",
    color: "#22c55e",
    glow: "#22c55e44",
    emoji: "📡",
    short: "Threat Intelligence",
    desc: "Enter a CVE ID or product name → threat intel, affected versions & patch urgency",
    placeholder: "Enter CVE ID or product name...\n\ne.g. 'CVE-2021-44228' or 'Log4j remote code execution'",
    category: "security",
  },
  {
    id: "malware",
    label: "Malware Analyzer",
    color: "#ef4444",
    glow: "#ef444444",
    emoji: "☣",
    short: "Malware Detection",
    desc: "Paste suspicious code or script → identify malware patterns, IOCs & behavior analysis",
    placeholder: "Paste suspicious code, script, or describe malware behavior...\n\ne.g. a suspicious PowerShell script, obfuscated JavaScript, or unusual system behavior",
    category: "security",
  },
  {
    id: "password",
    label: "Password Checker",
    color: "#f97316",
    glow: "#f9731644",
    emoji: "🔑",
    short: "Password Strength",
    desc: "Enter a password or policy → get strength analysis, crack time estimate & improvements",
    placeholder: "Enter a password to analyze or describe your password policy...\n\ne.g. 'MyP@ssw0rd123' or 'minimum 8 chars, one uppercase, one number'",
    category: "security",
  },
  {
    id: "network",
    label: "Network Inspector",
    color: "#06b6d4",
    glow: "#06b6d444",
    emoji: "🌐",
    short: "Network Analysis",
    desc: "Paste network logs, packets, or config → identify threats, misconfigs & attack patterns",
    placeholder: "Paste network logs, packet data, or firewall rules...\n\ne.g. suspicious network traffic, nmap output, firewall config, or Wireshark data",
    category: "security",
  },
  {
    id: "regex",
    label: "Regex Generator",
    color: "#8b5cf6",
    glow: "#8b5cf644",
    emoji: "⚡",
    short: "Pattern Generator",
    desc: "Describe what you want to match → get optimized regex with explanation & test cases",
    placeholder: "Describe the pattern you want to match...\n\ne.g. 'Match valid email addresses' or 'Extract all IP addresses from logs' or 'Validate Indian phone numbers'",
    category: "dev",
  },
  {
    id: "agent",
    label: "AI Agent",
    color: "#f59e0b",
    glow: "#f59e0b44",
    emoji: "✦",
    short: "General Purpose AI",
    desc: "Ask anything — coding help, research, writing, automation scripts, math & analysis",
    placeholder: "Ask me anything...\n\ne.g. 'Write a Python script to parse JSON logs and detect anomalies'",
    category: "dev",
  },
];

export const SYSTEMS = {
  review: `You are an expert security code reviewer. Analyze for: SQL injection, XSS, CSRF, buffer overflows, command injection, insecure deserialization, broken auth, path traversal, hardcoded secrets, insecure crypto.

Format EXACTLY:
SEVERITY RATING
[CRITICAL|HIGH|MEDIUM|LOW|CLEAN]

VULNERABILITIES FOUND
1. NAME
   Why dangerous: explanation
   Location: line/function
   Fix: concrete code fix

SUMMARY
[Assessment and top priority action]`,

  ctf: `You are an elite CTF coach expert in web, binary, crypto, forensics, OSINT.

Format:
CHALLENGE CATEGORY
[Category and technique]

PROGRESSIVE HINTS
Hint 1: subtle nudge
Hint 2: specific direction
Hint 3: near-direct approach

CONCEPT EXPLAINED
[Why this works]

USEFUL TOOLS
[tool]: [command]

WALKTHROUGH
[Step by step if needed]`,

  static: `You are an advanced static analysis engine. Check for: dangerous functions (eval/exec/system), missing input validation, poor error handling, dead code, insecure crypto, memory leaks, anti-patterns.

Format:
SECURITY FINDINGS
[CRITICAL/HIGH/MEDIUM/LOW/INFO] - description + fix

CODE QUALITY
Issues with explanations

RECOMMENDATIONS
Top 3 priority changes with code examples

QUALITY SCORE
[X/10] with justification`,

  cve: `You are a senior threat intelligence analyst.

Format:
VULNERABILITY OVERVIEW
[Plain English explanation]

TECHNICAL DETAILS
- Attack Vector: 
- Complexity:
- CVSS Score:
- Affected Versions:

EXPLOITATION IN THE WILD
[Known exploits and campaigns]

MITIGATION
- Patch: [version]
- Workaround: [if no patch]
- Detection: [how to detect]

PATCH URGENCY
[PATCH NOW|PATCH SOON|MONITOR|LOW RISK]`,

  malware: `You are an expert malware analyst and reverse engineer. Analyze suspicious code or scripts.

Format:
THREAT ASSESSMENT
[MALICIOUS|SUSPICIOUS|LIKELY BENIGN|CLEAN]

MALWARE TYPE
[Trojan/Ransomware/Spyware/Adware/Worm/RAT/Dropper/Other]

INDICATORS OF COMPROMISE (IOCs)
- Suspicious strings/URLs/IPs found
- Obfuscation techniques used
- Persistence mechanisms
- C2 communication patterns

BEHAVIOR ANALYSIS
[What this code does step by step]

MITIGATION
- Immediate actions to take
- Detection signatures
- Cleanup steps`,

  password: `You are a password security expert and cryptographer.

Analyze the given password or policy and provide:

STRENGTH RATING
[VERY WEAK|WEAK|MODERATE|STRONG|VERY STRONG]

STRENGTH SCORE
[X/100]

ANALYSIS
- Length: assessment
- Complexity: uppercase/lowercase/numbers/symbols
- Common patterns: dictionary words, sequences, dates
- Estimated crack time: [with modern hardware]

VULNERABILITIES
[Specific weaknesses found]

IMPROVED VERSIONS
[3 stronger alternatives maintaining memorability]

BEST PRACTICES
[Specific recommendations for this use case]`,

  network: `You are a network security expert and packet analyzer.

Analyze the provided network data, logs, or configuration:

THREAT LEVEL
[CRITICAL|HIGH|MEDIUM|LOW|CLEAN]

FINDINGS
[Numbered list of issues found]

ATTACK PATTERNS DETECTED
[Known attack signatures or suspicious patterns]

MISCONFIGURATIONS
[Security misconfigs found]

RECOMMENDATIONS
[Specific fixes with commands/config examples]

MONITORING RULES
[IDS/firewall rules to detect this in future]`,

  regex: `You are a regex expert who writes efficient, well-tested patterns.

For the given requirement, provide:

REGEX PATTERN
[The complete pattern]

LANGUAGE VERSIONS
- JavaScript: /pattern/flags
- Python: r'pattern'
- Java: "pattern"
- PHP: '/pattern/'

EXPLANATION
[Break down each part of the pattern]

TEST CASES
MATCHES (should match):
- example1
- example2

NON-MATCHES (should not match):
- example1
- example2

EDGE CASES
[Important edge cases to consider]

OPTIMIZED VERSION
[More efficient version if applicable]`,

  agent: `You are an elite AI assistant - highly capable, direct, and immediately useful. You excel at coding in any language, research, writing, debugging, automation, and problem solving. Always provide working complete code with explanations. Be direct and comprehensive.`,
};
