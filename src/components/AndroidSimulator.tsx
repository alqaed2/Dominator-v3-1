import React, { useState, useEffect } from "react";
import { Scene, DominatorPack } from "../types";
import { 
  Smartphone, Wifi, Battery, RotateCcw, Play, Heart, MessageCircle, 
  Share2, Copy, Sparkles, TrendingUp, Compass, Award, Shield, User, HelpCircle, Flame,
  UploadCloud, CheckCircle, AlertCircle, Clock, Eye, Bookmark, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AndroidSimulatorProps {
  currentPack: DominatorPack | null;
  isLoading: boolean;
  onSynthesize: (params: {
    niche: string;
    mode: "REELS_ENGINE" | "VIRAL_ATTACK";
    language: "ar" | "en";
    tone: string;
    includeVisual: boolean;
  }) => void;
}

type MobileTab = "home" | "forge" | "simulator" | "manual";

export default function AndroidSimulator({ currentPack, isLoading, onSynthesize }: AndroidSimulatorProps) {
  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [likedScenes, setLikedScenes] = useState<Record<number, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [showComments, setShowComments] = useState<boolean>(false);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);

  // Form states inside the mobile input tab
  const [mobileNiche, setMobileNiche] = useState("التسويق بالذكاء الاصطناعي للمطاعم الفاخرة");
  const [mobileMode, setMobileMode] = useState<"REELS_ENGINE" | "VIRAL_ATTACK">("REELS_ENGINE");
  const [mobileLang, setMobileLang] = useState<"ar" | "en">("ar");
  const [mobileTone, setMobileTone] = useState("authority");
  const [includeImg, setIncludeImg] = useState(true);

  // Screenshot Vision state variables
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "queued" | "completed" | "failed">("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [metricsResult, setMetricsResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Creator DNA Stateless Analytics Engine State Variables
  const [dnaResult, setDnaResult] = useState<any>(null);
  const [isAnalyzingDna, setIsAnalyzingDna] = useState(false);
  const [dnaError, setDnaError] = useState<string | null>(null);

  // Trigger Creator DNA calculation dynamically from Express backend API
  const handleCalculateCreatorDNA = async () => {
    try {
      setIsAnalyzingDna(true);
      setDnaError(null);
      // Fetch calculation using active default demo creatorId "creator-alpha"
      const res = await fetch("/api/creator/creator-alpha/dna/calculate", {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "خطأ غير متوقع أثناء حساب البصمة الرقمية للقايد.");
      }
      setDnaResult(data.dna);
    } catch (err: any) {
      console.error("!! DNA calculation failed:", err);
      setDnaError(err.message || err.toString());
    } finally {
      setIsAnalyzingDna(false);
    }
  };

  // Standby Base64 preset of high-performing TikTok Reels screenshot metrics (for easy user demo)
  const PRESET_DEMO_SCREENSHOT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  const handleScreenshotUpload = async (base64Str: string) => {
    try {
      setIsUploading(true);
      setUploadStatus("queued");
      setUploadError(null);
      setMetricsResult(null);
      setJobId(null);

      const res = await fetch("/api/screenshot/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenshot: base64Str })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "فشل إرسال لقطة الشاشة إلى طابور المعالجة.");
      }

      setJobId(data.jobId);
      
      // Start polling the job status until completion
      pollScreenshotJob(data.jobId);
    } catch (err: any) {
      console.error("!! Upload failed:", err);
      setUploadStatus("failed");
      setUploadError(err.message || err.toString());
      setIsUploading(false);
    }
  };

  const pollScreenshotJob = (id: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 30) { // Limit polling to 60s max
        clearInterval(interval);
        setUploadStatus("failed");
        setUploadError("انتهت مهلة الانتشار في الطابور المستقل. يرجى إعادة المحاولة.");
        setIsUploading(false);
        return;
      }

      try {
        const res = await fetch(`/api/screenshot/job/${id}`);
        const data = await res.json();

        if (data.status === "completed") {
          clearInterval(interval);
          setUploadStatus("completed");
          setMetricsResult(data.result);
          setIsUploading(false);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setUploadStatus("failed");
          setUploadError(data.error || "فشلت الخدمة في تحليل ومعالجة لقطة الشاشة.");
          setIsUploading(false);
        }
      } catch (err: any) {
        console.warn(">> Fallback/Polling warning:", err.message);
      }
    }, 2000);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleScreenshotUpload(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadStatus("failed");
      setUploadError("عذراً، تقع مشكلة أثناء قراءة ملف الصورة.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Keep mobile mode in sync if changed from desktop
  useEffect(() => {
    if (currentPack) {
      setActiveTab("simulator");
      setActiveReelIndex(0);
      // Initialize mock like counts
      const counts: Record<number, number> = {};
      if (currentPack.scenes) {
        currentPack.scenes.forEach((_, idx) => {
          counts[idx] = Math.floor(Math.random() * 85002) + 12053;
        });
      }
      setLikeCounts(counts);
    }
  }, [currentPack]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleLikeToggle = (index: number) => {
    const isLiked = !likedScenes[index];
    setLikedScenes(prev => ({ ...prev, [index]: isLiked }));
    setLikeCounts(prev => ({
      ...prev,
      [index]: isLiked ? (prev[index] || 0) + 1 : (prev[index] || 1) - 1
    }));
  };

  const executeMobileForge = () => {
    if (!mobileNiche.trim()) return;
    onSynthesize({
      niche: mobileNiche,
      mode: mobileMode,
      language: mobileLang,
      tone: mobileTone,
      includeVisual: includeImg
    });
  };

  const getToneLabel = (val: string) => {
    switch(val) {
      case "authority": return "سيادي (Authority)";
      case "tactical": return "تنفيذي (Tactical)";
      case "contrarian": return "صادم (Contrarian)";
      case "story": return "سردي (Story)";
      case "ceo": return "قيادي (CEO)";
      default: return val;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 xl:p-4 select-none">
      {/* Phone Case Frame */}
      <div className="relative w-[345px] h-[700px] rounded-[48px] bg-neutral-900 border-[10px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden ring-4 ring-neutral-750">
        
        {/* Dynamic Island / Punch Hole */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[7px] text-emerald-400 font-mono tracking-tighter uppercase">DOMINATOR V3</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-900/60 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-10 bg-black/90 pt-4 px-6 flex justify-between items-center text-[10px] font-semibold text-white/90 z-40 select-none">
          <span className="font-mono">12:00 م</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1 py-0.2 rounded font-mono font-black scale-90">5G PRIME</span>
            <Wifi size={10} className="text-white/80" />
            <Battery size={12} className="text-emerald-500" />
          </div>
        </div>

        {/* Phone Content Screen */}
        <div className="flex-1 bg-neutral-950 flex flex-col relative text-white text-right font-sans">
          
          <AnimatePresence mode="wait">
            {/* SCREEN 1: HOME */}
            {activeTab === "home" && (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col p-5 overflow-y-auto pb-16 scrollbar-none"
              >
                {/* Profile Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4 mt-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <User size={16} />
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-black text-white">القايد السيادي</h3>
                    <p className="text-[9px] text-emerald-500 tracking-wider">رخصة برونزية نشطة</p>
                  </div>
                </div>

                {/* Score Card */}
                <div className="bg-gradient-to-br from-emerald-950/40 to-neutral-900 border border-emerald-500/20 rounded-2xl p-4 mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-emerald-550/20 px-2 py-0.5 rounded-br-xl text-[8px] tracking-widest font-mono text-emerald-400">
                    DIAGNOSTICS
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-left">
                      <div className="text-2xl font-black text-emerald-400">98.2%</div>
                      <div className="text-[8px] text-gray-500 uppercase font-mono tracking-widest">DOMINANCE RATIO</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400">معدل الفوز بالخوارزمية</div>
                      <p className="text-xs font-bold text-white mt-1">امتداد السيادة الرقمية</p>
                    </div>
                  </div>
                </div>

                {/* Growth Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-neutral-900 border border-white/5 rounded-2xl p-3">
                    <div className="text-[8px] text-neutral-500 flex items-center justify-between">
                      <TrendingUp size={10} className="text-emerald-500" />
                      <span>المشاهدات</span>
                    </div>
                    <div className="text-base font-black mt-1">4.8M</div>
                    <div className="text-[8px] text-emerald-400 mt-1">▲ +240% هذا الشهر</div>
                  </div>
                  <div className="bg-neutral-900 border border-white/5 rounded-2xl p-3">
                    <div className="text-[8px] text-neutral-500 flex items-center justify-between">
                      <User size={10} className="text-emerald-500" />
                      <span>المتابعين</span>
                    </div>
                    <div className="text-base font-black mt-1">142.5K</div>
                    <div className="text-[8px] text-emerald-400 mt-1">▲ +12.3K أسبوعياً</div>
                  </div>
                </div>

                {/* CREATOR DNA STATELESS ANALYTICS SERVICE */}
                <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-white/10 rounded-2xl p-4 mb-4 text-right">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-end gap-1.5">
                    <span>تحليل مصفوفة الـ DNA الكاشف</span>
                    <Flame size={10} className="text-amber-500 animate-pulse" />
                  </h4>
                  <p className="text-[9px] text-gray-450 mb-3 leading-relaxed">الخوارزمية الرياضية الصافية لفك شفرة الأداء وتحوير المحتوى بالتوازي (Stateless Pipeline).</p>

                  {!dnaResult && !isAnalyzingDna && (
                    <button
                      onClick={handleCalculateCreatorDNA}
                      className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-550/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-[9px] font-black transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>تشغيل الخوارزمية الإحصائية (10+ عينات)</span>
                      <Sparkles size={11} />
                    </button>
                  )}

                  {isAnalyzingDna && (
                    <div className="bg-black/30 rounded-xl p-4 text-center">
                      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-[9.5px] font-bold text-white mb-1 animate-pulse">جاري الحساب الرياضي ورصد الانحراف المعياري...</p>
                      <span className="text-[7.5px] text-neutral-500 block">Querying postgresql + Caching in Redis (dna:creatorId)...</span>
                    </div>
                  )}

                  {dnaResult && (
                    <div className="space-y-3">
                      {/* High-level stats row */}
                      <div className="grid grid-cols-2 gap-2 text-right">
                        <div className="bg-black/40 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7px] text-neutral-400 block font-mono">CONFIDENCE_SCORE</span>
                          <span className="text-[11px] font-black text-emerald-400">{dnaResult.confidenceScore}%</span>
                          <div className="w-full bg-neutral-800 h-1 rounded-full mt-1 overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${dnaResult.confidenceScore}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7px] text-neutral-400 block font-mono">SAMPLE_SIZE</span>
                          <span className="text-[11px] font-black text-white">{dnaResult.sampleSize} عينات</span>
                          <span className="text-[7px] text-[gray-500] block mt-1 font-mono">10+ REQUIRED</span>
                        </div>
                      </div>

                      {/* Baselines block */}
                      <div className="bg-white/5 border border-white/5 p-2 rounded-xl text-[8px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-mono">Mean views: {dnaResult.baseline.meanViews.toLocaleString()} ± SD: {dnaResult.baseline.stdDevViews.toLocaleString()}</span>
                          <span className="font-bold text-white">خط أساس المشاهدات:</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-mono">Mean comp: {dnaResult.baseline.meanCompletionRate}% ± SD: {dnaResult.baseline.stdDevCompletionRate}%</span>
                          <span className="font-bold text-white">خط أساس الاحتفاظ:</span>
                        </div>
                      </div>

                      {/* Success & Failure Drivers list */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-[8px] text-emerald-400 font-bold block mb-1">✓ محركات الهيمنة الصاعدة (Success Drivers)</span>
                          {dnaResult.successDrivers.map((d: any, idx: number) => (
                            <div key={idx} className="bg-emerald-550/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-[8.5px] mb-1 text-right flex justify-between items-center">
                              <span className="font-mono text-[7px] bg-emerald-500/20 px-1 rounded">x{d.strengthMultiplier}</span>
                              <span className="truncate flex-1 max-w-[210px] pr-1">{d.traitValue}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <span className="text-[8px] text-red-450 font-bold block mb-1">✗ عوامل تشتيت الوصول (Failure Drivers)</span>
                          {dnaResult.failureDrivers.map((d: any, idx: number) => (
                            <div key={idx} className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-1 rounded text-[8.5px] mb-1 text-right flex justify-between items-center">
                              <span className="font-mono text-[7px] bg-red-500/20 px-1 rounded">x{d.strengthMultiplier}</span>
                              <span className="truncate flex-1 max-w-[210px] pr-1">{d.traitValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Verdict */}
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg text-right">
                        <p className="text-[8.5px] text-gray-300 leading-relaxed italic">
                          "{dnaResult.verdict}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-[7px] text-gray-500 font-mono">
                        <span>PERSISTENCE: PROCESSED ✔</span>
                        <span className="text-emerald-500">REDIS_CACHE: ACTIVE (TTL=24H)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Alerts */}
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-2 pr-1">إعلانات السيادة والخوارزميات</h4>
                <div className="space-y-2.5 mb-5">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-3 transition-colors hover:bg-white/10">
                    <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                      <Flame size={12} />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h5 className="text-[11px] font-bold text-white">صعود ترند #التسويق_بالذكاء_الاصطناعي</h5>
                      <p className="text-[9px] text-gray-450 mt-0.5 leading-relaxed">قفزة بنسبة 450% للتفاعل العضوي بالريلز العربية خلال الـ 24 ساعة الماضية.</p>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                      <Award size={12} />
                    </div>
                    <div className="text-right flex-1 min-w-0">
                      <h5 className="text-[11px] font-bold text-white">ترقية خوارزمية TikTok v12</h5>
                      <p className="text-[9px] text-gray-450 mt-0.5 leading-relaxed">استجابة فائقة الموثوقية للمخططات المكونة من 3 فصول سردية.</p>
                    </div>
                  </div>
                </div>

                {/* SCREENSHOT VISION SYSTEM INTEGRATION */}
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 mb-4 text-right">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-end gap-1.5">
                    <span>رادار الرؤية ✦ رصد لقطات الشاشة</span>
                    <Activity size={10} className="animate-pulse" />
                  </h4>
                  <p className="text-[9px] text-gray-450 mb-3 leading-relaxed">ارفع لقطة شاشة لتقرير ريلز/تيك توك لاستخراج إحصائيات التفاعل بنظام طوابير BullMQ المستقل.</p>

                  {uploadStatus === "idle" && (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        dragActive ? "border-emerald-500 bg-emerald-500/55" : "border-white/10 hover:border-white/20 bg-black/20"
                      }`}
                      onClick={() => document.getElementById("fileInput")?.click()}
                    >
                      <UploadCloud size={20} className="text-neutral-500 mb-1.5" />
                      <span className="text-[9px] text-gray-300 font-bold block mb-1">اسحب لقطة الشاشة أو اضغط للتصفح</span>
                      <span className="text-[7.5px] text-gray-550 block leading-tight">يدعم ملفات الصور (PNG, JPG)</span>
                      
                      <input 
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            processFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}

                  {uploadStatus === "queued" && (
                    <div className="bg-black/30 border border-emerald-500/20 rounded-xl p-3.5 text-center flex flex-col items-center justify-center">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-[9.5px] font-bold text-white mb-1 animate-pulse">جاري التحليل عبر طابور BullMQ الخلفي (Redis)</p>
                      <span className="text-[8px] text-emerald-400 font-mono">ID: {jobId ? jobId.substring(0, 16) + '...' : 'جاري التعيين...'}</span>
                      <span className="text-[7.5px] text-gray-450 mt-1.5 block leading-tight text-right w-full bg-white/5 p-1.5 rounded">
                        1. تفويض الصورة للطابور screenshot-queue.<br />
                        2. تنبيه المعالج مع Vision AI لتنظيف الأرقام.<br />
                        3. التعديل المباشر في قاعدة البيانات.
                      </span>
                    </div>
                  )}

                  {uploadStatus === "completed" && metricsResult && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg">
                        <button 
                          onClick={() => setUploadStatus("idle")} 
                          className="text-[8px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-white font-bold hover:bg-emerald-500/35"
                        >
                          جديد
                        </button>
                        <span className="flex items-center gap-1">
                          <span>تم التدقيق عبر الرؤية بنجاح</span>
                          <CheckCircle size={10} />
                        </span>
                      </div>

                      {/* Extracted Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 text-right">
                        <div className="bg-black/30 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7.5px] text-neutral-400 block">المشاهدات (Views)</span>
                          <span className="text-xs font-black text-white">{(metricsResult.views || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7.5px] text-neutral-400 block">الإعجابات (Likes)</span>
                          <span className="text-xs font-black text-white">{(metricsResult.likes || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7.5px] text-neutral-400 block">التعليقات (Comments)</span>
                          <span className="text-xs font-black text-white">{(metricsResult.comments || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-2 rounded-lg">
                          <span className="text-[7.5px] text-neutral-400 block">المشاركات (Shares)</span>
                          <span className="text-xs font-black text-white">{(metricsResult.shares || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-black/30 border border-white/5 p-2 rounded-lg col-span-2 flex justify-between items-center px-1.5">
                          <span className="text-xs font-black text-emerald-400">{(metricsResult.completionRate || 0)}%</span>
                          <span className="text-[7.5px] text-neutral-400">معدل الإكمال (Completion)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadStatus === "failed" && (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-center flex flex-col items-center justify-center">
                      <AlertCircle size={14} className="text-red-400 mb-1.5" />
                      <p className="text-[9px] text-red-300 font-bold mb-1">فشلت معالجة لقطة الشاشة</p>
                      <span className="text-[7.5px] text-neutral-400 block mb-2">{uploadError || "حدث خطأ غير متوقع."}</span>
                      <button 
                        onClick={() => setUploadStatus("idle")} 
                        className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 rounded text-white font-bold hover:bg-white/10"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  )}

                  {uploadStatus === "idle" && (
                    <button 
                      onClick={() => handleScreenshotUpload(PRESET_DEMO_SCREENSHOT)}
                      className="w-full mt-2 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-lg text-[8px] font-bold tracking-wide transition-all border border-white/5"
                    >
                      ✦ تجربة سريعة بلقطة نموذجية (Demo Auto-Upload)
                    </button>
                  )}
                </div>

                {/* Quick Action Button */}
                <button 
                  onClick={() => setActiveTab("forge")}
                  className="w-full mt-auto py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-xl tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  <span>دخول معمل التخليق السيادي</span>
                </button>
              </motion.div>
            )}

            {/* SCREEN 2: FORGE (Synthesizer UI) */}
            {activeTab === "forge" && (
              <motion.div 
                key="forge"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col p-5 overflow-y-auto pb-16 scrollbar-none text-right"
              >
                <h3 className="text-sm font-black text-white mt-1 border-b border-white/5 pb-2">سلطة التخليق الفيروسي</h3>
                
                <div className="space-y-4 mt-4">
                  {/* Topic */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1">موضوع التخليق / النيش</label>
                    <textarea 
                      value={mobileNiche}
                      onChange={(e) => setMobileNiche(e.target.value)}
                      rows={2}
                      className="w-full mt-1 bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-1.5 block">صيغة المخرج (Format)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setMobileMode("REELS_ENGINE")}
                        className={`py-3 text-[10px] font-black rounded-lg transition-all border ${
                          mobileMode === "REELS_ENGINE"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                            : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-white"
                        }`}
                      >
                        REELS (9:16)
                      </button>
                      <button 
                        onClick={() => setMobileMode("VIRAL_ATTACK")}
                        className={`py-3 text-[10px] font-black rounded-lg transition-all border ${
                          mobileMode === "VIRAL_ATTACK"
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                            : "bg-neutral-900 border-white/5 text-neutral-500 hover:text-white"
                        }`}
                      >
                        POST (16:9)
                      </button>
                    </div>
                  </div>

                  {/* Language & Tone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-1 block">اللغة</label>
                      <select 
                        value={mobileLang}
                        onChange={(e: any) => setMobileLang(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-[10px] text-white text-right outline-none"
                      >
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest pl-1 mb-1 block">النبرة</label>
                      <select 
                        value={mobileTone}
                        onChange={(e) => setMobileTone(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-lg p-2 text-[10px] text-white text-right outline-none"
                      >
                        <option value="authority">العظمة / السيادة</option>
                        <option value="story">سردي قصصي</option>
                        <option value="contrarian">صادم ومخالف</option>
                        <option value="tactical">تنفيذي دقيق</option>
                        <option value="ceo">رئيس تنفيذي</option>
                      </select>
                    </div>
                  </div>

                  {/* Render Visual Checkbox */}
                  <div className="flex items-center justify-between bg-neutral-900/60 border border-white/5 p-3 rounded-xl mt-1">
                    <input 
                      type="checkbox"
                      id="mobileVisual"
                      checked={includeImg}
                      onChange={(e) => setIncludeImg(e.target.checked)}
                      className="accent-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="mobileVisual" className="text-[10px] text-neutral-350 select-none cursor-pointer">
                      توليد أصل بصري لكل فصيلة (Visual AI)
                    </label>
                  </div>
                </div>

                <button 
                  onClick={executeMobileForge}
                  disabled={isLoading}
                  className="w-full mt-auto py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-black font-black text-xs uppercase rounded-xl tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري التخليق النيوروني...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>تخليق حزمة الهيمنة</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* SCREEN 3: SIMULATOR VIEW (TikTok Feed / Reels Viewer mockup) */}
            {activeTab === "simulator" && (
              <motion.div 
                key="simulator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col relative bg-black select-none"
              >
                {!currentPack ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
                    <Compass size={32} className="text-neutral-700 mb-3 animate-pulse" />
                    <p className="text-xs text-neutral-500">لا يوجد حزمة جاهزة حالياً</p>
                    <p className="text-[10px] text-neutral-600 mt-1">اضغط على زر (تخليق) أعلاه لإطلاق الخوارزميات</p>
                  </div>
                ) : currentPack.is_reel ? (
                  // --- REELS SIMULATOR VIEW ---
                  <div className="flex-1 flex flex-col relative h-full">
                    {/* Scene Navigation Indicator Dots */}
                    <div className="absolute top-2 left-4 z-30 flex flex-col gap-1">
                      {currentPack.scenes?.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveReelIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            activeReelIndex === idx ? "bg-emerald-400 scale-125 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Active Reel Scene Panel */}
                    {currentPack.scenes && currentPack.scenes[activeReelIndex] && (
                      <div className="flex-1 relative flex flex-col justify-end overflow-hidden">
                        
                        {/* Background Scene Image */}
                        {currentPack.scenes[activeReelIndex].image_base64 ? (
                          <img 
                            src={`data:image/jpeg;base64,${currentPack.scenes[activeReelIndex].image_base64}`} 
                            key={activeReelIndex}
                            className="absolute inset-0 w-full h-full object-cover z-0 animate-[fadeIn_0.5s_ease-out]"
                            alt={`Scene ${activeReelIndex + 1}`}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-950 flex flex-col items-center justify-center p-4 z-0 text-center">
                            <Sparkles size={24} className="text-neutral-600 mb-2 animate-pulse" />
                            <span className="text-[10px] text-neutral-500">لا يوجد عنصر بصري</span>
                          </div>
                        )}
                        
                        {/* Shimmer Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

                        {/* Top Context Badge */}
                        <div className="absolute top-2 right-4 z-30 flex items-center gap-2">
                          <span className="bg-black/60 backdrop-blur border border-white/10 text-white font-mono text-[8px] px-2 py-0.5 rounded-full">
                            SCENE {activeReelIndex + 1}/3
                          </span>
                          <span className="bg-emerald-500 text-black font-black text-[8px] px-2 py-0.5 rounded-full">
                            {currentPack.scenes[activeReelIndex].time}
                          </span>
                        </div>

                        {/* TikTok Overlay Buttons (Right Margin) */}
                        <div className="absolute bottom-16 right-3 z-30 flex flex-col items-center gap-4 text-white">
                          {/* Profile Circle */}
                          <div className="w-9 h-9 rounded-full bg-emerald-400/20 border border-emerald-500/50 flex items-center justify-center p-0.5 shadow-lg relative mb-1.5">
                            <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-[10px]">DOM</div>
                            <div className="absolute -bottom-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center border border-white text-[8px] font-bold text-white leading-none">+</div>
                          </div>

                          {/* Like Button */}
                          <button 
                            onClick={() => handleLikeToggle(activeReelIndex)}
                            className="flex flex-col items-center gap-0.5 select-none"
                          >
                            <Heart 
                              size={22} 
                              className={`transition-all drop-shadow-md ${
                                likedScenes[activeReelIndex] 
                                  ? "text-red-500 fill-red-500 scale-125" 
                                  : "text-white hover:text-neutral-200"
                              }`} 
                            />
                            <span className="text-[9px] font-mono font-bold drop-shadow">
                              {(likeCounts[activeReelIndex] || 25412).toLocaleString()}
                            </span>
                          </button>

                          {/* Comments Button */}
                          <button 
                            onClick={() => setShowComments(!showComments)}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <MessageCircle size={22} className="text-white hover:text-neutral-200 drop-shadow-md" />
                            <span className="text-[9px] font-mono font-bold drop-shadow">1,240</span>
                          </button>

                          {/* Share Button */}
                          <button className="flex flex-col items-center gap-0.5">
                            <Share2 size={22} className="text-white hover:text-neutral-200 drop-shadow-md" />
                            <span className="text-[9px] font-bold drop-shadow">مشاركة</span>
                          </button>

                          {/* Copy Sript Button */}
                          <button 
                            onClick={() => copyToClipboard(currentPack.scenes?.[activeReelIndex]?.voiceover || "", `scene-${activeReelIndex}`)}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <Copy size={20} className="text-emerald-400 hover:text-emerald-350 drop-shadow-md" />
                            <span className="text-[8px] font-bold text-emerald-400">
                              {copiedText === `scene-${activeReelIndex}` ? "تم!" : "نسخ الكلمة"}
                            </span>
                          </button>
                        </div>

                        {/* TikTok Caption and Title (Left Margin Bottom) */}
                        <div className="relative z-20 pl-16 pr-5 pb-6 text-right flex flex-col items-end w-full">
                          {/* Audio disc animation info */}
                          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5 mb-3.5 shadow-lg max-w-[210px] sm:max-w-xs justify-end">
                            <div className="flex items-end h-2 gap-0.5">
                              <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse"></span>
                              <span className="w-0.5 h-3 bg-emerald-400 animate-pulse delay-75"></span>
                              <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse delay-150"></span>
                            </div>
                            <span className="text-[9px] font-bold text-white/90 truncate dir-rtl arabic-text text-right select-none">
                              صوت التعليق السيادي • AI VO
                            </span>
                          </div>

                          {/* Main Script Script Text */}
                          <p className="text-white text-[13px] sm:text-[14px] leading-relaxed font-black mb-3 border-r-2 border-emerald-500 pr-3 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] text-right w-full arabic-text">
                            "{currentPack.scenes[activeReelIndex].voiceover}"
                          </p>

                          {/* Author tag and hashtag list */}
                          <div className="text-right w-full">
                            <span className="text-emerald-400 font-bold text-xs">@dominator_system</span>
                            <div className="flex flex-wrap gap-1 justify-end mt-1.5 max-w-[210px]">
                              {currentPack.hashtags.slice(0, 4).map((h, i) => (
                                <span key={i} className="text-[9px] text-blue-300 font-bold drop-shadow">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Music spinning disc simulation in bottom right corner */}
                        <div className="absolute bottom-5 left-4 z-20">
                          <div className="w-7 h-7 rounded-full bg-neutral-900 border-2 border-white/20 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[5px] text-black font-black">AI</div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ) : (
                  // --- VIRAL POST SIMULATOR VIEW (16:9 standard copy layout helper) ---
                  <div className="flex-1 flex flex-col p-4 overflow-y-auto pb-16 scrollbar-none text-right">
                    
                    {/* Post Image Container */}
                    {currentPack.image_base64 ? (
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 bg-neutral-900 relative">
                        <img 
                          src={`data:image/jpeg;base64,${currentPack.image_base64}`} 
                          className="w-full h-full object-cover" 
                          alt="Post Frame" 
                        />
                        <span className="absolute bottom-2 left-2 bg-black/60 text-emerald-450 text-[8px] font-mono px-2 py-0.5 rounded">
                          IMAGE 16:9
                        </span>
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-neutral-900 rounded-xl border border-white/5 flex flex-col items-center justify-center mb-4 text-center">
                        <Sparkles size={20} className="text-neutral-700 mb-1" />
                        <span className="text-[9px] text-neutral-500">لا يوجد صورة منشورة</span>
                      </div>
                    )}

                    {/* Meta and score info */}
                    <div className="grid grid-cols-2 gap-2 bg-neutral-900 border border-white/5 p-3 rounded-xl mb-4 text-xs font-mono text-center">
                      <div className="border-r border-white/5">
                        <div className="text-amber-400 font-black">{currentPack.metrics.dominanceScore ?? 96}%</div>
                        <div className="text-[8px] text-neutral-400 font-sans">معدل هيمنة التخليق</div>
                      </div>
                      <div>
                        <div className="text-emerald-400 font-black">{currentPack.metrics.viralityScore}%</div>
                        <div className="text-[8px] text-neutral-400 font-sans font-bold">علامة الفيرست</div>
                      </div>
                    </div>

                    {/* Main Copy Post */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-4 select-text">
                      <div className="text-[9px] text-emerald-400 uppercase tracking-wider mb-2 font-black">
                        المحتوى المولد • SCRIPT COPY
                      </div>
                      <p className="text-white text-xs leading-relaxed whitespace-pre-line text-right arabic-text">
                        {currentPack.body}
                      </p>
                    </div>

                    {/* Hashtag List */}
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {currentPack.hashtags.map((h, i) => (
                        <span key={i} className="text-[10px] bg-neutral-900 border border-white/5 px-2 py-1 rounded text-gray-300 font-bold">
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Big Action Copy Button */}
                    <button 
                      onClick={() => copyToClipboard(currentPack.body || "", "post-text")}
                      className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Copy size={12} />
                      <span>{copiedText === "post-text" ? "تم نسخ النص بنجاح!" : "نسخ المنشور كاملاً"}</span>
                    </button>
                    
                  </div>
                )}
              </motion.div>
            )}

            {/* SCREEN 4: PLATFORM INFO (Manual) */}
            {activeTab === "manual" && (
              <motion.div 
                key="manual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col p-5 overflow-y-auto pb-16 scrollbar-none text-right"
              >
                <h3 className="text-sm font-black text-white mt-1 border-b border-white/5 pb-2">نظام الهيمنة المغلقة (Closed Loop)</h3>
                
                <div className="space-y-4 text-xs text-neutral-300 leading-relaxed mt-4">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <h4 className="font-bold text-white mb-1.5 flex items-center justify-end gap-1.5">
                      <span>مختبر التخليق</span>
                      <Smartphone size={12} className="text-emerald-400" />
                    </h4>
                    <p className="text-[10px] text-neutral-450">قم بتعيين المتغيرات ثم إطلاق المحاكاة. ستقوم مصفوفة الذكاء الاصطناعي ببناء قصة ريلز متكاملة من 3 فصول مدعومة بأصول فنية فائقة الجمال.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <h4 className="font-bold text-white mb-1.5 flex items-center justify-end gap-1.5">
                      <span>رادار الانتشار العضوي</span>
                      <Flame size={12} className="text-emerald-400" />
                    </h4>
                    <p className="text-[10px] text-neutral-450">خوارزميات مخصصة للغة العربية تراعي النبرات والأوقات المثالية للتفاعل. تجوب نيو-إنترنت لاستخلاص الجينات السردية.</p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <h4 className="font-bold text-white mb-1.5 flex items-center justify-end gap-1.5">
                      <span>توليد متعدد الأبعاد</span>
                      <Sparkles size={12} className="text-emerald-400" />
                    </h4>
                    <p className="text-[10px] text-neutral-450">نوفق بين أفضل خوارزميات صياغة السيناريو والصور (Gemini 3.5 & Flux Engine) لتجنب الروبوتية وصناعة محتوى إنتشاري أصيل.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phone Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-14 bg-black/95 border-t border-white/5 flex justify-around items-center px-4 z-40 select-none">
            <button 
              onClick={() => setActiveTab("manual")}
              className={`flex flex-col items-center gap-1 text-[8px] font-bold ${activeTab === "manual" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
            >
              <HelpCircle size={15} />
              <span>دليل النظام</span>
            </button>
            <button 
              onClick={() => setActiveTab("simulator")}
              className={`flex flex-col items-center gap-1 text-[8px] font-bold relative ${activeTab === "simulator" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
            >
              <Compass size={15} />
              <span>معاينة الفيد</span>
              {currentPack && activeTab !== "simulator" && (
                <span className="absolute top-0 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab("forge")}
              className={`flex flex-col items-center gap-1 text-[8px] font-bold ${activeTab === "forge" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
            >
              <Sparkles size={15} />
              <span>التخليق</span>
            </button>
            <button 
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-1 text-[8px] font-bold ${activeTab === "home" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
            >
              <Smartphone size={15} />
              <span>الرئيسية</span>
            </button>
          </div>

        </div>

        {/* Android Native Bar Selector Line Mockup */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-50"></div>

      </div>
    </div>
  );
}
