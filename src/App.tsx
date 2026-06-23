import React, { useState, useEffect } from "react";
import { Scene, DominatorPack, TerminalLog } from "./types";
import { 
  Sparkles, Smartphone, Award, Terminal, Copy, Shield, RefreshCw, 
  Settings, Check, LayoutGrid, AlertTriangle, MonitorPlay, HelpCircle, 
  ExternalLink, TrendingUp, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AndroidSimulator from "./components/AndroidSimulator";

export default function App() {
  // Input parameters
  const [niche, setNiche] = useState("شريط سينمائي لشركات العقارات والمقاولات في الخليج بواسطة الذكاء الاصطناعي");
  const [mode, setMode] = useState<"REELS_ENGINE" | "VIRAL_ATTACK">("REELS_ENGINE");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [tone, setTone] = useState("authority");
  const [includeVisual, setIncludeVisual] = useState(true);

  // Application states
  const [isLoading, setIsLoading] = useState(false);
  const [currentPack, setCurrentPack] = useState<DominatorPack | null>(null);
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isMobileOnly, setIsMobileOnly] = useState(false);

  // Initialize terminal on setup
  useEffect(() => {
    addLog("دخول لوحة تحكم الخادم المركزي... نظام Dominator V3 جاهز ومستقر.", "info");
    addLog("الذكاء الاصطناعي نشط: طراز Gemini 3.5 Flash متصل.", "success");
    addLog("مصفوفة توليد الرسوم التخييلية: Imagen 3 / Flux Engine جاهز للعمل.", "info");
  }, []);

  const addLog = (text: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const timestamp = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    const newLog: TerminalLog = {
      id: Math.random().toString(),
      text,
      type,
      timestamp
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleSynthesize = async (params?: {
    niche: string;
    mode: "REELS_ENGINE" | "VIRAL_ATTACK";
    language: "ar" | "en";
    tone: string;
    includeVisual: boolean;
  }) => {
    // Collect parameters (called either from desktop form or phone simulator)
    const activeNiche = params ? params.niche : niche;
    const activeMode = params ? params.mode : mode;
    const activeLang = params ? params.language : language;
    const activeTone = params ? params.tone : tone;
    const activeIncludeVisual = params ? params.includeVisual : includeVisual;

    if (!activeNiche.trim()) {
      addLog("خطأ: يرجى كتابة النيش أولاً قبل إرسال أمر التخليق النيوروني.", "error");
      return;
    }

    setIsLoading(true);
    setCurrentPack(null);
    addLog(`إرسال بروتوكول التخليق للموضوع: "${activeNiche}"...`, "info");
    addLog(`الصيغة المحددة: ${activeMode === "REELS_ENGINE" ? "TikTok/Reels Storyboard" : "Standard 16:9 Feed Post"}`, "info");
    addLog(`النبرة الجينية: ${activeTone.toUpperCase()} | لغة الإخراج: ${activeLang.toUpperCase()}`, "info");

    const timer1 = setTimeout(() => addLog("جاري الاتصال بالشبكة العصبية المركزية لـ Google Cloud...", "info"), 800);
    const timer2 = setTimeout(() => addLog("صياغة السيناريوهات السردية وتنسيق هيكلة الاحتفاظ بالمشاهد...", "info"), 2200);
    const timer3 = setTimeout(() => {
      if (activeIncludeVisual) {
        addLog("تم قبول الكلمات السردية. جاري إطلاق خوارزمية السيطرة البصرية وتجسيد الأصول الفنية...", "warning");
      }
    }, 4500);

    try {
      const response = await fetch("/api/tactical/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: activeNiche,
          mode: activeMode,
          language: activeLang,
          tone: activeTone,
          includeVisual: activeIncludeVisual
        })
      });

      let data: any = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textText = await response.text();
        console.warn(">> Non-JSON response:", textText.substring(0, 300));
        throw new Error(`استجابة غير صالحة من الخادم (كود: ${response.status}). يرجى التأكد من تشغيل الخادم وتثبيت الإعدادات.`);
      }
      
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok || data.error) {
        throw new Error(data.error || data.message || "فشلت عملية التوليد الذكي على الخادم.");
      }

      setCurrentPack(data);
      addLog(`اكتمل تخليق حزمة الهيمنة بنجاح!`, "success");
      addLog(`درجة الفيرال (تحليل مصفوفة الحركية): ${data.metrics.viralityScore}%`, "success");
      addLog(`معدل الوصول المتوقع للخوارزميات: ${(data.metrics.predictedReach / 1000000).toFixed(1)}M مشاهدة`, "success");
      addLog("تم تصفيف الحزم والمشاهد وإرسالها للمزامنة مع محاكي الجوال.", "info");

    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      console.error(err);
      addLog(`فشل التخليق: ${err.message || "حدث خطأ غير متوقع"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2500);
    addLog(`تم نسخ [${label}] إلى الحافظة بنجاح.`, "success");
  };

  const handleManualTrendInsert = (hash: string) => {
    setNiche(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${hash}` : hash;
    });
    addLog(`تم إقحام الهاشتاق السحري [${hash}] في خانة النيش.`, "info");
  };

  return (
    <div className="min-h-screen bg-[#030510] text-gray-100 flex flex-col overflow-x-hidden relative">
      
      {/* Background Matrix Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute inset-[-5px] opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 0)",
          backgroundSize: "28px 28px"
        }}></div>
        <div className="absolute top-0 right-[-100px] w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-0 left-[-100px] w-96 h-96 rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      {/* Main Header / Top Bar */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <Cpu size={16} />
          </div>
          <div className="text-left font-sans">
            <h1 className="text-sm sm:text-base font-black tracking-wider text-white">DOMINATOR V3 CONTROL</h1>
            <p className="text-[8px] tracking-[0.25em] text-emerald-500 font-bold uppercase">TikTok-First Closed-Loop Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile vs Split Simulator Toggle */}
          <button 
            onClick={() => setIsMobileOnly(!isMobileOnly)} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-bold font-sans cursor-pointer"
          >
            <Smartphone size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">
              {isMobileOnly ? "عرض لوحة التحكم الكاملة" : "تركيز الجوال فقط"}
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-mono text-emerald-400 font-black">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span>ONLINE PRIME</span>
          </div>
        </div>
      </header>

      {/* Content Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start z-10">
        
        {/* DESKTOP SIDE PANELS (Hidden if in mobile-only view) */}
        {!isMobileOnly && (
          <div className="xl:col-span-8 flex flex-col gap-6 w-full h-full">

            {/* Section 1: Dynamic Parameter Input Form */}
            <section className="glass-panel rounded-3xl p-6 relative overflow-hidden text-right border border-white/10 shadow-2xl">
              <div className="absolute -left-12 -top-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start gap-4 mb-5 select-none text-left">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-black uppercase tracking-widest font-mono">
                  PARAMETRIC FORGE
                </span>
                <div className="text-right">
                  <h2 className="text-lg font-black text-white flex items-center justify-end gap-2 drop-shadow">
                    <span>مختبر التخليق والتحوير السردي</span>
                    <Sparkles size={16} className="text-emerald-450 animate-pulse" />
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">اختر النيش التنافسي والخصائص النفسية لاجتياح موجات الـ FYP بالخليج العربي.</p>
                </div>
              </div>

              {/* Niche Text Input Box */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mb-1.5 block pr-0.5">
                    مستند النيش أو فصيلة الموضوع • target niche topic
                  </label>
                  <textarea
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    rows={2}
                    placeholder="مثال: التسويق الرقمي بالذكاء الاصطناعي لرواد الأعمال والمطاعم الفاخرة..."
                    className="w-full bg-[#070914]/80 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-inner leading-relaxed text-right"
                  />
                </div>

                {/* Popular Trending Tags Sandbox */}
                <div className="space-y-2 select-none">
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1 mb-1 pr-0.5">
                    <span>ثغرات ترندات اليوم (انقر لإلحاقها بالنيش)</span>
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {["#التسويق_بالذكاء_الاصطناعي", "#استراتيجيات_النمو", "#ادوات_صانع_المحتوى", "#ريلز_عقارية", "#عقارات_دبي", "#صنع_في_المستقبل"].map((hash) => (
                      <button
                        key={hash}
                        onClick={() => handleManualTrendInsert(hash)}
                        className="text-[10px] px-2.5 py-1 rounded-full border border-white/5 bg-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-400 font-medium transition-all duration-200"
                      >
                        {hash}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid Form Selector Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-right">
                  {/* Mode / Format */}
                  <div>
                    <label className="text-[10px] text-neutral-450 uppercase font-black tracking-wider mb-1.5 block">صيغة الهيمنة</label>
                    <div className="flex gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setMode("REELS_ENGINE")}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${mode === "REELS_ENGINE" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "text-neutral-400 hover:text-white"}`}
                      >
                        ريلز سردي (3 فصول)
                      </button>
                      <button 
                        onClick={() => setMode("VIRAL_ATTACK")}
                        className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${mode === "VIRAL_ATTACK" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "text-neutral-400 hover:text-white"}`}
                      >
                        منشور فيد (16:9)
                      </button>
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <label className="text-[10px] text-neutral-450 uppercase font-black tracking-wider mb-1.5 block">لغة مخرج الكتابة</label>
                    <select
                      value={language}
                      onChange={(e: any) => setLanguage(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-[11px] text-white text-right outline-none cursor-pointer focus:border-emerald-500 transition-colors"
                    >
                      <option value="ar">العربية (الأصيلة)</option>
                      <option value="en">English (Global)</option>
                    </select>
                  </div>

                  {/* Persona Tone */}
                  <div>
                    <label className="text-[10px] text-neutral-450 uppercase font-black tracking-wider mb-1.5 block">النبرة السيكولوجية</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-[11px] text-white text-right outline-none cursor-pointer focus:border-emerald-500 transition-colors"
                    >
                      <option value="authority">العظمة والسيادة الملكية</option>
                      <option value="story">السرد الفني والروائي المثير</option>
                      <option value="contrarian">الصدمة والمخالفة الجريئة</option>
                      <option value="tactical">التحليل التنفيذي والتكتيكي</option>
                      <option value="ceo">القائد التنفيذي العصري</option>
                    </select>
                  </div>
                </div>

                {/* Image Gen Checkbox Toggle Option */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 select-none">
                  <input 
                    type="checkbox"
                    id="checkboxImg"
                    checked={includeVisual}
                    onChange={(e) => setIncludeVisual(e.target.checked)}
                    className="accent-emerald-500 cursor-pointer h-4 w-4"
                  />
                  <label htmlFor="checkboxImg" className="text-xs text-neutral-400 cursor-pointer text-right">
                    نحت رسوم فنية بالذكاء الاصطناعي مرافقة لكل سيناريو (استهلاك ذكي وتأمين Flux)
                  </label>
                </div>

                {/* Big Trigger Execute Button */}
                <button
                  onClick={() => handleSynthesize()}
                  disabled={isLoading}
                  className="w-full mt-2 py-4 bg-emerald-500 hover:bg-emerald-450 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black text-sm tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري إخضاع المصفوفة الرقمية وتوليد المخرجات...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>SYNTHESIZE CONTENT PACK • تخليق الحزمة السيادية</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Neural Progress Logs Terminal console runs in the background */}

            {/* Section 2: Render Outputs Stage Result */}
            {currentPack && (
              <section className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl flex flex-col gap-6 text-right animate-[fadeIn_0.5s_ease-out]">
                
                {/* Virality Scoring Analytics Header Box */}
                <div className="bg-gradient-to-l from-emerald-950/20 via-[#070a1a] to-[#070a1a] border border-emerald-500/25 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-1 w-full bg-gradient-to-l from-emerald-500 to-blue-500"></div>

                  {/* Left stats circle */}
                  <div className="flex gap-6 items-center flex-row-reverse md:flex-row text-right md:text-left select-none border-t md:border-t-0 md:border-r border-white/10 pt-4 md:pt-0 md:pr-6">
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">معدل الفيرال</div>
                      <div className="text-2xl font-black text-emerald-400 glow-text">{currentPack.metrics.viralityScore}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">حجم التوزيع</div>
                      <div className="text-2xl font-black text-white">{(currentPack.metrics.predictedReach / 1000).toLocaleString()}K+</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-widest">سيكولوجية النبرة</div>
                      <div className="text-xs bg-white/5 border border-white/5 px-2.5 py-1 rounded text-emerald-300 font-mono font-bold mt-1 tracking-tighter uppercase">
                        {currentPack.metrics.sentiment}
                      </div>
                    </div>
                  </div>

                  {/* Header text content */}
                  <div className="flex-1 text-right">
                    <span className="text-[10px] text-neutral-450 uppercase font-bold tracking-wider font-mono">حزمة الهيمنة النشطة</span>
                    <h3 className="text-xl font-bold mt-1 text-white">{currentPack.title}</h3>
                  </div>
                </div>

                {/* RENDER VIEW: REELS STORYBOARD MULTI-SCENE FLOW */}
                {currentPack.is_reel ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {currentPack.scenes?.map((scene, idx) => (
                      <div key={idx} className="bg-[#0c0d1b] border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-colors">
                        
                        {/* Vertical Image card frame */}
                        <div className="aspect-[9/16] w-full rounded-xl overflow-hidden relative border border-white/5 bg-neutral-900 group shadow-lg mb-3">
                          {scene.image_base64 ? (
                            <img 
                              src={`data:image/jpeg;base64,${scene.image_base64}`} 
                              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105" 
                              alt={`Scene ${idx+1}`}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-4 text-center">
                              <Sparkles size={20} className="text-neutral-700 mb-1" />
                              <span className="text-[9px] text-neutral-500">لا يوجد رسم تخيلي</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-1"></div>
                          
                          {/* Badges Overlay */}
                          <div className="absolute top-2.5 right-2.5 z-10 bg-emerald-500 text-black px-2 py-0.5 rounded font-black text-[9px] tracking-widest">
                            {scene.time}
                          </div>
                          <div className="absolute top-2.5 left-2.5 z-10 bg-black/60 border border-white/10 text-white px-2 py-0.5 rounded font-mono text-[9px]">
                            SCENE {idx+1}
                          </div>
                        </div>

                        {/* Script Content */}
                        <div className="space-y-3 flex-1 flex flex-col justify-between text-right">
                          <p className="text-white text-xs leading-relaxed font-semibold italic border-r-2 border-emerald-500/50 pr-2.5 select-text">
                            "{scene.voiceover}"
                          </p>

                          {/* Hidden Art prompt detail disclosure */}
                          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 text-[10px] font-mono leading-relaxed select-text mt-2 text-left">
                            <span className="text-emerald-500 block text-[9px] font-black uppercase tracking-wider mb-0.5">IMAGE ART GENERATION PROMPT:</span>
                            <span className="text-gray-450">{scene.image_prompt}</span>
                          </div>

                          <button 
                            onClick={() => copyText(scene.voiceover, `نص المشهد ${idx+1}`)}
                            className="w-full mt-3 py-2 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-450 border border-white/15 hover:border-emerald-500/30 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {copiedSection === `نص المشهد ${idx+1}` ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copiedSection === `نص المشهد ${idx+1}` ? "تم النسخ!" : "نسخ نص الدبلجة"}</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  // --- RENDER VIEW: STANDARD HIGHLIGHT POST STAGE (16:9 Landscape) ---
                  <div className="space-y-6">
                    {currentPack.image_base64 && (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 relative group shadow-2xl">
                        <img 
                          src={`data:image/jpeg;base64,${currentPack.image_base64}`} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102" 
                          alt="Main Banner" 
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur border border-white/10 text-emerald-400 font-mono text-xs px-3 py-1 rounded-xl shadow-lg">
                          16:9 MASTERPIECE BANNER
                        </div>
                      </div>
                    )}

                    {/* Bold arabic writing output layout */}
                    <div className="bg-[#0a0c1a] border border-white/5 rounded-3xl p-6 relative overflow-hidden select-text text-right shadow-inner">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                        <button 
                          onClick={() => copyText(currentPack.body || "", "المنشور الكامل")}
                          className="px-3 py-1.5 bg-white/5 hover:bg-emerald-500/15 text-xs font-bold text-emerald-400 rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-500/10 cursor-pointer"
                        >
                          {copiedSection === "المنشور الكامل" ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedSection === "المنشور الكامل" ? "تم نسخه!" : "نسخ المحتوى بالكامل"}</span>
                        </button>
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          صيغة الهيمنة: {currentPack.framework}
                        </span>
                      </div>
                      <p className="text-white text-sm sm:text-base leading-loose whitespace-pre-line font-medium text-right arabic-text">
                        {currentPack.body}
                      </p>
                    </div>
                  </div>
                )}

                {/* Shared Interactive Tag List Footer container */}
                <div className="bg-black/35 rounded-2xl p-4 border border-white/5 flex flex-direction-row-reverse flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5 justify-end flex-1">
                    {currentPack.hashtags.map((h, i) => (
                      <span 
                        key={i} 
                        onClick={() => copyText(h, h)}
                        className="px-3 py-1 bg-[#0c1024] border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 rounded-lg text-xs tracking-tight text-right text-gray-300 font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                        title="انقر لنسخ هذا الهاشتاق"
                      >
                        <span className="text-[9px] text-gray-500 font-mono">#</span>
                        <span>{h.replace("#", "")}</span>
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider pr-2">أقسام الترندات الموصى بها</span>
                </div>

              </section>
            )}

          </div>
        )}

        {/* MOBILE SIMULATOR COUMNL (Always visible, handles both side-by-side or mobile-only view) */}
        <div className={`w-full flex justify-center items-center h-full ${isMobileOnly ? "xl:col-span-12" : "xl:col-span-4"}`}>
          <div className="flex flex-col items-center gap-3 w-full">
            <AndroidSimulator 
              currentPack={currentPack}
              isLoading={isLoading}
              onSynthesize={handleSynthesize}
            />
            {/* Quick Context Tip */}
            <div className="text-[10px] text-neutral-550 max-w-xs text-center select-none font-sans mt-1">
              * محاكي الهاتف المحمول يحتوي على لوحة معاينة وتصفيف سيناريو ريلز وتيك توك بشكل تفاعلي بالكامل. انقر على التبويبات بالأسفل كأنه جوال حقيقي لتجربته.
            </div>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <footer className="py-6 border-t border-white/5 mt-auto text-center text-[10px] text-neutral-600 font-mono select-none">
        <div>DOMINATOR V3 • CONTROL INTERFACE VERSION 12.9</div>
        <div className="mt-1">CRAFTED FOR ROYAL VIRAL EXPLOITATION AND AUDIENCE DOMINANCE</div>
      </footer>

    </div>
  );
}
