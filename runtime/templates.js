const join = (values) => values.join(" ");

function stateAttrs({ show, primary = [], muted = [], motionId, geometryId, persistentId, textId }) {
  return [
    `data-visible-holds="${join(show)}"`,
    primary.length ? `data-primary-holds="${join(primary)}"` : "",
    muted.length ? `data-muted-holds="${join(muted)}"` : "",
    motionId ? `data-motion-id="${motionId}"` : "",
    geometryId ? `data-geometry-id="${geometryId}"` : "",
    persistentId ? `data-persistent-id="${persistentId}"` : "",
    textId ? `data-text-id="${textId}"` : ""
  ].filter(Boolean).join(" ");
}

const iconBank = `
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M8 38h32M12 35V20m8 15V20m8 15V20m8 15V20M8 17h32L24 7Z"/>
  </svg>`;

function baselineSlide02() {
  const all = ["s2-b1", "s2-b2", "s2-b3"];
  const callouts = ["s2-b2", "s2-b3"];
  return `
    <svg class="baseline-svg" viewBox="0 0 1600 900" role="img" aria-labelledby="baseline-s2-title baseline-s2-desc">
      <title id="baseline-s2-title">Anatomía de un bono a través de un ejemplo</title>
      <desc id="baseline-s2-desc">Certificado central con siete callouts y timeline de cash flows.</desc>
      <defs>
        <linearGradient id="bl-s2-bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#031427"/><stop offset="1" stop-color="#020d1a"/></linearGradient>
        <linearGradient id="bl-s2-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4f1e7"/><stop offset=".55" stop-color="#dfe2dc"/><stop offset="1" stop-color="#f7f4ea"/></linearGradient>
        <pattern id="bl-s2-pattern" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0 14Q7 0 14 14t14 0M14 0Q28 7 14 14T14 28" fill="none" stroke="#5b8e92" stroke-width=".7" opacity=".2"/></pattern>
        <marker id="bl-s2-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#48c4c5"/></marker>
      </defs>
      <rect width="1600" height="900" fill="url(#bl-s2-bg)"/>
      <g class="stateful" ${stateAttrs({ show: all, motionId: "bl-s2-header" })}>
        <text x="800" y="70" text-anchor="middle" class="bl-title" font-family="Georgia, serif">Anatomía de un bono a través de un ejemplo</text>
        <text x="800" y="109" text-anchor="middle" class="bl-subtitle">Bono a 5 años, cupón 4%, precio 100 € y valor nominal 100 €</text>
      </g>
      <g class="stateful" ${stateAttrs({ show: all, primary: ["s2-b1", "s2-b2", "s2-b3"], motionId: "bond-certificate", geometryId: "bl-s2-certificate", persistentId: "bond-certificate" })} transform="translate(505 155)">
        <rect width="590" height="390" rx="9" fill="#9bb9ba" opacity=".36"/>
        <rect x="13" y="13" width="564" height="364" rx="6" fill="url(#bl-s2-paper)" stroke="#7da2a2" stroke-width="2"/>
        <rect x="28" y="28" width="534" height="334" rx="4" fill="url(#bl-s2-pattern)" stroke="#567c80"/>
        <circle cx="295" cy="64" r="30" fill="#e6e8df" stroke="#80908c"/>
        <path d="M278 72h34M282 70V56m8 14V56m8 14V56m9 14V56m-29-3h34l-17-13Z" fill="none" stroke="#213743" stroke-width="2"/>
        <text x="295" y="119" text-anchor="middle" fill="#142531" font-family="Georgia, serif" font-size="42" font-weight="700">BONO 5 AÑOS</text>
        <path d="M145 135h300" stroke="#789596"/>
        <g font-size="19" fill="#253b46">
          <text x="95" y="174" font-weight="700">Emisor:</text><text x="470" y="174" text-anchor="end" fill="#168692" font-weight="700">Estado o empresa</text>
          <text x="95" y="211" font-weight="700">Cupón:</text><text x="470" y="211" text-anchor="end" fill="#168692" font-weight="700">4% anual</text>
          <text x="95" y="248" font-weight="700">Precio hoy:</text><text x="470" y="248" text-anchor="end" fill="#168692" font-weight="700">100 €</text>
          <text x="95" y="285" font-weight="700">Notional:</text><text x="470" y="285" text-anchor="end" fill="#168692" font-weight="700">100 €</text>
          <text x="95" y="322" font-weight="700">Valor nominal:</text><text x="470" y="322" text-anchor="end" fill="#168692" font-weight="700">100 €</text>
          <text x="95" y="359" font-weight="700">Vencimiento:</text><text x="470" y="359" text-anchor="end" fill="#168692" font-weight="700">5 años</text>
        </g>
        <g transform="translate(520 315)"><circle r="28" fill="#d8e5df" stroke="#5c8f91"/><path d="M-10-5a12 12 0 1 0 4-10M-13-14v10h10" fill="none" stroke="#217f87" stroke-width="2"/><text x="0" y="20" text-anchor="middle" fill="#273f48" font-size="11" font-weight="700">ANUAL</text></g>
      </g>
      <g class="stateful baseline-callouts" ${stateAttrs({ show: callouts, motionId: "bl-s2-callouts", geometryId: "bl-s2-callouts" })}>
        <g transform="translate(64 182)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Emisor</text><text x="25" y="60" class="bl-small">Entidad que asume la obligación.</text></g><path class="bl-line" d="M406 224H505"/>
        <g transform="translate(64 300)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Precio hoy</text><text x="25" y="60" class="bl-small">Importe pagado: 100 €.</text></g><path class="bl-line" d="M406 342H505"/>
        <g transform="translate(64 418)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Vencimiento</text><text x="25" y="60" class="bl-small">Tiempo total: 5 años.</text></g><path class="bl-line" d="M406 460H505"/>
        <g transform="translate(1194 155)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Cupón</text><text x="25" y="60" class="bl-small">Interés anual: 4%.</text></g><path class="bl-line" d="M1095 197h99"/>
        <g transform="translate(1194 252)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Valor nominal</text><text x="25" y="60" class="bl-small">Principal devuelto: 100 €.</text></g><path class="bl-line" d="M1095 294h99"/>
        <g transform="translate(1194 349)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Notional</text><text x="25" y="60" class="bl-small">Base del cupón: 100 €.</text></g><path class="bl-line" d="M1095 391h99"/>
        <g transform="translate(1194 446)"><rect class="bl-panel" width="342" height="82" rx="9"/><text x="25" y="34" class="bl-label">Frecuencia</text><text x="25" y="60" class="bl-small">Periodicidad anual.</text></g><path class="bl-line" d="M1095 488h99"/>
      </g>
      <g class="stateful" ${stateAttrs({ show: ["s2-b3"], motionId: "cash-flow-timeline", geometryId: "bl-s2-timeline", persistentId: "cash-flow-timeline" })} transform="translate(190 670)">
        <path d="M90 74H1130" stroke="#3f7d87" stroke-width="3" marker-end="url(#bl-s2-arrow)"/>
        <text x="610" y="157" text-anchor="middle" class="bl-small" fill="#48c4c5">Flujo de caja del bono desde la perspectiva del inversor</text>
        ${[
          [90, "Hoy", "−100 €", "#48c4c5"],
          [300, "1Y", "+4 €", "#48c4c5"],
          [490, "2Y", "+4 €", "#48c4c5"],
          [680, "3Y", "+4 €", "#48c4c5"],
          [870, "4Y", "+4 €", "#48c4c5"],
          [1060, "5Y", "+104 €", "#b7d986"]
        ].map(([x, time, value, color]) => `<g transform="translate(${x} 74)"><circle r="${time === "Hoy" || time === "5Y" ? 34 : 28}" fill="#06192b" stroke="${color}" stroke-width="2"/><text x="0" y="8" text-anchor="middle" class="bl-label">${time}</text><text x="0" y="-52" text-anchor="middle" font-size="20" fill="${color}">${value}</text></g>`).join("")}
      </g>
    </svg>`;
}

function baselineFraction(x, numerator, index, accent = false) {
  return `<g transform="translate(${x} 684)"><text x="75" y="30" text-anchor="middle" font-size="27" fill="${accent ? "#b7d986" : "#f6f8f7"}" font-weight="${accent ? 700 : 500}">${numerator}</text><path d="M18 41H132" stroke="${accent ? "#b7d986" : "#8db2b7"}"/><text x="75" y="77" text-anchor="middle" font-size="24" fill="#f6f8f7">(1+r<tspan baseline-shift="sub" font-size="15">${index}</tspan>)<tspan baseline-shift="super" font-size="15">${index}</tspan></text></g>`;
}

function baselineSlide04() {
  const all = ["s4-b1", "s4-b2", "s4-b3", "s4-b4"];
  return `
    <svg class="baseline-svg" viewBox="0 0 1600 900" role="img" aria-labelledby="baseline-s4-title baseline-s4-desc">
      <title id="baseline-s4-title">Descuento de flujos</title>
      <desc id="baseline-s4-desc">Timeline, regla general y fórmula expandida del bono canónico.</desc>
      <defs><linearGradient id="bl-s4-bg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#031427"/><stop offset="1" stop-color="#020d1a"/></linearGradient><marker id="bl-s4-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#48c4c5"/></marker></defs>
      <rect width="1600" height="900" fill="url(#bl-s4-bg)"/>
      <g class="stateful" ${stateAttrs({ show: all, motionId: "bl-s4-header" })}><text x="800" y="70" text-anchor="middle" class="bl-title">Descuento de flujos</text><text x="800" y="108" text-anchor="middle" class="bl-subtitle">El precio de un bono es el valor presente de sus pagos futuros.</text></g>
      <g class="stateful" ${stateAttrs({ show: all, motionId: "bl-s4-ribbon" })}><rect class="bl-panel" x="345" y="132" width="910" height="53" rx="8"/><text x="395" y="166" class="bl-small"><tspan fill="#48c4c5" font-weight="700">Ejemplo:</tspan> bono a 5 años, cupón 4%, notional 100 €, face value 100 €</text></g>
      <g class="stateful" ${stateAttrs({ show: all, primary: ["s4-b1"], motionId: "discount-timeline", geometryId: "bl-s4-timeline", persistentId: "discount-timeline" })} transform="translate(90 260)">
        <g transform="translate(0 44)"><rect class="bl-panel" width="145" height="78" rx="10"/><text x="72" y="50" text-anchor="middle" class="bl-label" font-weight="700">BONO</text><text x="72" y="111" text-anchor="middle" class="bl-small">Hoy</text></g>
        <path d="M145 83H1110" stroke="#3a7f87" stroke-width="4" marker-end="url(#bl-s4-arrow)"/>
        ${[1, 2, 3, 4, 5].map((index) => {
          const x = 325 + (index - 1) * 190;
          const value = index === 5 ? "104 €" : "4 €";
          const color = index === 5 ? "#b7d986" : "#48c4c5";
          return `<g transform="translate(${x} 83)" data-persistent-id="cash-flow-${index}"><circle r="${index === 5 ? 13 : 11}" fill="${color}"/><path d="M0-11V-50" stroke="${color}" stroke-width="3"/><text x="0" y="-67" text-anchor="middle" font-size="21" fill="${color}">${value}</text><text x="0" y="52" text-anchor="middle" class="bl-small">t = ${index}</text></g>`;
        }).join("")}
      </g>
      <g class="stateful" ${stateAttrs({ show: ["s4-b2", "s4-b3", "s4-b4"], primary: ["s4-b2"], motionId: "maturity-breakdown", geometryId: "bl-s4-maturity" })} transform="translate(1258 218)">
        <rect width="286" height="154" rx="9" fill="#071d31" stroke="#789e74" stroke-width="2"/><text x="22" y="34" class="bl-small">Antes del vencimiento:</text><text x="22" y="62" class="bl-small">CF<tspan baseline-shift="sub" font-size="12">t</tspan> = 4% × 100 € = <tspan fill="#48c4c5" font-weight="700">4 €</tspan></text><path d="M18 78H268" stroke="#294b56"/><text x="22" y="106" class="bl-small">En vencimiento:</text><text x="22" y="134" class="bl-small">CF<tspan baseline-shift="sub" font-size="12">5</tspan> = 4 € + 100 € = <tspan fill="#b7d986" font-weight="700">104 €</tspan></text>
      </g>
      <g class="stateful" ${stateAttrs({ show: ["s4-b3", "s4-b4"], primary: ["s4-b3"], motionId: "general-formula", geometryId: "bl-s4-general" })}>
        <rect class="bl-panel" x="275" y="444" width="1050" height="118" rx="10"/><text x="345" y="518" font-size="31" fill="#f6f8f7">Precio hoy =</text><text x="580" y="510" font-size="54" fill="#f6f8f7">Σ</text><text x="598" y="474" text-anchor="middle" class="bl-small">5</text><text x="598" y="542" text-anchor="middle" class="bl-small">t = 1</text><text x="760" y="492" text-anchor="middle" font-size="32" fill="#f6f8f7">CF<tspan baseline-shift="sub" font-size="20">t</tspan></text><path d="M665 505H855" stroke="#8db2b7" stroke-width="2"/><text x="760" y="540" text-anchor="middle" font-size="30" fill="#f6f8f7">(1 + r<tspan baseline-shift="sub" font-size="18">t</tspan>)<tspan baseline-shift="super" font-size="18">t</tspan></text><text x="930" y="490" class="bl-small">CF<tspan baseline-shift="sub" font-size="12">t</tspan> = flujo en t</text><text x="930" y="530" class="bl-small">r<tspan baseline-shift="sub" font-size="12">t</tspan> = tasa para t</text>
      </g>
      <g class="stateful" ${stateAttrs({ show: ["s4-b4"], primary: ["s4-b4"], motionId: "expanded-formula", geometryId: "bl-s4-expanded", persistentId: "expanded-formula" })}>
        <rect class="bl-panel" x="120" y="625" width="1360" height="160" rx="10"/><text x="155" y="660" class="bl-small" fill="#48c4c5">Ejemplo expandido</text><text x="155" y="735" font-size="28" fill="#f6f8f7">Precio hoy =</text>
        ${baselineFraction(350, "4", 1)}<text x="505" y="735" font-size="30" fill="#8fb0b8">+</text>${baselineFraction(520, "4", 2)}<text x="675" y="735" font-size="30" fill="#8fb0b8">+</text>${baselineFraction(690, "4", 3)}<text x="845" y="735" font-size="30" fill="#8fb0b8">+</text>${baselineFraction(860, "4", 4)}<text x="1015" y="735" font-size="30" fill="#8fb0b8">+</text>${baselineFraction(1030, "104", 5, true)}
      </g>
    </svg>`;
}

function certificateTerm(key, label, value, holds) {
  return `<div class="certificate-term" data-term="${key}" ${stateAttrs({ show: holds, motionId: `s2-term-${key}`, geometryId: `s2-term-${key}` })}><span data-text-id="s2-${key}-label">${label}</span><strong data-text-id="s2-${key}-value">${value}</strong></div>`;
}

function cashNode(id, time, value, tone, holds, primary = []) {
  return `<div class="cash-node ${tone}" data-time="${time}" ${stateAttrs({ show: holds, primary, motionId: id, geometryId: id, persistentId: id })}><span class="cash-value" data-text-id="${id}-value">${value}</span><span class="cash-dot"></span><span class="cash-time" data-text-id="${id}-time">${time}</span></div>`;
}

function enhancedSlide02() {
  const all = ["s2-e1", "s2-e2", "s2-e3", "s2-e4", "s2-e5"];
  return `
    <section class="enhanced-slide slide-02" aria-labelledby="s2-title">
      <div class="ambient ambient-s2" aria-hidden="true"></div>
      <header class="scene-header" ${stateAttrs({ show: all, motionId: "s2-header", geometryId: "s2-header" })}>
        <div class="eyebrow" data-text-id="s2-eyebrow" data-text-tier="metadata">SLIDE 02 · EL CONTRATO</div>
        <h1 id="s2-title" data-fit-text data-min-font="24" data-max-font="54" data-text-id="s2-title">Anatomía de un bono</h1>
        <p data-text-id="s2-subtitle">Un instrumento. Tres relaciones económicas. Seis cash flows.</p>
      </header>
      <div class="s2-workbench" data-geometry-id="s2-workbench" data-geometry-role="container">
        <article class="bond-certificate stateful" ${stateAttrs({ show: all, primary: ["s2-e1"], muted: ["s2-e5"], motionId: "bond-certificate", geometryId: "bond-certificate", persistentId: "bond-certificate" })}>
          <div class="certificate-frame">
            <div class="certificate-seal">${iconBank}</div>
            <div class="certificate-kicker" data-text-id="s2-certificate-kicker" data-text-tier="metadata">OBLIGACIÓN DE PAGO</div>
            <h2 data-fit-text data-min-font="18" data-max-font="36" data-text-id="s2-certificate-title">BONO · 5 AÑOS</h2>
            <div class="certificate-summary" data-text-id="s2-certificate-summary">5 años · 4% anual · nominal 100 €</div>
            <div class="certificate-terms">
              ${certificateTerm("issuer", "Emisor", "Estado o empresa", all)}
              ${certificateTerm("coupon", "Cupón", "4% anual", all)}
              ${certificateTerm("price", "Precio hoy", "100 €", all)}
              ${certificateTerm("notional", "Notional", "100 €", all)}
              ${certificateTerm("face", "Valor nominal", "100 €", all)}
              ${certificateTerm("maturity", "Vencimiento", "5 años", all)}
              ${certificateTerm("frequency", "Frecuencia", "Anual", all)}
            </div>
          </div>
        </article>
        <aside class="chapter-rail" data-geometry-id="s2-chapter-rail" data-geometry-role="container">
          <article class="semantic-chapter entry-chapter stateful" ${stateAttrs({ show: ["s2-e2"], primary: ["s2-e2"], motionId: "entry-chapter", geometryId: "entry-chapter" })}>
            <span class="chapter-index">01</span><span class="chapter-label" data-text-id="s2-entry-label" data-text-tier="metadata">ENTRADA</span>
            <h2 data-fit-text data-min-font="18" data-max-font="34" data-text-id="s2-entry-title">Pagas hoy por una promesa futura</h2>
            <div class="relation"><span data-text-id="s2-entry-issuer">Emisor asume la obligación</span><strong data-text-id="s2-entry-price">Precio hoy · 100 €</strong></div>
            <svg class="chapter-connector" viewBox="0 0 120 40" aria-hidden="true"><path data-connector="entry-connector" data-connector-target="s2-entry-title" d="M3 20H104l12-12"/></svg>
          </article>
          <article class="semantic-chapter income-chapter stateful" ${stateAttrs({ show: ["s2-e3"], motionId: "income-chapter", geometryId: "income-chapter" })}>
            <span class="chapter-index">02</span><span class="chapter-label" data-text-id="s2-income-label" data-text-tier="metadata">RENDIMIENTO</span>
            <h2 data-fit-text data-min-font="18" data-max-font="34" data-text-id="s2-income-title">El porcentaje se convierte en dinero</h2>
            <p data-text-id="s2-income-copy">Cupón sobre notional, una vez al año.</p>
          </article>
          <article class="semantic-chapter exit-chapter stateful" ${stateAttrs({ show: ["s2-e4"], primary: ["s2-e4"], motionId: "exit-chapter", geometryId: "exit-chapter" })}>
            <span class="chapter-index">03</span><span class="chapter-label lime" data-text-id="s2-exit-label" data-text-tier="metadata">SALIDA</span>
            <h2 data-fit-text data-min-font="18" data-max-font="34" data-text-id="s2-exit-title">En 5Y vuelve también el principal</h2>
            <div class="maturity-sum"><span data-text-id="s2-exit-coupon">4 € cupón</span><b>+</b><span class="lime" data-text-id="s2-exit-principal">100 € principal</span><b>=</b><strong data-text-id="s2-exit-result">104 €</strong></div>
            <svg class="chapter-connector" viewBox="0 0 120 40" aria-hidden="true"><path data-connector="exit-connector" data-connector-target="s2-exit-title" d="M3 20H104l12 12"/></svg>
          </article>
        </aside>
      </div>
      <div class="coupon-equation stateful" ${stateAttrs({ show: ["s2-e3", "s2-e4", "s2-e5"], primary: ["s2-e3"], muted: ["s2-e4", "s2-e5"], motionId: "coupon-equation", geometryId: "coupon-equation", persistentId: "coupon-equation" })}>
        <span class="equation-label" data-text-id="s2-equation-label" data-text-tier="metadata">PAGO ANUAL</span>
        <span class="equation-token" data-text-id="s2-equation-rate">4%</span><span class="operator">×</span><span class="equation-token" data-text-id="s2-equation-notional">100 €</span><span class="operator">=</span><strong class="equation-result" data-text-id="s2-equation-result">4 €</strong><span class="equation-cadence" data-text-id="s2-equation-cadence">cada año</span>
      </div>
      <div class="cashflow-panel stateful" ${stateAttrs({ show: ["s2-e5"], primary: ["s2-e5"], motionId: "cash-flow-timeline", geometryId: "cash-flow-timeline", persistentId: "cash-flow-timeline" })}>
        <div class="cashflow-caption"><span data-text-id="s2-timeline-label" data-text-tier="metadata">CASH FLOWS DEL INVERSOR</span><span data-text-id="s2-timeline-rule" data-text-tier="metadata">el contrato desplegado en el tiempo</span></div>
        <div class="cashflow-track"><div class="cashflow-line" aria-hidden="true"></div>
          ${cashNode("s2-cf-0", "Hoy", "−100 €", "outflow", ["s2-e5"])}
          ${cashNode("s2-cf-1", "1Y", "+4 €", "coupon", ["s2-e5"])}
          ${cashNode("s2-cf-2", "2Y", "+4 €", "coupon", ["s2-e5"])}
          ${cashNode("s2-cf-3", "3Y", "+4 €", "coupon", ["s2-e5"])}
          ${cashNode("s2-cf-4", "4Y", "+4 €", "coupon", ["s2-e5"])}
          ${cashNode("s2-cf-5", "5Y", "+104 €", "maturity", ["s2-e5"])}
        </div>
      </div>
      <div class="hold-question" data-text-id="s2-hold-question" data-text-tier="metadata" aria-live="polite"></div>
    </section>`;
}

function fractionTerm(id, numerator, index, holds, primary = []) {
  return `<span class="discount-term stateful" ${stateAttrs({ show: holds, primary, motionId: id, geometryId: id, persistentId: id, textId: `${id}-text` })}><span class="numerator">${numerator}</span><span class="fraction-bar"></span><span class="denominator">(1+r<sub>${index}</sub>)<sup>${index}</sup></span></span>`;
}

function enhancedSlide04() {
  const all = ["s4-e1", "s4-e2", "s4-e3", "s4-e4", "s4-e5", "s4-e6"];
  return `
    <section class="enhanced-slide slide-04" aria-labelledby="s4-title">
      <div class="ambient ambient-s4" aria-hidden="true"></div>
      <header class="scene-header" ${stateAttrs({ show: all, motionId: "s4-header", geometryId: "s4-header" })}>
        <div class="eyebrow" data-text-id="s4-eyebrow" data-text-tier="metadata">SLIDE 04 · VALOR PRESENTE</div>
        <h1 id="s4-title" data-fit-text data-min-font="24" data-max-font="54" data-text-id="s4-title">Descuento de flujos</h1>
        <p data-text-id="s4-subtitle">Cada pago ocupa su momento. Cada momento exige su descuento.</p>
      </header>
      <div class="example-ribbon stateful" ${stateAttrs({ show: ["s4-e1", "s4-e2"], motionId: "example-ribbon", geometryId: "example-ribbon" })}>
        <span class="ribbon-label" data-text-id="s4-ribbon-label" data-text-tier="metadata">BONO CANÓNICO</span><span data-text-id="s4-ribbon-copy">5 años · cupón 4% · notional 100 € · nominal 100 €</span>
      </div>
      <div class="discount-timeline stateful" ${stateAttrs({ show: all, primary: ["s4-e1"], motionId: "discount-timeline", geometryId: "discount-timeline", persistentId: "discount-timeline" })}>
        <div class="timeline-rail" aria-hidden="true"></div>
        ${cashNode("cash-flow-1", "t = 1", "4 €", "coupon", all)}
        ${cashNode("cash-flow-2", "t = 2", "4 €", "coupon", all)}
        ${cashNode("cash-flow-3", "t = 3", "4 €", "coupon", all)}
        ${cashNode("cash-flow-4", "t = 4", "4 €", "coupon", all)}
        ${cashNode("cash-flow-5", "t = 5", "104 €", "maturity", all)}
      </div>
      <div class="maturity-breakdown stateful" ${stateAttrs({ show: ["s4-e2", "s4-e5"], primary: ["s4-e2"], muted: ["s4-e5"], motionId: "maturity-breakdown", geometryId: "maturity-breakdown" })}>
        <span class="breakdown-kicker" data-text-id="s4-maturity-kicker" data-text-tier="metadata">SOLO EN VENCIMIENTO</span>
        <div class="breakdown-equation"><span class="cyan" data-text-id="s4-maturity-coupon">4 €</span><b>+</b><span class="lime" data-text-id="s4-maturity-principal">100 €</span><b>=</b><strong data-text-id="s4-maturity-result">104 €</strong></div>
        <div class="breakdown-labels"><span data-text-id="s4-maturity-coupon-label">cupón</span><span data-text-id="s4-maturity-principal-label">principal</span></div>
        <svg class="maturity-connector" viewBox="0 0 160 42" aria-hidden="true"><path data-connector="maturity-connector" data-connector-target="s4-maturity-result" d="M3 8h70l26 25h57"/></svg>
      </div>
      <div class="discount-rule stateful" ${stateAttrs({ show: ["s4-e3", "s4-e4", "s4-e5", "s4-e6"], motionId: "discount-rule", geometryId: "discount-rule" })}>
        <span class="rule-label" data-text-id="s4-rule-label" data-text-tier="metadata">REGLA</span><strong data-text-id="s4-rule-copy">un cash flow en <i>t</i> → un valor presente hoy</strong><span class="rule-formula" data-text-id="s4-rule-formula">CF<sub>t</sub> / (1+r<sub>t</sub>)<sup>t</sup></span>
      </div>
      <svg class="discount-tracers" viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden="true">
        <path class="stateful tracer tracer-cyan" ${stateAttrs({ show: ["s4-e3"], motionId: "tracer-t1" })} data-connector="tracer-t1" data-connector-target="discount-term-1-text" d="M280 4C280 26 50 32 50 115V202C50 221 550 216 550 296"/>
        <path class="stateful tracer tracer-lime" ${stateAttrs({ show: ["s4-e5"], motionId: "tracer-t5" })} data-connector="tracer-t5" data-connector-target="discount-term-5-text" d="M1320 4C1320 26 1550 32 1550 115V202C1550 221 1240 216 1240 296"/>
      </svg>
      <div class="formula-surface stateful" ${stateAttrs({ show: ["s4-e3", "s4-e4", "s4-e5", "s4-e6"], primary: ["s4-e6"], motionId: "expanded-formula", geometryId: "expanded-formula", persistentId: "expanded-formula" })}>
        <div class="formula-kicker" data-text-id="s4-formula-kicker" data-text-tier="metadata">EJEMPLO EXPANDIDO</div>
        <div class="formula-builder">
          <span class="price-prefix stateful" ${stateAttrs({ show: ["s4-e6"], motionId: "price-prefix", geometryId: "price-prefix", textId: "s4-price-prefix" })}>Precio hoy =</span>
          <span class="coupon-term-group" data-primary-holds="s4-e4" data-geometry-id="coupon-term-group" data-geometry-role="container">
            ${fractionTerm("discount-term-1", "4", 1, ["s4-e3", "s4-e4", "s4-e5", "s4-e6"], ["s4-e3"])}
            <span class="formula-plus stateful" ${stateAttrs({ show: ["s4-e4", "s4-e5", "s4-e6"], textId: "s4-plus-1" })}>+</span>
            ${fractionTerm("discount-term-2", "4", 2, ["s4-e4", "s4-e5", "s4-e6"])}
            <span class="formula-plus stateful" ${stateAttrs({ show: ["s4-e4", "s4-e5", "s4-e6"], textId: "s4-plus-2" })}>+</span>
            ${fractionTerm("discount-term-3", "4", 3, ["s4-e4", "s4-e5", "s4-e6"])}
            <span class="formula-plus stateful" ${stateAttrs({ show: ["s4-e4", "s4-e5", "s4-e6"], textId: "s4-plus-3" })}>+</span>
            ${fractionTerm("discount-term-4", "4", 4, ["s4-e4", "s4-e5", "s4-e6"])}
          </span>
          <span class="formula-plus final-plus stateful" ${stateAttrs({ show: ["s4-e5", "s4-e6"], textId: "s4-plus-4" })}>+</span>
          ${fractionTerm("discount-term-5", "104", 5, ["s4-e5", "s4-e6"], ["s4-e5"])}
        </div>
        <div class="formula-note stateful" ${stateAttrs({ show: ["s4-e6"], motionId: "formula-note", textId: "s4-formula-note" })}>El principal aparece una sola vez: en el numerador de <strong>t = 5</strong>.</div>
      </div>
      <div class="hold-question" data-text-id="s4-hold-question" data-text-tier="metadata" aria-live="polite"></div>
    </section>`;
}

export function renderScene(variant, slideId) {
  if (variant === "baseline_faithful" && slideId === "slide-02") return baselineSlide02();
  if (variant === "baseline_faithful" && slideId === "slide-04") return baselineSlide04();
  if (variant === "enhanced_immersive" && slideId === "slide-02") return enhancedSlide02();
  if (variant === "enhanced_immersive" && slideId === "slide-04") return enhancedSlide04();
  throw new Error(`Unknown scene template: ${variant}/${slideId}`);
}
