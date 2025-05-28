const APIKEY = 'AIzaSyCVKOcABjfi9wap7dFm4QUgGyXGwifBjGI';
export async function fetchGeminiInsight(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${APIKEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '❌ 분석 실패';
}
