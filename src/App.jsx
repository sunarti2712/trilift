import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ClipboardList, FileText, GraduationCap, Languages, NotebookPen, ShieldCheck } from "lucide-react";

/**
 * Tri-LIFT Prototype App (i18n-enabled)
 * - Built from the products defined in this conversation:
 *   1) Tri-LIFT Task Pack (6 weeks)
 *   2) Trilingual Analytic Rubric (Content + EN/ID/ZH + Mediation)
 *   3) Mandarin Academic HSK3 Pre/Post test blueprint
 *   4) Fidelity of Implementation & Observation instruments
 *
 * Notes:
 * - This is a local-first prototype (no backend). Data is stored in browser memory.
 * - You can export/import JSON for persistence.
 * - UI language can switch ZH/ID/EN.
 */

// ---------- i18n ----------
const I18N = {
  en: {
    appTitle: "Tri-LIFT Trilingual Assessment App",
    badge: "HSK 3 • Track C",
    subtitle:
      "Prototype web app to manage the Task Pack, trilingual performance rubric, Mandarin academic test (pre/post), and fidelity observation.",
    language: "Language",
    langs: { en: "English", id: "Indonesian", zh: "Chinese" },
    buttons: { addStudent: "Add Student", removeStudent: "Remove", export: "Export JSON", import: "Import JSON" },
    tabs: { taskpack: "Task Pack", students: "Students", rubric: "Rubric", test: "Mandarin Test", fidelity: "Fidelity" },
    taskpack: {
      title: "Tri-LIFT Task Pack (6 Weeks)",
      cols: { week: "Week", theme: "Theme", chain: "Task Chain", langFunc: "Language Functions", artifacts: "Artifacts", measure: "Measurement" },
    },
    students: {
      listTitle: "Student List",
      profileTitle: "Profile & Test Scores (Pre/Post)",
      name: "Name",
      className: "Class",
      artifactTitle: "Student Artifacts (Link & Notes)",
      artifactHint: "Save a file link (Drive/LMS) or document ID",
      classSummary: "Class Summary (Mandarin Pre/Post & Performance)",
      table: { student: "Student", cls: "Class", zhPre: "ZH Pre", zhPost: "ZH Post", gain: "Gain", perf: "Avg Perf (0–20)" },
    },
    rubric: {
      title: "Analytic Rubric (1–4)",
      inputTitle: "Rubric Score Input",
      raterA: "Rater A",
      raterB: "Rater B",
      chooseScore: "Choose score",
      guideBtn: "View Rater Training Guide",
      guideTitle: "Rater Training (Brief)",
      guideP1:
        "1) Read the rubric together and agree on Level 1–4 interpretations. 2) Use 5 anchor samples (2 high, 2 mid, 1 low) for calibration. 3) Practice scoring independently, then discuss discrepancies. 4) Repeat until ICC is adequate.",
      guideP2:
        "Best practice: blind scoring (no group info) and brief scoring rationales for the first 2–3 artifacts.",
      total: "Total",
    },
    test: {
      title: "Mandarin Academic Test (HSK 3) — Blueprint & Administration",
      cols: { comp: "Component", task: "Task", func: "Academic Function", score: "Score" },
      writingTitle: "Writing Prompt (Pre/Post – parallel)",
      speakingTitle: "Speaking Prompt (Pre/Post – parallel)",
      adminTitle: "Administration Checklist",
      admin: [
        "Pretest in Week 1 (before intervention)",
        "Posttest in Week 8 (end of intervention)",
        "Record speaking (for blind scoring)",
        "Use at least 2 raters for speaking & writing",
        "Parallel forms for Pre/Post: different topics, similar difficulty",
        "Keep rubric & anchor samples for calibration",
      ],
    },
    fidelity: {
      title: "Fidelity Checklist (Observation Session)",
      date: "Date",
      teacher: "Observer / Teacher",
      cls: "Class",
      techUse: "Technology (LMS/media) used functionally",
      notes: "Observation Notes",
      reset: "Reset",
      download: "Download Session",
      protocolTitle: "Classroom Observation Protocol (Template)",
      protocol: {
        a: "Student activity: participation, discussion, group work, revision.",
        b: "Language use: when EN/ID/ZH are used; productive vs off-task switching.",
        c: "Teacher support: scaffolding, prompting, formative feedback.",
        d: "Constraints: time, cognitive load, level gaps, technology.",
        e: "Consistency across classes: whether the scenario was followed.",
      },
      exBtn: "View Example Observation Notes",
      exTitle: "Observation Notes (Example)",
    },
    footer: "Data is local (in-memory). Use Export/Import JSON to persist.",
    common: { unnamed: "(Unnamed)", placeholderClass: "e.g., 10A" },
    score: { pre: "Pre", post: "Post", gain: "Gain" },
    select: { none: "0 (not scored yet)", one: "1", two: "2", three: "3", four: "4" },
  },
  id: {
    appTitle: "Tri-LIFT Trilingual Assessment App",
    badge: "HSK 3 • Track C",
    subtitle:
      "Prototype aplikasi web untuk mengelola Task Pack, rubrik performa trilingual, tes Mandarin akademik (pre/post), dan fidelity observasi kelas.",
    language: "Bahasa",
    langs: { en: "Inggris", id: "Indonesia", zh: "Mandarin" },
    buttons: { addStudent: "Tambah Siswa", removeStudent: "Hapus", export: "Export JSON", import: "Import JSON" },
    tabs: { taskpack: "Task Pack", students: "Siswa", rubric: "Rubrik", test: "Tes Mandarin", fidelity: "Fidelity" },
    taskpack: {
      title: "Tri-LIFT Task Pack (6 Minggu)",
      cols: { week: "Minggu", theme: "Tema", chain: "Task Chain", langFunc: "Fungsi Bahasa", artifacts: "Artefak", measure: "Link Pengukuran" },
    },
    students: {
      listTitle: "Daftar Siswa",
      profileTitle: "Profil & Skor Tes (Pre/Post)",
      name: "Nama",
      className: "Kelas",
      artifactTitle: "Artefak Siswa (Link & Catatan)",
      artifactHint: "Simpan link file (Drive/LMS) atau kode dokumen",
      classSummary: "Ringkasan Kelas (Mandarin Pre/Post & Performa)",
      table: { student: "Siswa", cls: "Kelas", zhPre: "ZH Pre", zhPost: "ZH Post", gain: "Gain", perf: "Avg Perf (0–20)" },
    },
    rubric: {
      title: "Rubrik Analitik (1–4)",
      inputTitle: "Input Skor Rubrik",
      raterA: "Rater A",
      raterB: "Rater B",
      chooseScore: "Pilih skor",
      guideBtn: "Lihat Panduan Training Rater",
      guideTitle: "Training Rater (Ringkas)",
      guideP1:
        "1) Baca rubrik bersama, sepakati interpretasi Level 1–4. 2) Gunakan 5 anchor samples (2 tinggi, 2 menengah, 1 rendah) untuk kalibrasi. 3) Latihan scoring independen, lalu diskusikan selisih skor. 4) Ulangi sampai ICC memadai.",
      guideP2:
        "Praktik terbaik: scoring blind (tanpa info kelompok), dan pencatatan alasan skor untuk 2–3 artefak awal.",
      total: "Total",
    },
    test: {
      title: "Tes Mandarin Akademik (HSK 3) — Blueprint & Administrasi",
      cols: { comp: "Komponen", task: "Bentuk Tugas", func: "Fungsi Akademik", score: "Skor" },
      writingTitle: "Prompt Writing (Pre/Post – paralel)",
      speakingTitle: "Prompt Speaking (Pre/Post – paralel)",
      adminTitle: "Administrasi Tes (Checklist)",
      admin: [
        "Pretest minggu 1 (sebelum intervensi)",
        "Posttest minggu 8 (akhir intervensi)",
        "Speaking direkam (untuk blind scoring)",
        "Gunakan rater minimal 2 untuk speaking & writing",
        "Set paralel Pre/Post: topik berbeda, kesulitan setara",
        "Simpan rubrik & anchor samples untuk kalibrasi",
      ],
    },
    fidelity: {
      title: "Fidelity Checklist (Sesi Observasi)",
      date: "Tanggal",
      teacher: "Observer / Guru",
      cls: "Kelas",
      techUse: "Teknologi (LMS/media) digunakan fungsional",
      notes: "Catatan Observasi",
      reset: "Reset",
      download: "Download Sesi",
      protocolTitle: "Protokol Observasi Kelas (Template)",
      protocol: {
        a: "Aktivitas siswa: partisipasi, diskusi, kerja kelompok, revisi.",
        b: "Bahasa digunakan: kapan EN/ID/ZH dipakai; switching produktif vs off-task.",
        c: "Dukungan guru: scaffolding, prompt, feedback formatif.",
        d: "Hambatan: waktu, beban kognitif, kesenjangan level, teknologi.",
        e: "Konsistensi antar kelas: apakah skenario intervensi diikuti.",
      },
      exBtn: "Lihat Contoh Format Catatan Observasi",
      exTitle: "Format Catatan Observasi (Contoh)",
    },
    footer: "Data disimpan lokal (in-memory). Gunakan Export/Import JSON untuk menyimpan sesi.",
    common: { unnamed: "(Unnamed)", placeholderClass: "mis. 10A" },
    score: { pre: "Pre", post: "Post", gain: "Gain" },
    select: { none: "0 (belum dinilai)", one: "1", two: "2", three: "3", four: "4" },
  },
  zh: {
    appTitle: "Tri-LIFT 三语评估系统",
    badge: "HSK 3 • C路径",
    subtitle:
      "用于管理任务包、三语表现量表、汉语学术测验（前测/后测）与课堂实施保真度观察的原型系统。",
    language: "界面语言",
    langs: { en: "英文", id: "印尼语", zh: "中文" },
    buttons: { addStudent: "添加学生", removeStudent: "删除", export: "导出 JSON", import: "导入 JSON" },
    tabs: { taskpack: "任务包", students: "学生", rubric: "量表", test: "汉语测验", fidelity: "保真度" },
    taskpack: {
      title: "Tri-LIFT 任务包（6周）",
      cols: { week: "周次", theme: "主题", chain: "任务链", langFunc: "语言功能", artifacts: "产出物", measure: "测量链接" },
    },
    students: {
      listTitle: "学生名单",
      profileTitle: "学生信息与测验成绩（前测/后测）",
      name: "姓名",
      className: "班级",
      artifactTitle: "学生产出物（链接与备注）",
      artifactHint: "保存文件链接（网盘/LMS）或文档编号",
      classSummary: "班级汇总（汉语前后测与表现）",
      table: { student: "学生", cls: "班级", zhPre: "中文前测", zhPost: "中文后测", gain: "增益", perf: "平均表现(0–20)" },
    },
    rubric: {
      title: "分析性量表（1–4）",
      inputTitle: "量表评分输入",
      raterA: "评分员A",
      raterB: "评分员B",
      chooseScore: "请选择分数",
      guideBtn: "查看评分员培训指南",
      guideTitle: "评分员培训（简要）",
      guideP1:
        "1）共同阅读量表并统一对1–4级的理解；2）使用5个锚定样本（2高、2中、1低）进行校准；3）独立评分后讨论差异；4）重复直到ICC达到要求。",
      guideP2:
        "建议：盲评（不含组别信息），并对前2–3份产出简要记录评分理由。",
      total: "总分",
    },
    test: {
      title: "汉语学术测验（HSK 3）—蓝图与实施",
      cols: { comp: "模块", task: "任务形式", func: "学术功能", score: "分值" },
      writingTitle: "写作题（前/后测—平行）",
      speakingTitle: "口语题（前/后测—平行）",
      adminTitle: "测验实施清单",
      admin: [
        "第1周前测（干预前）",
        "第8周后测（干预结束）",
        "口语录音/录像（用于盲评）",
        "口语与写作至少2名评分员",
        "前后测平行卷：主题不同、难度相当",
        "保留量表与锚定样本用于校准",
      ],
    },
    fidelity: {
      title: "实施保真度清单（课堂观察）",
      date: "日期",
      teacher: "观察者/教师",
      cls: "班级",
      techUse: "技术（LMS/媒体）被有效使用",
      notes: "观察记录",
      reset: "重置",
      download: "下载本次记录",
      protocolTitle: "课堂观察记录模板",
      protocol: {
        a: "学生活动：参与、讨论、小组合作、修订。",
        b: "语言使用：EN/ID/ZH何时使用；有效转换与跑题转换。",
        c: "教师支持：支架、提问、形成性反馈。",
        d: "限制因素：时间、认知负荷、水平差异、技术条件。",
        e: "跨班一致性：是否按既定方案实施。",
      },
      exBtn: "查看观察记录示例",
      exTitle: "观察记录（示例）",
    },
    footer: "数据保存在本地（内存）。请使用导出/导入 JSON 进行保存与恢复。",
    common: { unnamed: "（未命名）", placeholderClass: "例如：10A" },
    score: { pre: "前测", post: "后测", gain: "增益" },
    select: { none: "0（未评分）", one: "1", two: "2", three: "3", four: "4" },
  },
};

const LANG_BADGE = { en: "EN", id: "ID", zh: "ZH" };

function pickLang(obj, uiLang) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj?.[uiLang] ?? obj?.zh ?? obj?.id ?? obj?.en ?? "";
}

function makeT(uiLang) {
  const dict = I18N[uiLang] || I18N.en;
  return (path) => {
    const v = path.split(".").reduce((acc, k) => acc?.[k], dict);
    return v ?? path;
  };
}

// ---------- Data (multilingual where useful) ----------
const TASK_PACK = [
  {
    week: 1,
    theme: { en: "Global Issue Orientation", id: "Orientasi Isu Global", zh: "全球议题导入" },
    chain: {
      en: "Read global sources (popular science/social articles); discuss core concepts",
      id: "Membaca sumber global (artikel sains/sosial populer); diskusi konsep inti",
      zh: "阅读全球资料（科普/社科文章）；讨论核心概念",
    },
    languageFunctions: {
      EN: { en: "Source literacy & main ideas (reading log)", id: "Literasi sumber & ide utama (reading log)", zh: "资料理解与主旨提炼（阅读日志）" },
      ID: { en: "Concept clarification (discussion & concept summary)", id: "Klarifikasi konsep (diskusi & ringkasan konsep)", zh: "概念澄清（讨论与概念摘要）" },
      ZH: { en: "—", id: "—", zh: "—" },
    },
    artifacts: [
      { en: "Reading Log (EN)", id: "Reading Log (EN)", zh: "阅读日志（英文）" },
      { en: "Concept Summary (ID)", id: "Ringkasan Konsep (ID)", zh: "概念摘要（印尼语）" },
    ],
    measurementLink: { en: "Baseline literacy & concept understanding", id: "Baseline literasi & pemahaman konsep", zh: "学术素养与概念理解基线" },
  },
  {
    week: 2,
    theme: { en: "Concept Elaboration", id: "Elaborasi Konsep", zh: "概念深化" },
    chain: {
      en: "Write conceptual summary & argument map",
      id: "Menulis ringkasan konseptual & peta argumen",
      zh: "撰写概念摘要与论证图谱",
    },
    languageFunctions: {
      EN: { en: "—", id: "—", zh: "—" },
      ID: { en: "Elaboration & academic structure", id: "Elaborasi & struktur akademik", zh: "概念展开与学术结构" },
      ZH: { en: "—", id: "—", zh: "—" },
    },
    artifacts: [{ en: "Concept Brief (ID)", id: "Concept Brief (ID)", zh: "概念简报（印尼语）" }],
    measurementLink: { en: "Academic content rubric", id: "Rubrik konten akademik", zh: "学术内容量表" },
  },
  {
    week: 3,
    theme: { en: "Academic Mediation I", id: "Mediasi Akademik I", zh: "学术中介 I" },
    chain: {
      en: "Summarize the concept into simple academic Mandarin (HSK 3)",
      id: "Meringkas konsep ke dalam Mandarin akademik sederhana (HSK 3)",
      zh: "用HSK3水平的学术中文概括概念",
    },
    languageFunctions: {
      EN: { en: "—", id: "—", zh: "—" },
      ID: { en: "—", id: "—", zh: "—" },
      ZH: { en: "Academic summary (writing: 120–150 chars)", id: "Ringkasan akademik (写作: 120–150字)", zh: "学术摘要（写作：120–150字）" },
    },
    artifacts: [{ en: "Written Summary (ZH)", id: "Written Summary (ZH)", zh: "中文书面摘要" }],
    measurementLink: { en: "Mandarin writing test (productive)", id: "Tes tulis Mandarin (produktif)", zh: "中文写作测验（产出）" },
  },
  {
    week: 4,
    theme: { en: "Academic Mediation II", id: "Mediasi Akademik II", zh: "学术中介 II" },
    chain: {
      en: "Short presentation of the summary & guided Q&A",
      id: "Presentasi singkat hasil ringkasan & Q&A terarah",
      zh: "中文简短汇报与引导式问答",
    },
    languageFunctions: {
      EN: { en: "—", id: "—", zh: "—" },
      ID: { en: "—", id: "—", zh: "—" },
      ZH: { en: "2–3 min presentation + Q&A", id: "Presentasi 2–3 menit + respons pertanyaan", zh: "2–3分钟汇报 + 回答问题" },
    },
    artifacts: [
      { en: "Presentation Video (ZH)", id: "Video Presentasi (ZH)", zh: "中文汇报视频" },
      { en: "Q&A Notes (ZH)", id: "Q&A Notes (ZH)", zh: "问答记录（中文）" },
    ],
    measurementLink: { en: "Mandarin speaking test; performance rubric", id: "Tes lisan Mandarin; rubrik performa", zh: "中文口语测验；表现量表" },
  },
  {
    week: 5,
    theme: { en: "Academic Argumentation", id: "Argumentasi Akademik", zh: "学术论证" },
    chain: { en: "Write a source-based short essay", id: "Menulis esai pendek berbasis sumber", zh: "撰写基于资料的短文论证" },
    languageFunctions: {
      EN: { en: "Argumentation & academic coherence", id: "Argumentasi & koherensi akademik", zh: "论证与学术连贯性" },
      ID: { en: "—", id: "—", zh: "—" },
      ZH: { en: "—", id: "—", zh: "—" },
    },
    artifacts: [{ en: "Short Academic Essay (EN)", id: "Short Academic Essay (EN)", zh: "英文短学术论证" }],
    measurementLink: { en: "English writing test (task-based)", id: "Tes tulis Inggris (task-based)", zh: "英文写作测验（任务型）" },
  },
  {
    week: 6,
    theme: { en: "Trilingual Synthesis", id: "Sintesis Trilingual", zh: "三语综合" },
    chain: {
      en: "Final trilingual presentation & metalinguistic reflection",
      id: "Presentasi akhir trilingual & refleksi metalinguistik",
      zh: "三语成果展示与元语言反思",
    },
    languageFunctions: {
      EN: { en: "Synthesis of findings (slides/outline)", id: "Sintesis temuan (slide/outline)", zh: "成果综合（幻灯/提纲）" },
      ID: { en: "Concept explanation & implications", id: "Penjelasan konsep & implikasi", zh: "概念解释与启示" },
      ZH: { en: "Summary & cross-cultural mediation", id: "Ringkasan & mediasi lintas budaya", zh: "总结与跨文化中介" },
    },
    artifacts: [
      { en: "Trilingual Portfolio", id: "Trilingual Portfolio", zh: "三语作品集" },
      { en: "Reflection", id: "Reflection", zh: "反思" },
    ],
    measurementLink: { en: "Trilingual performance score (primary)", id: "Skor performa trilingual (utama)", zh: "三语表现得分（主要）" },
  },
];

const RUBRIC = {
  content: {
    name: { en: "Academic Content (Content Fidelity)", id: "Konten Akademik (Content Fidelity)", zh: "学术内容（内容一致性）" },
    levels: {
      4: {
        en: "Accurate, relevant, and integrated main/supporting ideas; deep conceptual understanding across languages.",
        id: "Gagasan utama dan pendukung akurat, relevan, terintegrasi; pemahaman konseptual mendalam & konsisten lintas bahasa.",
        zh: "主旨与论据准确相关且整合良好；跨语言概念理解深入一致。",
      },
      3: {
        en: "Main ideas accurate; adequate elaboration though integration could be deeper.",
        id: "Gagasan utama akurat; elaborasi memadai meski integrasi belum sepenuhnya mendalam.",
        zh: "主旨准确；展开较充分但整合深度仍可提升。",
      },
      2: {
        en: "Partly accurate main ideas; limited development/coherence.",
        id: "Gagasan utama sebagian akurat; pengembangan konsep terbatas/kurang koheren.",
        zh: "主旨部分准确；概念展开有限或连贯性不足。",
      },
      1: {
        en: "Weak conceptual understanding; major misconceptions or irrelevant information.",
        id: "Pemahaman konsep lemah; kesalahan konsep utama atau informasi tidak relevan.",
        zh: "概念理解薄弱；存在关键误解或信息不相关。",
      },
    },
  },
  en: {
    name: { en: "Academic English", id: "Kualitas Bahasa Inggris (Academic English)", zh: "学术英语" },
    levels: {
      4: { en: "Accurate structure; precise academic vocabulary; strong cohesion/coherence.", id: "Struktur akurat; kosakata akademik tepat; kohesi & koherensi sangat baik.", zh: "结构准确；学术词汇恰当；衔接与连贯性强。" },
      3: { en: "Generally accurate; minor errors do not hinder meaning.", id: "Umumnya tepat; kesalahan minor tidak mengganggu makna.", zh: "总体准确；小错误不影响理解。" },
      2: { en: "Frequent errors; meaning still understandable.", id: "Kesalahan cukup sering; makna masih dapat dipahami.", zh: "错误较多；仍可理解。" },
      1: { en: "Errors dominate; meaning often unclear.", id: "Kesalahan dominan; makna sering tidak jelas.", zh: "错误占主导；意义常不清晰。" },
    },
  },
  id: {
    name: { en: "Academic Indonesian", id: "Kualitas Bahasa Indonesia (Ragam Akademik Formal)", zh: "学术印尼语" },
    levels: {
      4: { en: "Formal academic register; logical structure; accurate and consistent terminology.", id: "Ragam akademik baku; struktur logis; terminologi tepat & konsisten.", zh: "语体规范；结构逻辑；术语准确一致。" },
      3: { en: "Mostly consistent; minor issues in structure/word choice.", id: "Cukup konsisten; kesalahan minor pada struktur/diksi.", zh: "较为一致；结构或措辞有少量问题。" },
      2: { en: "Mixed formal–informal; unstable structure.", id: "Campuran formal–nonformal; struktur kurang stabil.", zh: "正式/非正式混用；结构不稳定。" },
      1: { en: "Register not appropriate; poor control of structure.", id: "Ragam tidak sesuai konteks akademik; struktur tidak terkontrol.", zh: "语体不适当；结构控制不足。" },
    },
  },
  zh: {
    name: { en: "Academic Mandarin (HSK 3)", id: "Kualitas Bahasa Mandarin (HSK 3 – Academic-Oriented)", zh: "学术中文（HSK 3）" },
    levels: {
      4: { en: "HSK 3-appropriate structures; precise vocabulary; clear and coherent.", id: "Struktur sesuai HSK 3; kosakata tepat; jelas & koheren.", zh: "结构符合HSK3；词汇恰当；表达清晰连贯。" },
      3: { en: "Generally appropriate; errors do not hinder communication.", id: "Umumnya tepat; kesalahan tidak mengganggu komunikasi.", zh: "总体合适；错误不影响交流。" },
      2: { en: "Frequent errors; communication still possible.", id: "Kesalahan cukup sering; komunikasi masih berlangsung.", zh: "错误较多；仍能完成交流。" },
      1: { en: "Errors dominate; difficult to understand.", id: "Kesalahan dominan; komunikasi sulit dipahami.", zh: "错误占主导；理解困难。" },
    },
  },
  mediation: {
    name: { en: "Academic Communication & Mediation", id: "Komunikasi Akademik & Mediasi Bahasa", zh: "学术交流与语言中介" },
    levels: {
      4: { en: "Clear and structured delivery; effectively mediates meaning across languages.", id: "Penyampaian jelas & terstruktur; mampu memediasi/mentransfer ide antar bahasa secara efektif.", zh: "表达清晰有结构；能有效在语言间中介/转述意义。" },
      3: { en: "Mostly clear; meaning transfer largely successful.", id: "Cukup jelas; transfer ide sebagian besar berhasil.", zh: "较清晰；意义转述基本成功。" },
      2: { en: "Less structured; limited transfer.", id: "Kurang terstruktur; transfer ide terbatas.", zh: "结构不足；转述能力有限。" },
      1: { en: "Ineffective; fails to mediate meaning.", id: "Tidak efektif; gagal memediasi makna antar bahasa.", zh: "效果差；难以完成意义中介。" },
    },
  },
};

const MANDARIN_TEST_BLUEPRINT = [
  {
    part: { en: "Listening", id: "Menyimak", zh: "听力" },
    task: {
      en: "Short academic input (≈120 chars) + questions",
      id: "Paparan akademik singkat (±120字) + pertanyaan",
      zh: "学术短文本（约120字）+ 问题",
    },
    func: { en: "Main idea & key details", id: "Ide utama & detail penting", zh: "主旨与关键信息" },
    max: 20,
  },
  {
    part: { en: "Reading", id: "Membaca", zh: "阅读" },
    task: {
      en: "Informational text (≈250 chars) + questions",
      id: "Teks informasional (±250字) + pertanyaan",
      zh: "说明性文本（约250字）+ 问题",
    },
    func: { en: "Ideas & relations", id: "Gagasan & hubungan ide", zh: "观点与关系" },
    max: 20,
  },
  {
    part: { en: "Writing", id: "Menulis", zh: "写作" },
    task: {
      en: "120–150 char summary + brief opinion",
      id: "Ringkasan 120–150字 + opini singkat",
      zh: "120–150字摘要 + 简短观点",
    },
    func: { en: "Re-present information", id: "Menyajikan ulang informasi", zh: "信息重述" },
    max: 30,
  },
  {
    part: { en: "Speaking", id: "Berbicara", zh: "口语" },
    task: {
      en: "2–3 min presentation + 2 questions",
      id: "Presentasi 2–3 menit + 2 pertanyaan",
      zh: "2–3分钟汇报 + 2个问题",
    },
    func: { en: "Explain concepts & respond", id: "Menjelaskan konsep & merespons", zh: "解释概念并回应" },
    max: 30,
  },
];

const FIDELITY_ITEMS = [
  {
    key: "designFit",
    label: {
      en: "Design alignment: tasks follow Tri-LIFT scenario",
      id: "Kesesuaian desain: tugas mengikuti skenario Tri-LIFT",
      zh: "设计一致性：任务符合Tri-LIFT方案",
    },
    scale: "1–4",
  },
  {
    key: "langIntegration",
    label: {
      en: "Language integration: EN–ID–ZH by function",
      id: "Integrasi bahasa: EN–ID–ZH sesuai fungsi",
      zh: "语言整合：EN–ID–ZH按功能使用",
    },
    scale: "1–4",
  },
  {
    key: "authenticity",
    label: {
      en: "Task authenticity: real academic practice",
      id: "Autentisitas tugas: praktik akademik nyata",
      zh: "任务真实性：真实学术实践",
    },
    scale: "1–4",
  },
  {
    key: "teacherCollab",
    label: {
      en: "Teacher collaboration across languages",
      id: "Kolaborasi guru lintas bahasa terlihat",
      zh: "跨语教师协作",
    },
    scale: "1–4",
  },
  {
    key: "techUse",
    label: {
      en: "Technology use (LMS/media) is functional",
      id: "Pemanfaatan teknologi (LMS/media) fungsional",
      zh: "技术使用（LMS/媒体）有效",
    },
    scale: { en: "Yes/No", id: "Ya/Tidak", zh: "是/否" },
  },
  {
    key: "timeFlow",
    label: {
      en: "Time & flow are consistent",
      id: "Waktu & alur pembelajaran konsisten",
      zh: "时间与课堂流程一致",
    },
    scale: "1–4",
  },
];

function clampScore(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function scoreTotalRubric(scores) {
  const keys = ["content", "en", "id", "zh", "mediation"];
  return keys.reduce((sum, k) => sum + (Number(scores?.[k]) || 0), 0);
}

const defaultStudent = () => ({
  id: crypto.randomUUID(),
  name: "",
  className: "",
  baseline: { zh: 0, en: 0, id: 0 },
  post: { zh: 0, en: 0, id: 0 },
  artifacts: {
    w1_en_readlog: { link: "", notes: "" },
    w1_id_summary: { link: "", notes: "" },
    w2_id_brief: { link: "", notes: "" },
    w3_zh_written: { link: "", notes: "" },
    w4_zh_video: { link: "", notes: "" },
    w5_en_essay: { link: "", notes: "" },
    w6_portfolio: { link: "", notes: "" },
  },
  rubricScores: {
    w3_zh_written: { content: 0, en: 0, id: 0, zh: 0, mediation: 0, raterA: "", raterB: "" },
    w4_zh_video: { content: 0, en: 0, id: 0, zh: 0, mediation: 0, raterA: "", raterB: "" },
    w5_en_essay: { content: 0, en: 0, id: 0, zh: 0, mediation: 0, raterA: "", raterB: "" },
    w6_portfolio: { content: 0, en: 0, id: 0, zh: 0, mediation: 0, raterA: "", raterB: "" },
  },
});

export default function TriLIFTApp() {
  const [uiLang, setUiLang] = useState("id");
  const t = useMemo(() => makeT(uiLang), [uiLang]);

  const [students, setStudents] = useState([defaultStudent()]);
  const [selectedId, setSelectedId] = useState(students[0].id);
  const [fidelity, setFidelity] = useState({
    sessionDate: "",
    teacher: "",
    className: "",
    techUse: false,
    notes: "",
    ratings: { designFit: 0, langIntegration: 0, authenticity: 0, teacherCollab: 0, timeFlow: 0 },
  });

  const selected = useMemo(() => students.find((s) => s.id === selectedId) || students[0], [students, selectedId]);

  const summary = useMemo(() => {
    const rows = students.map((s) => {
      const pre = clampScore(s.baseline.zh);
      const post = clampScore(s.post.zh);
      const gain = post - pre;
      const perf = [
        scoreTotalRubric(s.rubricScores.w3_zh_written),
        scoreTotalRubric(s.rubricScores.w4_zh_video),
        scoreTotalRubric(s.rubricScores.w5_en_essay),
        scoreTotalRubric(s.rubricScores.w6_portfolio),
      ].filter((x) => x > 0);
      const perfAvg = perf.length ? perf.reduce((a, b) => a + b, 0) / perf.length : 0;
      return { name: s.name || t("common.unnamed"), className: s.className || "-", pre, post, gain, perfAvg };
    });
    return rows;
  }, [students, t]);

  const chartData = useMemo(() => summary.map((r, i) => ({ idx: i + 1, MandarinPre: r.pre, MandarinPost: r.post, PerformanceAvg: Math.round(r.perfAvg) })), [summary]);

  function updateStudent(patch) {
    setStudents((prev) => prev.map((s) => (s.id === selectedId ? { ...s, ...patch } : s)));
  }

  function updateNested(path, value) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== selectedId) return s;
        const clone = structuredClone(s);
        let cur = clone;
        for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
        cur[path[path.length - 1]] = value;
        return clone;
      })
    );
  }

  function addStudent() {
    const ns = defaultStudent();
    setStudents((p) => [...p, ns]);
    setSelectedId(ns.id);
  }

  function removeSelected() {
    if (students.length <= 1) return;
    const idx = students.findIndex((s) => s.id === selectedId);
    const next = students[idx === 0 ? 1 : 0].id;
    setStudents((p) => p.filter((s) => s.id !== selectedId));
    setSelectedId(next);
  }

  function exportJSON() {
    downloadText(`trilift_data_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ students, fidelity, uiLang }, null, 2));
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed.students) && parsed.students.length) {
          setStudents(parsed.students);
          setSelectedId(parsed.students[0].id);
        }
        if (parsed.fidelity) setFidelity(parsed.fidelity);
        if (parsed.uiLang) setUiLang(parsed.uiLang);
      } catch {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function setRubricScore(artifactKey, dimKey, val) {
    updateNested(["rubricScores", artifactKey, dimKey], Number(val));
  }

  const rubricArtifactKeys = useMemo(
    () => [
      { key: "w3_zh_written", label: { en: "Week 3 — Written Summary (ZH)", id: "Minggu 3 — Written Summary (ZH)", zh: "第3周—中文书面摘要" } },
      { key: "w4_zh_video", label: { en: "Week 4 — Video Presentation (ZH)", id: "Minggu 4 — Video Presentasi (ZH)", zh: "第4周—中文汇报视频" } },
      { key: "w5_en_essay", label: { en: "Week 5 — Academic Essay (EN)", id: "Minggu 5 — Academic Essay (EN)", zh: "第5周—英文论证短文" } },
      { key: "w6_portfolio", label: { en: "Week 6 — Trilingual Portfolio", id: "Minggu 6 — Portofolio Trilingual", zh: "第6周—三语作品集" } },
    ],
    []
  );

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Languages className="h-6 w-6" />
              <h1 className="text-2xl font-semibold tracking-tight">{t("appTitle")}</h1>
              <Badge className="ml-2" variant="secondary">{t("badge")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border px-3 py-2">
              <span className="text-sm text-muted-foreground">{t("language")}</span>
              <Select value={uiLang} onValueChange={(v) => setUiLang(v)}>
                <SelectTrigger className="h-8 w-[150px] rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("langs.en")}</SelectItem>
                  <SelectItem value="id">{t("langs.id")}</SelectItem>
                  <SelectItem value="zh">{t("langs.zh")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="secondary" onClick={addStudent}>{t("buttons.addStudent")}</Button>
            <Button variant="outline" onClick={removeSelected}>{t("buttons.removeStudent")}</Button>
            <Button onClick={exportJSON}>{t("buttons.export")}</Button>
            <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer">
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])} />
              {t("buttons.import")}
            </label>
          </div>
        </header>

        <Tabs defaultValue="taskpack" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="taskpack" className="gap-2"><ClipboardList className="h-4 w-4" />{t("tabs.taskpack")}</TabsTrigger>
            <TabsTrigger value="students" className="gap-2"><GraduationCap className="h-4 w-4" />{t("tabs.students")}</TabsTrigger>
            <TabsTrigger value="rubric" className="gap-2"><NotebookPen className="h-4 w-4" />{t("tabs.rubric")}</TabsTrigger>
            <TabsTrigger value="test" className="gap-2"><FileText className="h-4 w-4" />{t("tabs.test")}</TabsTrigger>
            <TabsTrigger value="fidelity" className="gap-2"><ShieldCheck className="h-4 w-4" />{t("tabs.fidelity")}</TabsTrigger>
          </TabsList>

          <TabsContent value="taskpack" className="mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>{t("taskpack.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("taskpack.cols.week")}</TableHead>
                      <TableHead>{t("taskpack.cols.theme")}</TableHead>
                      <TableHead>{t("taskpack.cols.chain")}</TableHead>
                      <TableHead>{t("taskpack.cols.langFunc")}</TableHead>
                      <TableHead>{t("taskpack.cols.artifacts")}</TableHead>
                      <TableHead>{t("taskpack.cols.measure")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TASK_PACK.map((tt) => (
                      <TableRow key={tt.week}>
                        <TableCell className="font-medium">{tt.week}</TableCell>
                        <TableCell>{pickLang(tt.theme, uiLang)}</TableCell>
                        <TableCell className="max-w-[280px]">{pickLang(tt.chain, uiLang)}</TableCell>
                        <TableCell className="max-w-[320px]">
                          <div className="space-y-1 text-sm">
                            <div><Badge variant="outline">EN</Badge> {pickLang(tt.languageFunctions.EN, uiLang)}</div>
                            <div><Badge variant="outline">ID</Badge> {pickLang(tt.languageFunctions.ID, uiLang)}</div>
                            <div><Badge variant="outline">ZH</Badge> {pickLang(tt.languageFunctions.ZH, uiLang)}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {tt.artifacts.map((a) => (
                              <Badge key={pickLang(a, "en") + tt.week} variant="secondary">{pickLang(a, uiLang)}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pickLang(tt.measurementLink, uiLang)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl md:col-span-1">
                <CardHeader>
                  <CardTitle>{t("students.listTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {students.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${s.id === selectedId ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      <div className="font-medium">{s.name || t("common.unnamed")}</div>
                      <div className="text-xs text-muted-foreground">{t("students.className")}: {s.className || "-"}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl md:col-span-2">
                <CardHeader>
                  <CardTitle>{t("students.profileTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">{t("students.name")}</label>
                      <Input value={selected.name} onChange={(e) => updateStudent({ name: e.target.value })} placeholder={t("students.name")} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t("students.className")}</label>
                      <Input value={selected.className} onChange={(e) => updateStudent({ className: e.target.value })} placeholder={t("common.placeholderClass")} />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-3 md:grid-cols-3">
                    <ScoreBox t={t} title={uiLang === "zh" ? "中文 (ZH)" : uiLang === "en" ? "Mandarin (ZH)" : "Mandarin (ZH)"}
                      pre={selected.baseline.zh} post={selected.post.zh}
                      onPre={(v) => updateNested(["baseline", "zh"], clampScore(v))}
                      onPost={(v) => updateNested(["post", "zh"], clampScore(v))}
                    />
                    <ScoreBox t={t} title={uiLang === "zh" ? "英语 (EN)" : uiLang === "en" ? "English (EN)" : "English (EN)"}
                      pre={selected.baseline.en} post={selected.post.en}
                      onPre={(v) => updateNested(["baseline", "en"], clampScore(v))}
                      onPost={(v) => updateNested(["post", "en"], clampScore(v))}
                    />
                    <ScoreBox t={t} title={uiLang === "zh" ? "印尼语 (ID)" : uiLang === "en" ? "Indonesian (ID)" : "Indonesia (ID)"}
                      pre={selected.baseline.id} post={selected.post.id}
                      onPre={(v) => updateNested(["baseline", "id"], clampScore(v))}
                      onPost={(v) => updateNested(["post", "id"], clampScore(v))}
                    />
                  </div>

                  <Separator />

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">{t("students.artifactTitle")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(selected.artifacts).map(([k, v]) => (
                        <div key={k} className="grid gap-2 rounded-xl border p-3 md:grid-cols-3">
                          <div className="md:col-span-1">
                            <div className="text-sm font-medium">{prettyArtifactKey(k, uiLang)}</div>
                            <div className="text-xs text-muted-foreground">{t("students.artifactHint")}</div>
                          </div>
                          <div className="md:col-span-1">
                            <Input value={v.link} onChange={(e) => updateNested(["artifacts", k, "link"], e.target.value)} placeholder="Link / ID" />
                          </div>
                          <div className="md:col-span-1">
                            <Input value={v.notes} onChange={(e) => updateNested(["artifacts", k, "notes"], e.target.value)} placeholder={uiLang === "zh" ? "备注" : uiLang === "en" ? "Notes" : "Catatan"} />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl mt-4">
              <CardHeader>
                <CardTitle>{t("students.classSummary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="idx" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="MandarinPre" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="MandarinPost" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="PerformanceAvg" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("students.table.student")}</TableHead>
                        <TableHead>{t("students.table.cls")}</TableHead>
                        <TableHead>{t("students.table.zhPre")}</TableHead>
                        <TableHead>{t("students.table.zhPost")}</TableHead>
                        <TableHead>{t("students.table.gain")}</TableHead>
                        <TableHead>{t("students.table.perf")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summary.map((r) => (
                        <TableRow key={r.name + r.className}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell>{r.className}</TableCell>
                          <TableCell>{r.pre}</TableCell>
                          <TableCell>{r.post}</TableCell>
                          <TableCell>{r.gain}</TableCell>
                          <TableCell>{Math.round(r.perfAvg)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rubric" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl md:col-span-1">
                <CardHeader>
                  <CardTitle>{t("rubric.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(RUBRIC).map(([k, v]) => (
                    <div key={k} className="rounded-xl border p-3">
                      <div className="font-medium">{pickLang(v.name, uiLang)}</div>
                      <div className="mt-2 space-y-2 text-sm">
                        {[4, 3, 2, 1].map((lvl) => (
                          <div key={lvl} className="flex gap-2">
                            <Badge variant="secondary">{lvl}</Badge>
                            <div className="text-muted-foreground">{pickLang(v.levels[lvl], uiLang)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl md:col-span-1">
                <CardHeader>
                  <CardTitle>{t("rubric.inputTitle")} — {selected?.name || t("common.unnamed")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">{t("rubric.raterA")}</label>
                      <Input value={selected.rubricScores.w6_portfolio.raterA} onChange={(e) => updateNested(["rubricScores", "w6_portfolio", "raterA"], e.target.value)} placeholder={t("rubric.raterA")} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t("rubric.raterB")}</label>
                      <Input value={selected.rubricScores.w6_portfolio.raterB} onChange={(e) => updateNested(["rubricScores", "w6_portfolio", "raterB"], e.target.value)} placeholder={t("rubric.raterB")} />
                    </div>
                  </div>

                  <Separator />

                  {rubricArtifactKeys.map((a) => {
                    const sc = selected.rubricScores[a.key];
                    const total = scoreTotalRubric(sc);
                    return (
                      <div key={a.key} className="rounded-xl border p-3 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-medium">{pickLang(a.label, uiLang)}</div>
                          <Badge variant={total ? "default" : "secondary"}>{t("rubric.total")}: {total}/20</Badge>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          {(["content", "en", "id", "zh", "mediation"]).map((dim) => (
                            <div key={dim} className="space-y-1">
                              <label className="text-sm text-muted-foreground">{pickLang(RUBRIC[dim].name, uiLang)}</label>
                              <Select value={String(sc[dim] || 0)} onValueChange={(v) => setRubricScore(a.key, dim, v)}>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder={t("rubric.chooseScore")} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">{t("select.none")}</SelectItem>
                                  <SelectItem value="1">{t("select.one")}</SelectItem>
                                  <SelectItem value="2">{t("select.two")}</SelectItem>
                                  <SelectItem value="3">{t("select.three")}</SelectItem>
                                  <SelectItem value="4">{t("select.four")}</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">{t("rubric.guideBtn")}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{t("rubric.guideTitle")}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>{t("rubric.guideP1")}</p>
                        <p>{t("rubric.guideP2")}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test" className="mt-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>{t("test.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("test.cols.comp")}</TableHead>
                      <TableHead>{t("test.cols.task")}</TableHead>
                      <TableHead>{t("test.cols.func")}</TableHead>
                      <TableHead>{t("test.cols.score")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MANDARIN_TEST_BLUEPRINT.map((r, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{pickLang(r.part, uiLang)}</TableCell>
                        <TableCell>{pickLang(r.task, uiLang)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pickLang(r.func, uiLang)}</TableCell>
                        <TableCell>{r.max}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">{t("test.writingTitle")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>根据所给材料，用120–150个汉字概括主要内容，并说明你对这个问题的看法。</p>
                      <p>{uiLang === "zh" ? "评分：内容准确性、摘要结构、HSK3词汇与语法、连贯性。" : uiLang === "en" ? "Scoring: content accuracy, summary structure, HSK 3 vocabulary/grammar, coherence." : "Penilaian: akurasi isi, struktur ringkasan, kosakata/tata bahasa HSK 3, koherensi."}</p>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-base">{t("test.speakingTitle")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p>请用2–3分钟介绍一个你学习过的全球问题，并回答老师的两个问题。</p>
                      <p>{uiLang === "zh" ? "评分：结构、HSK3准确性、流利度、问答回应。" : uiLang === "en" ? "Scoring: structure, HSK 3 accuracy, fluency, Q&A responses." : "Penilaian: struktur paparan, ketepatan HSK 3, kelancaran, respons Q&A."}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base">{t("test.adminTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    {t("test.admin").map((x) => (
                      <label key={x} className="flex items-start gap-2 rounded-xl border p-3">
                        <Checkbox />
                        <span className="text-sm text-muted-foreground">{x}</span>
                      </label>
                    ))}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fidelity" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>{t("fidelity.title")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-muted-foreground">{t("fidelity.date")}</label>
                      <Input value={fidelity.sessionDate} onChange={(e) => setFidelity((p) => ({ ...p, sessionDate: e.target.value }))} placeholder="YYYY-MM-DD" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t("fidelity.teacher")}</label>
                      <Input value={fidelity.teacher} onChange={(e) => setFidelity((p) => ({ ...p, teacher: e.target.value }))} placeholder={t("fidelity.teacher")} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">{t("fidelity.cls")}</label>
                      <Input value={fidelity.className} onChange={(e) => setFidelity((p) => ({ ...p, className: e.target.value }))} placeholder={t("common.placeholderClass")} />
                    </div>
                    <label className="flex items-center gap-2 rounded-xl border p-3">
                      <Checkbox checked={fidelity.techUse} onCheckedChange={(v) => setFidelity((p) => ({ ...p, techUse: Boolean(v) }))} />
                      <span className="text-sm text-muted-foreground">{t("fidelity.techUse")}</span>
                    </label>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {FIDELITY_ITEMS.filter((x) => x.key !== "techUse").map((it) => (
                      <div key={it.key} className="rounded-xl border p-3">
                        <div className="text-sm font-medium">{pickLang(it.label, uiLang)}</div>
                        <div className="mt-2">
                          <Select value={String(fidelity.ratings[it.key] || 0)} onValueChange={(v) => setFidelity((p) => ({ ...p, ratings: { ...p.ratings, [it.key]: Number(v) } }))}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder={uiLang === "zh" ? "请选择（1–4）" : uiLang === "en" ? "Select (1–4)" : "Pilih (1–4)"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">{t("select.none")}</SelectItem>
                              <SelectItem value="1">{t("select.one")}</SelectItem>
                              <SelectItem value="2">{t("select.two")}</SelectItem>
                              <SelectItem value="3">{t("select.three")}</SelectItem>
                              <SelectItem value="4">{t("select.four")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm text-muted-foreground">{t("fidelity.notes")}</label>
                    <Textarea value={fidelity.notes} onChange={(e) => setFidelity((p) => ({ ...p, notes: e.target.value }))} placeholder={uiLang === "zh" ? "记录：障碍、语言切换、参与度等" : uiLang === "en" ? "Notes: constraints, switching, engagement, etc." : "Hambatan, contoh alih-bahasa, keterlibatan siswa, dsb."} className="min-h-[120px]" />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setFidelity({
                          sessionDate: "",
                          teacher: "",
                          className: "",
                          techUse: false,
                          notes: "",
                          ratings: { designFit: 0, langIntegration: 0, authenticity: 0, teacherCollab: 0, timeFlow: 0 },
                        })
                      }
                    >
                      {t("fidelity.reset")}
                    </Button>
                    <Button onClick={() => downloadText("fidelity_session.json", JSON.stringify(fidelity, null, 2))}>{t("fidelity.download")}</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>{t("fidelity.protocolTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><span className="font-medium text-foreground">1)</span> {t("fidelity.protocol.a")}</p>
                  <p><span className="font-medium text-foreground">2)</span> {t("fidelity.protocol.b")}</p>
                  <p><span className="font-medium text-foreground">3)</span> {t("fidelity.protocol.c")}</p>
                  <p><span className="font-medium text-foreground">4)</span> {t("fidelity.protocol.d")}</p>
                  <p><span className="font-medium text-foreground">5)</span> {t("fidelity.protocol.e")}</p>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">{t("fidelity.exBtn")}</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t("fidelity.exTitle")}</DialogTitle>
                      </DialogHeader>
                      <pre className="whitespace-pre-wrap rounded-xl border p-3 text-xs text-muted-foreground">{exampleObservation(uiLang)}</pre>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="pb-8 text-xs text-muted-foreground">
          <Separator className="mb-3" />
          {t("footer")}
        </footer>
      </div>
    </div>
  );
}

function ScoreBox({ t, title, pre, post, onPre, onPost }) {
  const gain = clampScore(post) - clampScore(pre);
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">{t("score.pre")}</label>
            <Input value={pre} onChange={(e) => onPre(e.target.value)} inputMode="numeric" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{t("score.post")}</label>
            <Input value={post} onChange={(e) => onPost(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border p-3">
          <div className="text-sm text-muted-foreground">{t("score.gain")}</div>
          <div className="font-medium">{gain}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function prettyArtifactKey(key, uiLang) {
  const map = {
    w1_en_readlog: { en: "Week 1 — Reading Log (EN)", id: "Minggu 1 — Reading Log (EN)", zh: "第1周—阅读日志（英文）" },
    w1_id_summary: { en: "Week 1 — Concept Summary (ID)", id: "Minggu 1 — Ringkasan Konsep (ID)", zh: "第1周—概念摘要（印尼语）" },
    w2_id_brief: { en: "Week 2 — Concept Brief (ID)", id: "Minggu 2 — Concept Brief (ID)", zh: "第2周—概念简报（印尼语）" },
    w3_zh_written: { en: "Week 3 — Written Summary (ZH)", id: "Minggu 3 — Written Summary (ZH)", zh: "第3周—中文书面摘要" },
    w4_zh_video: { en: "Week 4 — Video Presentation (ZH)", id: "Minggu 4 — Video Presentasi (ZH)", zh: "第4周—中文汇报视频" },
    w5_en_essay: { en: "Week 5 — Academic Essay (EN)", id: "Minggu 5 — Academic Essay (EN)", zh: "第5周—英文论证短文" },
    w6_portfolio: { en: "Week 6 — Trilingual Portfolio + Reflection", id: "Minggu 6 — Portofolio Trilingual + Refleksi", zh: "第6周—三语作品集 + 反思" },
  };
  return pickLang(map[key], uiLang) || key;
}

function exampleObservation(uiLang) {
  if (uiLang === "zh") {
    return `日期：
班级：
观察者：

1）本节课概述（3–5句）：

2）三语整合证据：
- EN：
- ID：
- ZH：
- 中介：

3）学生参与：

4）教师支架与反馈：

5）困难与改进建议：`;
  }
  if (uiLang === "en") {
    return `Date:
Class:
Observer:

1) Session summary (3–5 sentences):

2) Evidence of language integration:
- EN:
- ID:
- ZH:
- Mediation:

3) Student engagement:

4) Teacher scaffolding & feedback:

5) Issues & recommendations:`;
  }
  return `Tanggal:
Kelas:
Observer:

1) Ringkasan sesi (3–5 kalimat):

2) Bukti integrasi bahasa:
- EN:
- ID:
- ZH:
- Mediasi:

3) Keterlibatan siswa:

4) Scaffolding & feedback guru:

5) Kendala & rekomendasi perbaikan:`;
}
