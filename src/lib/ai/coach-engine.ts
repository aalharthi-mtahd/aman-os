// src/lib/ai/coach-engine.ts
import type { SalesCoachInput, SalesCoachOutput } from '@/types'

interface ConversationPattern {
  keywords: string[]
  keywordsAr: string[]
  problemType: string
}

const CONVERSATION_PATTERNS: ConversationPattern[] = [
  {
    keywords: ['fee', 'price', 'expensive', 'cost', 'competitor', 'cheaper', '5.5%', 'percentage'],
    keywordsAr: ['رسوم', 'سعر', 'غالي', 'تكلفة', 'منافس', 'أرخص', '5.5'],
    problemType: 'price_objection',
  },
  {
    keywords: ['trust', 'scam', 'safe', 'secure', 'reliable', 'guarantee'],
    keywordsAr: ['ثقة', 'نصب', 'آمن', 'أمان', 'موثوق', 'ضمان'],
    problemType: 'trust_objection',
  },
  {
    keywords: ['need escrow', 'why need', 'dont need', 'without escrow', '20 years', 'always done'],
    keywordsAr: ['لماذا نحتاج', 'لا نحتاج', 'بدون ضمان', 'دائماً'],
    problemType: 'necessity_objection',
  },
  {
    keywords: ['court', 'legal', 'lawsuit', 'dispute', 'wrong'],
    keywordsAr: ['محكمة', 'قانوني', 'قضية', 'نزاع'],
    problemType: 'legal_objection',
  },
  {
    keywords: ['slow', 'complex', 'complicated', 'simple', 'process', 'steps'],
    keywordsAr: ['بطيء', 'معقد', 'تعقيد', 'بسيط', 'عملية', 'خطوات'],
    problemType: 'complexity_objection',
  },
]

const COACHING_RESPONSES: Record<string, Record<string, SalesCoachOutput>> = {
  price_objection: {
    en: {
      whatWentWrong: "You competed on price instead of anchoring on risk and value. Never let the client set the conversation frame as 'fee percentage vs competitor fee'. That is a race to the bottom you cannot win.",
      betterScript: "\"That 5.5% isn't a fee — it's insurance. The question isn't what Aman costs, it's what a failed deal costs. On a 200,000 SAR transaction, we're talking 11,000 SAR protection on a 200,000 SAR risk. What was your biggest payment dispute last year? How much did that cost you — in money, time, and relationships?\"",
      closingStrategy: "Anchor on the worst-case scenario, not the best-case. Ask for their single most painful payment experience. Once they articulate the pain, the fee becomes irrelevant. Then: 'So for the cost of one failed deal's headache, you get every deal protected for a year.'",
      nextStep: "Send a ROI calculator email showing: (1) their estimated annual transaction volume, (2) industry dispute rate of 3-5%, (3) average dispute cost (legal fees + time + opportunity cost), (4) Aman annual fee. Let the math close for you. Follow up in 48 hours.",
      language: 'en',
    },
    ar: {
      whatWentWrong: 'تنافست على السعر بدلاً من تأطير المحادثة حول المخاطر والقيمة. لا تدع العميل يحدد إطار المحادثة كـ"نسبة الرسوم مقابل المنافس". هذا سباق نحو القاع لن تفوز فيه.',
      betterScript: '"هذه الـ5.5% ليست رسوماً — هي تأمين. السؤال ليس كم تكلف أمان، بل كم تكلف صفقة فاشلة. على عملية بـ200,000 ريال، نتحدث عن حماية 11,000 ريال على مخاطرة 200,000 ريال. ما أكبر نزاع مالي واجهته العام الماضي؟ كم كلفك — بالمال والوقت والعلاقات؟"',
      closingStrategy: 'ضع الإطار على السيناريو الأسوأ، ليس الأفضل. اسأل عن أصعب تجربة دفع مروا بها. حين يعبّرون عن الألم، تصبح الرسوم غير ذات صلة. ثم: "مقابل تكلفة صداع صفقة فاشلة واحدة، تحصل على حماية كل صفقاتك لسنة كاملة."',
      nextStep: 'أرسل بريداً إلكترونياً بحاسبة العائد على الاستثمار تُظهر: (1) حجم معاملاتهم السنوي المقدر، (2) معدل النزاعات في القطاع 3-5%، (3) متوسط تكلفة النزاع (رسوم قانونية + وقت + تكلفة الفرصة)، (4) رسوم أمان السنوية. دع الأرقام تُغلق الصفقة. متابعة خلال 48 ساعة.',
      language: 'ar',
    },
  },
  trust_objection: {
    en: {
      whatWentWrong: "You tried to build trust with words instead of proof. Trust is built with evidence, social proof, and third-party validation — not with your own assurances.",
      betterScript: "\"Absolutely valid concern. Let me show you instead of tell you. Here are 3 transactions from this week — you can see the fund movement, the timeline, and the dispute resolution log. We're regulated by [authority], audited quarterly, and have processed over 7,000 transactions this month alone with zero fund loss incidents.\"",
      closingStrategy: "Offer a 'trust trial': propose they run their next low-value transaction through Aman (under 10,000 SAR). Once they experience the process end-to-end — the SMS confirmations, the fund holds, the release mechanism — trust builds itself.",
      nextStep: "Send reference contact (with permission) of a similar-sized client in their industry. Peer validation is 10x more powerful than your pitch. If no reference available, send the regulatory registration certificate and recent audit summary.",
      language: 'en',
    },
    ar: {
      whatWentWrong: 'حاولت بناء الثقة بالكلام بدلاً من الإثبات. الثقة تُبنى بالأدلة والإثبات الاجتماعي والتحقق من طرف ثالث — ليس بضمانات الشركة.',
      betterScript: '"قلق مشروع تماماً. دعني أريك بدلاً من أن أخبرك. إليك 3 عمليات من هذا الأسبوع — يمكنك رؤية حركة الأموال والجدول الزمني وسجل حل النزاعات. نحن مرخصون من [الجهة]، مدققون ربع سنوياً، ومعالجة أكثر من 7,000 عملية هذا الشهر وحده بدون حادثة خسارة أموال واحدة."',
      closingStrategy: 'اقترح "تجربة الثقة": اقترح تشغيل عملية منخفضة القيمة التالية عبر أمان (أقل من 10,000 ريال). بمجرد تجربتهم للعملية من البداية إلى النهاية — تأكيدات الرسائل، الاحتجاز، آلية الإفراج — تتبنى الثقة نفسها.',
      nextStep: 'أرسل جهة اتصال مرجعية (بإذن) لعميل مماثل الحجم في قطاعهم. التحقق من الأقران أقوى 10 مرات من عرضك. إذا لم يكن هناك مرجع، أرسل شهادة التسجيل التنظيمي وملخص التدقيق الأخير.',
      language: 'ar',
    },
  },
  necessity_objection: {
    en: {
      whatWentWrong: "You defended the product instead of agreeing with them and reframing. When someone says 'we don't need it', arguing creates resistance. Agreeing first disarms them.",
      betterScript: "\"You're right — you've done fine without it for 20 years. Most of our best clients said the same thing... right up until the deal that went wrong. I'm not here to change how you do business. I just want to ask: what's your current process when a buyer receives goods but claims they're defective and refuses to pay?\"",
      closingStrategy: "The 'what if' close: 'What's your plan when a 500,000 SAR deal goes sideways and the other party disappears?' Don't answer it — let them answer it. The gap between their answer and 'we have Aman' is your close.",
      nextStep: "Share a 2-page case study of a business similar to theirs that got burned on a deal WITHOUT escrow. Concrete story, concrete numbers, concrete outcome. Then: 'This is exactly who we built Aman for.'",
      language: 'en',
    },
    ar: {
      whatWentWrong: 'دافعت عن المنتج بدلاً من الموافقة معهم وإعادة التأطير. حين يقول أحدهم "لا نحتاجه"، الجدال يخلق مقاومة. الموافقة أولاً تنزع السلاح.',
      betterScript: '"أنت محق — عملتم بشكل جيد بدونه 20 سنة. معظم عملائنا الأفضل قالوا الشيء نفسه... حتى الصفقة التي سارت بشكل خاطئ. لست هنا لأغير طريقة عملكم. أريد فقط أن أسأل: ما إجراءكم الحالي عندما يستلم المشتري البضاعة لكنه يدّعي أنها معيبة ويرفض الدفع؟"',
      closingStrategy: 'إغلاق "ماذا لو": "ما خطتك عندما تسوء صفقة بـ500,000 ريال والطرف الآخر يختفي؟" لا تجب — دعهم يجيبون. الفجوة بين إجابتهم و"لدينا أمان" هي نقطة الإغلاق.',
      nextStep: 'شارك دراسة حالة من صفحتين لشركة مشابهة لهم خسرت في صفقة بدون ضمان. قصة ملموسة، أرقام ملموسة، نتيجة ملموسة. ثم: "هذا بالضبط من بنينا أمان من أجله."',
      language: 'ar',
    },
  },
  legal_objection: {
    en: {
      whatWentWrong: "You let them believe litigation is a viable alternative to escrow. It's not — and you need to expose that with real numbers before they leave the conversation.",
      betterScript: "\"Courts are absolutely an option. Just so you have the full picture: the average commercial dispute in KSA takes 18-36 months to resolve and costs 8-15% of the disputed amount in legal fees alone — plus your time, your team's time, and the stress. Aman disputes resolve in 2-3 days. Which sounds like a better use of your resources?\"",
      closingStrategy: "The comparison close: Write two columns on paper (or share screen): Column A = Aman dispute process (timeline, cost, certainty). Column B = Court process (timeline, cost, uncertainty). Let them see it visually.",
      nextStep: "Send a one-pager: 'Aman vs Court: A Decision Matrix'. Include real average timelines and costs from public court data. Close with: 'We charge 5.5% to make Column B irrelevant.'",
      language: 'en',
    },
    ar: {
      whatWentWrong: 'تركتهم يعتقدون أن التقاضي بديل مجدي للضمان. إنه ليس كذلك — وتحتاج لكشف ذلك بأرقام حقيقية قبل مغادرتهم المحادثة.',
      betterScript: '"المحاكم خيار بالتأكيد. فقط لتكتمل الصورة: متوسط النزاع التجاري في المملكة يستغرق 18-36 شهراً للحل ويكلف 8-15% من المبلغ المتنازع عليه في رسوم قانونية وحدها — بالإضافة لوقتك ووقت فريقك والضغط. نزاعات أمان تُحل في 2-3 أيام. أيهما يبدو استخداماً أفضل لمواردك؟"',
      closingStrategy: 'إغلاق المقارنة: اكتب عمودين (أو شارك الشاشة): عمود A = إجراء نزاع أمان (الجدول الزمني، التكلفة، اليقين). عمود B = إجراء المحكمة (الجدول الزمني، التكلفة، عدم اليقين). دعهم يرونه بصرياً.',
      nextStep: 'أرسل صفحة واحدة: "أمان مقابل المحكمة: مصفوفة القرار". تضمّن متوسطات حقيقية من بيانات المحاكم العامة. أختم بـ: "نحن نأخذ 5.5% لجعل العمود B غير ذي صلة."',
      language: 'ar',
    },
  },
  complexity_objection: {
    en: {
      whatWentWrong: "You explained features instead of demonstrating simplicity. Complexity objections need live demos, not descriptions.",
      betterScript: "\"Fair point — let me show you how a transaction actually works. [Pull up phone] Buyer initiates, we hold funds in 30 seconds. Seller delivers, buyer confirms, funds release. That's it. Three steps, 30 seconds each. Would you like me to walk through it on a real transaction right now?\"",
      closingStrategy: "The live demo close: Do a test transaction with them ON THE CALL/IN THE MEETING using their phone. Real experience destroys complexity perception 100% of the time.",
      nextStep: "Schedule a 20-minute onboarding session where you walk their ops team through the first transaction. Remove all friction from their side. Make the first experience perfect.",
      language: 'en',
    },
    ar: {
      whatWentWrong: 'شرحت المميزات بدلاً من إثبات البساطة. اعتراضات التعقيد تحتاج عروضاً حية، ليس أوصافاً.',
      betterScript: '"نقطة وجيهة — دعني أريك كيف تعمل العملية فعلياً. [أخرج الهاتف] المشتري يبدأ، نحتجز الأموال في 30 ثانية. البائع يسلّم، المشتري يؤكد، الأموال تُفرج. هذا كل شيء. ثلاث خطوات، 30 ثانية لكل منها. هل تريد أن أشرح على عملية حقيقية الآن؟"',
      closingStrategy: 'إغلاق العرض الحي: قم بعملية تجريبية معهم أثناء الاتصال/الاجتماع باستخدام هاتفهم. التجربة الحقيقية تدمر تصور التعقيد 100% من الوقت.',
      nextStep: 'جدول جلسة تأهيل 20 دقيقة تقود فيها فريقهم التشغيلي خلال العملية الأولى. أزل كل احتكاك من جانبهم. اجعل التجربة الأولى مثالية.',
      language: 'ar',
    },
  },
}

function detectPattern(conversation: string, language: string): string {
  const lower = conversation.toLowerCase()
  const isAr = language === 'ar'

  for (const pattern of CONVERSATION_PATTERNS) {
    const keywords = isAr ? pattern.keywordsAr : pattern.keywords
    const hasMatch = keywords.some((kw) => lower.includes(kw.toLowerCase()))
    if (hasMatch) return pattern.problemType
  }

  // Default to price objection as most common
  return 'price_objection'
}

export function analyzeConversation(input: SalesCoachInput): SalesCoachOutput {
  const patternType = detectPattern(input.conversation, input.language)
  const responses = COACHING_RESPONSES[patternType]

  if (!responses) {
    return COACHING_RESPONSES.price_objection[input.language] || COACHING_RESPONSES.price_objection.en
  }

  return responses[input.language] || responses.en
}

export function generateSimulationOpener(language: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): string {
  const openers = {
    en: {
      easy: "We've heard about Aman. Our finance team wants to understand the fee structure before we commit to anything.",
      medium: "That 5.5% fee is way too high. Your competitor charges 3% and we've been in business 20 years without needing escrow at all.",
      hard: "Look, we had a bad experience with an escrow service two years ago. We lost money and time. What makes you different, and why should I trust you with our transactions?",
    },
    ar: {
      easy: "سمعنا عن أمان. فريقنا المالي يريد فهم هيكل الرسوم قبل أي التزام.",
      medium: "رسوم 5.5% مرتفعة جداً. منافسكم يأخذ 3% ونحن نعمل في المجال 20 سنة بدون ضمان أمانة.",
      hard: "انظر، مررنا بتجربة سيئة مع خدمة ضمان قبل سنتين. خسرنا مالاً ووقتاً. ما الذي يجعلكم مختلفين ولماذا أثق بكم بعملياتنا؟",
    },
  }

  const lang = language === 'ar' ? 'ar' : 'en'
  return openers[lang][difficulty]
}
