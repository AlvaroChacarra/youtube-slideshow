import { useEffect, useState } from "react";

export function MathFormula({ expression, label }: { expression: string; label: string }) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    let active = true;
    void import("katex").then(({ default: katex }) => {
      if (active) setHtml(katex.renderToString(expression, { displayMode: true, throwOnError: false, output: "htmlAndMathml" }));
    });
    return () => { active = false; };
  }, [expression]);
  return <div className="formula" role="math" aria-label={label} dangerouslySetInnerHTML={{ __html: html || expression }} />;
}
