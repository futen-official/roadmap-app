"use client";

import React, { useMemo, useState } from "react";

type Answer = string;

type ResultType = "A" | "B" | "C";

type Question = {
  id: string;
  text: string;
  help?: string;
  choices: { label: string; value: Answer }[];
};

const QUESTIONS: Question[] = [
  {
    id: "q1_rent",
    text: "今月分の家賃（または宿泊費）は、支払い済みですか？",
    help: "未払い・支払いが難しい場合は早めに相談を。",
    choices: [
      { label: "支払い済み", value: "paid" },
      { label: "未払い / 支払いが難しい", value: "unpaid" },
      { label: "住居がない", value: "no_home" },
    ],
  },
  {
    id: "q2_food",
    text: "食費・生活費（手元の現金/残高）は、あと何日くらい持ちそう？",
    help: "ざっくりでOK。今日〜数日の見通しが大事。",
    choices: [
      { label: "3日未満", value: "lt3" },
      { label: "1週間くらい", value: "wk1" },
      { label: "それ以上", value: "more" },
    ],
  },
  {
    id: "q3_income",
    text: "現在、継続的な収入はありますか？",
    help: "単発/一時的な収入は「ほぼない」に寄せてOK。",
    choices: [
      { label: "ほぼない", value: "no" },
      { label: "ある（少しでも継続している）", value: "yes" },
    ],
  },
  {
    id: "q4_savings",
    text: "預貯金（口座残高の合計）はどれくらい？",
    help: "目安でOK。ここは自治体判断に影響しやすい。",
    choices: [
      { label: "5万円未満", value: "lt5" },
      { label: "5〜20万円", value: "5to20" },
      { label: "20万円以上", value: "ge20" },
    ],
  },
  {
    id: "q5_living",
    text: "現在の住まいに一番近いのは？",
    choices: [
      { label: "賃貸（自分名義/同居含む）", value: "rent" },
      { label: "持家（本人または同居者）", value: "own" },
      { label: "ネットカフェ等 / 友人宅 / 不安定", value: "other" },
    ],
  },
  {
    id: "q6_cohabit",
    text: "同居している人はいますか？",
    help: "同居があると「世帯」の扱いが絡みやすい。",
    choices: [
      { label: "いる", value: "yes" },
      { label: "いない", value: "no" },
    ],
  },
  {
    id: "q7_car",
    text: "車・バイクを所有していますか？",
    help: "地域差・事情で扱いが変わることがある。",
    choices: [
      { label: "ある", value: "yes" },
      { label: "ない", value: "no" },
    ],
  },
  {
    id: "q8_work",
    text: "現時点で、すぐ働くのは難しいですか？",
    help: "体調・事情があれば「難しい」でOK。",
    choices: [
      { label: "難しい（体調/事情で）", value: "hard" },
      { label: "働ける見込みはある", value: "ok" },
      { label: "分からない", value: "unknown" },
    ],
  },
  {
    id: "q9_med",
    text: "通院・治療・服薬などはありますか？",
    help: "医療があると相談の論点が整理しやすいことも。",
    choices: [
      { label: "ある", value: "yes" },
      { label: "ない", value: "no" },
    ],
  },
  {
    id: "q10_support",
    text: "金銭的に頼れる家族・知人はいますか？",
    help: "頼れる/頼れないは主観でOK。実際に頼れるかが大事。",
    choices: [
      { label: "いる（頼れる可能性あり）", value: "yes" },
      { label: "いない（実質頼れない）", value: "no" },
    ],
  },
];

function judgeType(answers: Record<string, Answer>): ResultType {
  const rent = answers["q1_rent"];
  const food = answers["q2_food"];
  const living = answers["q5_living"];
  const cohabit = answers["q6_cohabit"];
  const car = answers["q7_car"];
  const savings = answers["q4_savings"];
  const income = answers["q3_income"];
  const support = answers["q10_support"];

  // A：緊急（生活が数日で破綻しそう）
  const isEmergency =
    rent === "unpaid" ||
    rent === "no_home" ||
    food === "lt3" ||
    living === "other"; // 住まい不安定は緊急寄り
  if (isEmergency) return "A";

  // C：個別確認が多い（資産/世帯/所有/支援などで論点が増えやすい）
  const isComplex =
    cohabit === "yes" ||
    car === "yes" ||
    savings === "ge20" ||
    living === "own" ||
    income === "yes" ||
    support === "yes";
  if (isComplex) return "C";

  // B：落ち着いて準備を進めやすい
  return "B";
}

type ResultContent = {
  title: string;
  summary: string;
  today: string[];
  bring: string[];
  script: string[];
  notes: string[];
};

function resultContent(type: ResultType): ResultContent {
  if (type === "A") {
    return {
      title: "タイプA：緊急対応（今日〜数日が勝負）",
      summary:
        "生活が短期間で破綻しやすい状態です。まずは“今日・明日の安全”を優先して、できるだけ早く福祉窓口につなげましょう。",
      today: [
        "福祉窓口に電話して「生活保護の相談（できれば申請の意思も）」を伝え、予約を取る",
        "手元の現金・口座残高・食料の見込みをメモする（ざっくりでOK）",
        "身分証・通帳・印鑑の有無を確認（なくても相談は可）",
      ],
      bring: [
        "本人確認書類（運転免許証/マイナンバーカード等）※なくても相談可",
        "通帳・キャッシュカード（口座がある場合）",
        "印鑑（あれば）",
        "家計メモ（現金・残高・家賃・食費の見込み）",
        "医療関係（診察券/お薬手帳、あれば）",
      ],
      script: [
        "「生活が維持できず、早急に生活保護の相談と申請について伺いたいです。」",
        "「今の手元資金と生活の見通しは〇〇で、数日以内に厳しくなります。」",
        "「必要な持ち物と、今日できる手続きを教えてください。」",
      ],
      notes: [
        "我慢して限界まで行くほど、判断と行動が遅れやすい",
        "最終判断は自治体。ここは“準備と整理”を支援する目的",
      ],
    };
  }

  if (type === "C") {
    return {
      title: "タイプC：論点が多い（相談の仕方が重要）",
      summary:
        "検討は可能でも、資産・世帯・住居形態などで確認事項が増えやすい状態です。窓口では“結論を迫る”より、“扱いの確認”を軸に進めるのが安全です。",
      today: [
        "同居・資産・車・収入・支援の有無を1枚メモに整理する",
        "不安点（例：同居/車/持家/収入）を箇条書きにする",
        "相談時に「どう扱われるか」を確認する前提で予約を取る",
      ],
      bring: [
        "本人確認書類",
        "通帳（複数口座があるなら一覧でもOK）",
        "車・住居に関する資料（車検証/賃貸契約/名義が分かるもの、あれば）",
        "収入が分かるもの（給与明細/振込履歴、あれば）",
        "メモ（同居状況・支援の有無・困りごと）",
      ],
      script: [
        "「生活保護の相談をしたいのですが、同居（または車/持家/収入）の扱いが不安です。どう整理すればいいですか？」",
        "「結論ではなく、必要書類と確認事項を教えてください。」",
        "「申請の可否に関わるポイントを、今日の相談で整理したいです。」",
      ],
      notes: [
        "地域差・個別判断が出やすいので“確認の質”が結果を左右しやすい",
        "自己判断で諦めない（ただし無理に断定もしない）",
      ],
    };
  }

  return {
    title: "タイプB：準備して進めやすい（手続きが前に進みやすい）",
    summary:
      "状況の整理ができれば、落ち着いて相談・準備を進められる段階です。窓口での説明を短くまとめるとスムーズになります。",
    today: [
      "必要書類をリストアップする（身分証・通帳・家計メモ）",
      "相談予約を入れる（目安：1週間以内）",
      "状況説明を短文メモにする（家賃/収入/貯金/困りごと）",
    ],
    bring: [
      "本人確認書類",
      "通帳・キャッシュカード",
      "印鑑（あれば）",
      "家計メモ（家賃・光熱費・食費・残高）",
      "医療関係（あれば）",
    ],
    script: [
      "「生活が厳しくなってきたので、生活保護の相談をしたいです。必要な手順と持ち物を教えてください。」",
      "「現状は、収入〇〇、貯金〇〇、家賃〇〇で、今後の見通しが不安です。」",
      "「今日の相談で、次にやることを整理したいです。」",
    ],
    notes: [
      "準備不足が一番のつまずきポイント（だから“メモ”が効く）",
      "最終判断は自治体。ここは“準備と整理”の支援",
    ],
  };
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  const isDone = step >= QUESTIONS.length;

  const progressText = useMemo(() => {
    const answered = Math.min(step, QUESTIONS.length);
    return `${answered}/${QUESTIONS.length}`;
  }, [step]);

  const onPick = (qid: string, value: Answer) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setStep((s) => s + 1);
  };

  // 戻る：表示上のstepと削除対象をズラさないように安定化
  const onBack = () => {
    setStep((s) => {
      const nextStep = Math.max(0, s - 1);
      const prevQ = QUESTIONS[nextStep];
      if (prevQ) {
        setAnswers((a) => {
          const copy = { ...a };
          delete copy[prevQ.id];
          return copy;
        });
      }
      return nextStep;
    });
  };

  const onReset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <h1 style={styles.h1}>生活保護ナビ（試作）</h1>
        <p style={styles.sub}>
          1問ずつ答えるだけで、次にやることを整理します（目安：3分）
        </p>
      </header>

      <div style={styles.card}>
        {!isDone ? (
          <>
            <div style={styles.topRow}>
              <span style={styles.badge}>進捗 {progressText}</span>
              {step > 0 && (
                <button type="button" onClick={onBack} style={styles.linkBtn}>
                  ← ひとつ戻る
                </button>
              )}
            </div>

            <h2 style={styles.qTitle}>
              Q{step + 1}. {QUESTIONS[step].text}
            </h2>
            {QUESTIONS[step].help && (
              <p style={styles.help}>{QUESTIONS[step].help}</p>
            )}

            <div style={styles.choices}>
              {QUESTIONS[step].choices.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => onPick(QUESTIONS[step].id, c.value)}
                  style={styles.choiceBtn}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          (() => {
            const type = judgeType(answers);
            const r = resultContent(type);
            return (
              <>
                <div style={styles.topRow}>
                  <span style={styles.badge}>結果</span>
                  <button type="button" onClick={onReset} style={styles.linkBtn}>
                    もう一回やる
                  </button>
                </div>

                <h2 style={styles.resultTitle}>{r.title}</h2>
                <p style={styles.resultText}>{r.summary}</p>

                <div style={styles.section}>
                  <h3 style={styles.h3}>今日やること（3つ）</h3>
                  <ul style={styles.ul}>
                    {r.today.map((t) => (
                      <li key={t} style={styles.li}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.h3}>持ち物チェック</h3>
                  <ul style={styles.ul}>
                    {r.bring.map((t) => (
                      <li key={t} style={styles.li}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.h3}>相談時の一言テンプレ</h3>
                  <ul style={styles.ul}>
                    {r.script.map((t) => (
                      <li key={t} style={styles.li}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={styles.section}>
                  <h3 style={styles.h3}>注意点</h3>
                  <ul style={styles.ul}>
                    {r.notes.map((t) => (
                      <li key={t} style={styles.li}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            );
          })()
        )}
      </div>

      <p style={styles.foot}>
        ※本サイトは準備と整理を支援する目的です。最終判断は自治体が行います。不正受給の助長はしません。
      </p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    maxWidth: 720,
    margin: "40px auto",
    padding: 16,
    fontFamily: "system-ui",
    color: "#111",
    background: "#fff",
    minHeight: "100vh", 
  },
  header: { marginBottom: 16 },
  h1: { fontSize: 28, margin: 0 },
  sub: { marginTop: 6, opacity: 0.85 },
  card: { padding: 16, border: "1px solid #ddd", borderRadius: 14 },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    color: "#000",
    border: "1px solid #ddd",
    background: "#fafafa",
  },
  linkBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textDecoration: "underline",
    color: "#111",
  },
  qTitle: { fontSize: 18, marginTop: 16, marginBottom: 6 },
  help: { marginTop: 0, opacity: 0.8, lineHeight: 1.6 },
  choices: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 },
  choiceBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid #ccc",
    color: "#000",
    background: "white",
    cursor: "pointer",
  },
  resultTitle: { fontSize: 20, marginTop: 16, marginBottom: 8 },
  resultText: { marginTop: 0, lineHeight: 1.7 },
  section: { marginTop: 16, paddingTop: 12, borderTop: "1px solid #eee" },
  h3: { margin: 0, fontSize: 16 },
  ul: { marginTop: 10, marginBottom: 0, paddingLeft: 18 },
  li: { marginBottom: 6, lineHeight: 1.6 },
  foot: { marginTop: 16, fontSize: 12, opacity: 0.75 },
};
