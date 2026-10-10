import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowDown,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  Download,
  ExternalLink,
  FileWarning,
  Flag,
  Github,
  Info,
  Landmark,
  Link2,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  RefreshCcw,
  ScanSearch,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { analyzeMessage } from "@/features/scam-analysis/analysis.functions";
import type { RiskLevel, ScamAnalysis } from "@/features/scam-analysis/analysis.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_MESSAGE_LENGTH = 10_000;
const githubUrl: string | undefined = undefined;

const examples = [
  { title: "Fake prize", icon: Sparkles, tone: "example-prize", text: "Congratulations! You have won Rs. 50,000. Click this link immediately and enter your OTP to claim your prize." },
  { title: "Bank warning", icon: Landmark, tone: "example-bank", text: "Your bank account will be blocked today. Verify your account immediately using this link and provide your password." },
  { title: "Job offer", icon: WalletCards, tone: "example-job", text: "Earn Rs. 20,000 daily from home. Pay a registration fee today to secure your guaranteed job." },
  { title: "Normal message", icon: MessageSquareText, tone: "example-ordinary", text: "Hi, our meeting is scheduled for 3 PM tomorrow. Please let me know if you can attend." },
] as const;

const riskStyles: Record<RiskLevel, string> = { low: "risk-low", medium: "risk-medium", high: "risk-high", critical: "risk-critical" };
function riskLabel(risk: RiskLevel) { return risk.charAt(0).toUpperCase() + risk.slice(1); }

function exportReport(message: string, analysis: ScamAnalysis) {
  const report = ["AI ScamShield — Threat assessment", `Risk level: ${riskLabel(analysis.risk_level)}`, `Category: ${analysis.message_category}`, `Confidence: ${analysis.confidence}`, "", "AI summary", analysis.summary, "", "Warning signs", ...analysis.warning_signs.map((sign) => `• ${sign.phrase ? `“${sign.phrase}” — ` : ""}${sign.reason} (${sign.severity})`), "", "Recommended actions", ...analysis.recommended_actions.map((action, index) => `${index + 1}. ${action}`), "", "Safety disclaimer", analysis.limitations, "", "Original message", message].join("\n");
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = "ai-scamshield-report.txt";
  anchor.click();
  URL.revokeObjectURL(href);
}

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AI ScamShield | AI-Powered Scam Message Analyzer" },
    { name: "description", content: "Analyze suspicious messages, understand warning signs, and make safer decisions with AI ScamShield." },
    { property: "og:title", content: "AI ScamShield | AI-Powered Scam Message Analyzer" },
    { property: "og:description", content: "Analyze suspicious messages, understand warning signs, and make safer decisions with AI ScamShield." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

function Index() {
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const trimmedMessage = message.trim();
  const chars = message.length;
  const charWarning = chars > MAX_MESSAGE_LENGTH;
  const resultText = useMemo(() => analysis ? `${riskLabel(analysis.risk_level)} risk. ${analysis.summary}\n\nRecommended actions:\n${analysis.recommended_actions.map((action, index) => `${index + 1}. ${action}`).join("\n")}` : "", [analysis]);

  async function handleAnalyze() {
    setError(""); setAnalysis(null);
    if (!trimmedMessage) { setError("Paste a message before requesting an analysis."); return; }
    if (charWarning) { setError("Messages can contain up to 10,000 characters."); return; }
    setIsAnalyzing(true);
    try { const response = await analyzeMessage({ data: { message: trimmedMessage } }); setAnalysis(response); window.setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "The analysis could not be completed. Please try again."); }
    finally { setIsAnalyzing(false); }
  }
  async function copyAnalysis() { if (!resultText) return; await navigator.clipboard.writeText(resultText); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  function reset() { setMessage(""); setAnalysis(null); setError(""); }
  function chooseExample(text: string) { setMessage(text); setError(""); setAnalysis(null); document.getElementById("analyzer-heading")?.scrollIntoView({ behavior: "smooth", block: "center" }); }

  return <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <nav className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="page-shell grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:justify-between">
        <a href="#top" className="flex min-w-0 items-center gap-2 font-semibold"><span className="brand-mark shrink-0"><Shield size={18} /></span><span className="truncate">AI ScamShield</span></a>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"><a href="#top" className="nav-link">Home</a><a href="#how-it-works" className="nav-link">How it works</a><a href="#safety" className="nav-link">Safety tips</a></div>
        {githubUrl ? <Button asChild variant="outline" size="sm" className="github-button"><a href={githubUrl} target="_blank" rel="noreferrer"><Github /> <span className="hidden sm:inline">GitHub</span></a></Button> : <Badge variant="outline" className="nav-status"><ShieldCheck size={14} /> Digital safety</Badge>}
      </div>
    </nav>

    <section id="top" className="hero-section relative border-b border-border/60">
      <div className="hero-grid" aria-hidden="true" />
      <div className="page-shell relative py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_250px] lg:gap-14">
          <div className="text-center lg:text-left">
            <div className="eyebrow mx-auto lg:mx-0"><Shield size={15} /> Open-weight AI <span>•</span> Digital safety</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">Is This Message a Scam?</h1>
            <p className="mt-3 text-xl font-medium text-primary sm:text-2xl">Think Before You Click.</p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">Analyze suspicious messages with AI, understand the warning signs, and make safer decisions before clicking, replying, or sharing sensitive information.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground lg:justify-start"><span className="trust-line"><BadgeCheck /> AI-powered analysis</span><span className="trust-line"><BadgeCheck /> No account required</span><span className="trust-line"><BadgeCheck /> Messages not saved</span></div>
          </div>
          <div className="shield-visual mx-auto" aria-label="Security shield active"><div className="shield-rings" /><div className="shield-core"><ShieldCheck size={62} strokeWidth={1.35} /><span>PROTECTED</span></div><div className="shield-ping ping-one" /><div className="shield-ping ping-two" /></div>
        </div>

        <section aria-labelledby="analyzer-heading" className="analyzer-panel mx-auto mt-12 max-w-5xl">
          <div className="analyzer-topline" />
          <div className="grid gap-4 border-b border-border p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-7">
            <div className="min-w-0"><div className="section-kicker">P A S T E &nbsp; S U S P I C I O U S &nbsp; M E S S A G E</div><h2 id="analyzer-heading" className="mt-2 text-xl font-semibold">Message analyzer</h2></div>
            <div className="secure-note shrink-0"><LockKeyhole size={15} /> Analyzed only when you request it</div>
          </div>
          <div className="p-5 sm:p-7">
            <Textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={MAX_MESSAGE_LENGTH + 1} aria-invalid={Boolean(error || charWarning)} placeholder="Paste a suspicious message here. Example: Congratulations! You've won Rs. 50,000. Click the link now and enter your OTP to claim your prize." className="analyzer-input" />
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs text-muted-foreground"><span className={charWarning ? "text-destructive" : ""}>{chars.toLocaleString()} / {MAX_MESSAGE_LENGTH.toLocaleString()} characters</span><Button variant="ghost" size="sm" type="button" onClick={() => { setMessage(""); setError(""); }} className="clear-button"><X size={14} /> Clear</Button></div>
            {error && <div role="alert" className="error-notice"><AlertTriangle size={17} /> {error}</div>}
            <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><p className="privacy-note"><Info size={14} /> We don’t save messages. Live analysis securely sends text to Lovable AI only when requested.</p><Button size="lg" onClick={handleAnalyze} disabled={isAnalyzing} className="analyze-button">{isAnalyzing ? <LoaderCircle className="animate-spin" /> : <ScanSearch />} {isAnalyzing ? "Analyzing…" : "Analyze message"}<ChevronRight /></Button></div>
          </div>
        </section>
      </div>
    </section>

    <section className="examples-section py-12"><div className="page-shell"><div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"><div><div className="section-kicker">Fictional test messages</div><h2 className="mt-1 text-2xl font-semibold">Try an example safely</h2></div><p className="text-sm text-muted-foreground">For quick, fictional testing only</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{examples.map((example) => { const Icon = example.icon; return <button type="button" key={example.title} className="example-card" onClick={() => chooseExample(example.text)}><span className={`example-icon ${example.tone}`}><Icon size={17} /></span><span className="min-w-0"><span className="block font-medium text-foreground">{example.title}</span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted-foreground">{example.text}</span></span><ChevronRight className="example-arrow" size={15} /></button>; })}</div></div></section>

    {isAnalyzing && <section className="page-shell py-12"><div className="loading-panel"><span className="loading-shield"><ScanSearch /></span><div><div className="section-kicker">Live scan in progress</div><h2 className="mt-1 text-lg font-semibold">Looking for warning signs</h2><p className="mt-1 text-sm text-muted-foreground">Checking urgency, credential requests, payment pressure, and suspicious links.</p></div></div></section>}

    {analysis && <section id="results" className="page-shell scroll-mt-24 py-14"><div className="result-heading"><div><div className="section-kicker">Threat assessment</div><h2 className="mt-1 text-3xl font-semibold">Security report</h2></div><div className="flex shrink-0 gap-2"><Button variant="outline" size="sm" onClick={copyAnalysis}>{copied ? <CheckCircle2 /> : <Copy />} <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span></Button><Button variant="outline" size="sm" onClick={() => exportReport(trimmedMessage, analysis)}><Download /> <span className="hidden sm:inline">Download</span></Button></div></div>
      <div className="result-summary mt-6"><div className="p-6 sm:p-8"><div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center"><div className={`risk-orb ${riskStyles[analysis.risk_level]}`}><ShieldAlert size={26} /><span>{riskLabel(analysis.risk_level)}</span><small>risk</small></div><div className="min-w-0"><div className="section-kicker">Scam category</div><h3 className="mt-1 text-xl font-semibold">{analysis.message_category}</h3><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">{analysis.summary}</p></div><div className="confidence-chip"><span>Confidence</span><strong>{analysis.confidence}</strong></div></div></div><div className="result-disclaimer"><AlertTriangle size={16} /> Risk is a qualitative assessment, not a probability or a guarantee.</div></div>
      <div className="mt-7 grid gap-7 lg:grid-cols-[1.25fr_.75fr]"><div className="space-y-7"><section><h3 className="result-title"><FileWarning /> Warning signs</h3><div className="mt-4 grid gap-3">{analysis.warning_signs.length ? analysis.warning_signs.map((sign, index) => <article key={`${sign.phrase}-${index}`} className="signal-card"><div className="signal-icon"><AlertTriangle size={17} /></div><div className="min-w-0 flex-1">{sign.phrase && <p className="signal-phrase">“{sign.phrase}”</p>}<p className="mt-2 text-sm leading-6 text-muted-foreground">{sign.reason}</p></div><Badge className={`severity-badge severity-${sign.severity}`}>{sign.severity}</Badge></article>) : <div className="empty-result"><CheckCircle2 /> No specific warning phrases were identified.</div>}</div></section><section><h3 className="result-title"><CheckCircle2 /> Positive signs</h3><div className="mt-4 positive-list">{analysis.positive_signs.length ? analysis.positive_signs.map((sign) => <p key={sign}><CheckCircle2 /> {sign}</p>) : <p><Info /> No strong reassuring evidence was identified.</p>}</div></section></div>
        <aside className="space-y-7"><section className="action-panel"><h3 className="result-title"><ClipboardCheck /> Recommended actions</h3><ol className="mt-5 space-y-4">{analysis.recommended_actions.map((action, index) => <li key={action}><span>{index + 1}</span><p>{action}</p></li>)}</ol></section><section><h3 className="result-title"><Shield /> Security indicators</h3><div className="mt-4 grid gap-2">{[["Urgency detected", analysis.urgency_detected, AlertTriangle], ["Credential request", analysis.credential_request_detected, LockKeyhole], ["Financial request", analysis.financial_request_detected, WalletCards], ["Suspicious link mentioned", analysis.suspicious_link_detected, Link2]].map(([label, active, Icon]) => { const StatusIcon = Icon as typeof AlertTriangle; return <div className={`indicator ${active ? "indicator-active" : ""}`} key={label as string}><StatusIcon size={16} /><span>{label as string}</span><Badge variant="outline" className="ml-auto">{active ? "Detected" : "Clear"}</Badge></div>; })}</div></section><div className="limitations"><Info size={16} /><p>{analysis.limitations}</p></div></aside></div>
      <div className="mt-8 flex justify-center"><Button variant="outline" onClick={reset}><RefreshCcw /> Analyze another message</Button></div>
    </section>}

    <section id="how-it-works" className="process-section border-y border-border py-16"><div className="page-shell"><div className="max-w-xl"><div className="section-kicker">How it works</div><h2 className="mt-2 text-3xl font-semibold">A clearer path to safer decisions.</h2></div><div className="mt-9 grid gap-5 md:grid-cols-3">{[{ number: "01", title: "Paste", copy: "Paste the suspicious message without opening its links or attachments.", icon: MessageSquareText }, { number: "02", title: "Analyze", copy: "AI examines the message for potential scam indicators.", icon: ScanSearch }, { number: "03", title: "Protect", copy: "Understand the warning signs and take safer action.", icon: ShieldCheck }].map(({ number, title, copy, icon: StepIcon }) => <div className="step-block" key={number}><div className="step-head"><span>{number}</span><StepIcon size={20} /></div><h3>{title}</h3><p>{copy}</p></div>)}</div></div></section>
    <section id="safety" className="page-shell py-16"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><div className="section-kicker">Safety tips</div><h2 className="mt-2 text-3xl font-semibold">Stay alert. Stay in control.</h2><p className="mt-4 leading-7 text-muted-foreground">When a message creates pressure, pause before you click, reply, pay, or share personal details.</p></div><div className="grid gap-3 sm:grid-cols-2">{[["Never share OTPs or passwords.", LockKeyhole], ["Verify requests through official channels.", BadgeCheck], ["Be careful with unexpected links.", Link2], ["Question urgency and threats.", AlertTriangle], ["Never pay unexpected fees for prizes or jobs.", Send]].map(([tip, Icon]) => { const TipIcon = Icon as typeof Shield; return <div className="tip-card" key={tip as string}><TipIcon size={19} /><p>{tip as string}</p></div>; })}</div></div></section>
    <footer className="border-t border-border bg-muted/25"><div className="page-shell grid gap-8 py-10 md:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2 font-semibold"><span className="brand-mark"><Shield size={17} /></span> AI ScamShield</div><p className="mt-3 text-sm font-medium text-primary">Think Before You Click.</p><p className="mt-2 text-sm text-muted-foreground">Built for Hacktoberfest Islamabad 2026 · Community &amp; Social Good · Open source</p></div><div className="max-w-xl text-sm leading-6 text-muted-foreground"><p>AI ScamShield provides automated guidance, not a definitive fraud determination. AI can make mistakes. A low-risk result does not guarantee that a message is safe. For important financial or security decisions, verify information through official channels.</p>{githubUrl ? <a href={githubUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-foreground hover:text-primary">GitHub repository <ExternalLink size={14} /></a> : <p className="mt-3 inline-flex items-center gap-1"><Github size={14} /> GitHub link available when the repository is connected.</p>}</div></div></footer>
  </main>;
}
