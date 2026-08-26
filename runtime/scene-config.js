export const VARIANTS = ["baseline_faithful", "enhanced_immersive"];
export const SLIDES = ["slide-02", "slide-04"];

const scene = (holds, beats) => ({ holds, beats });
const hold = (holdId, label, primary) => ({ holdId, label, primary });
const beat = (beatId, sourceHold, targetHold, durationMs, easing = "cubic-bezier(0.22, 1, 0.36, 1)") => ({
  beatId,
  sourceHold,
  targetHold,
  durationMs,
  easing
});

export const SCENE_CONFIG = {
  baseline_faithful: {
    "slide-02": scene(
      [
        hold("s2-b1", "El certificado", "bond-certificate"),
        hold("s2-b2", "Anatomía completa", "bond-certificate"),
        hold("s2-b3", "Contrato y cash flows", "bond-certificate")
      ],
      [
        beat("S2-BL-01", "s2-b1", "s2-b2", 620),
        beat("S2-BL-02", "s2-b2", "s2-b3", 700)
      ]
    ),
    "slide-04": scene(
      [
        hold("s4-b1", "Los cinco pagos", "discount-timeline"),
        hold("s4-b2", "Cupón frente a principal", "maturity-breakdown"),
        hold("s4-b3", "Regla general", "general-formula"),
        hold("s4-b4", "Fórmula expandida", "expanded-formula")
      ],
      [
        beat("S4-BL-01", "s4-b1", "s4-b2", 600),
        beat("S4-BL-02", "s4-b2", "s4-b3", 700),
        beat("S4-BL-03", "s4-b3", "s4-b4", 800, "cubic-bezier(0.16, 1, 0.3, 1)")
      ]
    )
  },
  enhanced_immersive: {
    "slide-02": scene(
      [
        hold("s2-e1", "El instrumento", "bond-certificate"),
        hold("s2-e2", "La entrada", "entry-chapter"),
        hold("s2-e3", "El motor del cupón", "coupon-equation"),
        hold("s2-e4", "La salida", "exit-chapter"),
        hold("s2-e5", "El contrato hecho cash flows", "cash-flow-timeline")
      ],
      [
        beat("S2-EN-01", "s2-e1", "s2-e2", 680),
        beat("S2-EN-02", "s2-e2", "s2-e3", 820, "cubic-bezier(0.16, 1, 0.3, 1)"),
        beat("S2-EN-03", "s2-e3", "s2-e4", 720),
        beat("S2-EN-04", "s2-e4", "s2-e5", 900, "cubic-bezier(0.16, 1, 0.3, 1)")
      ]
    ),
    "slide-04": scene(
      [
        hold("s4-e1", "Los pagos futuros", "discount-timeline"),
        hold("s4-e2", "Qué contiene 104 €", "maturity-breakdown"),
        hold("s4-e3", "Un cash flow, un descuento", "discount-term-1"),
        hold("s4-e4", "Los cuatro cupones", "coupon-term-group"),
        hold("s4-e5", "El principal en maturity", "discount-term-5"),
        hold("s4-e6", "La valoración completa", "expanded-formula")
      ],
      [
        beat("S4-EN-01", "s4-e1", "s4-e2", 700),
        beat("S4-EN-02", "s4-e2", "s4-e3", 880, "cubic-bezier(0.16, 1, 0.3, 1)"),
        beat("S4-EN-03", "s4-e3", "s4-e4", 900),
        beat("S4-EN-04", "s4-e4", "s4-e5", 800, "cubic-bezier(0.16, 1, 0.3, 1)"),
        beat("S4-EN-05", "s4-e5", "s4-e6", 760)
      ]
    )
  }
};

export function resolveScene(variant, slideId) {
  const selected = SCENE_CONFIG[variant]?.[slideId];
  if (!selected) throw new Error(`Unknown scene configuration: ${variant}/${slideId}`);
  return selected;
}

export function beatBetween(sceneConfig, sourceIndex, targetIndex) {
  const source = sceneConfig.holds[sourceIndex]?.holdId;
  const target = sceneConfig.holds[targetIndex]?.holdId;
  return sceneConfig.beats.find((item) => (
    item.sourceHold === source && item.targetHold === target
  ) || (
    item.sourceHold === target && item.targetHold === source
  ));
}
