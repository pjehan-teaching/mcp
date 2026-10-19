import mermaid from 'mermaid';

// Solarized light palette, to match the reveal.js theme
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  fontFamily: 'Lato, sans-serif',
  // Overrides the per-diagram font sizes (sequence.messageFontSize…)
  fontSize: 22,
  // HTML labels inherit the reveal.js <pre> styles and get clipped: draw them as SVG text
  htmlLabels: false,
  themeVariables: {
    background: '#fdf6e3',
    primaryColor: '#eee8d5',
    primaryBorderColor: '#93a1a1',
    primaryTextColor: '#586e75',
    lineColor: '#586e75',
    textColor: '#586e75',
    actorBkg: '#eee8d5',
    actorBorder: '#93a1a1',
    actorTextColor: '#586e75',
    actorLineColor: '#93a1a1',
    signalColor: '#586e75',
    signalTextColor: '#586e75',
    activationBkgColor: '#fdf6e3',
    activationBorderColor: '#268bd2',
    noteBkgColor: '#fdf6e3',
    noteBorderColor: '#b58900',
    noteTextColor: '#b58900',
    clusterBkg: '#fdf6e3',
    clusterBorder: '#268bd2',
    edgeLabelBackground: '#fdf6e3',
  },
  // Tighter vertical spacing: a sequence diagram shares its slide with text
  sequence: {
    mirrorActors: false,
    height: 50,
    messageMargin: 28,
    noteMargin: 6,
    boxMargin: 6,
  },
});

export async function renderDiagrams(slide) {
  const nodes = slide?.querySelectorAll('.mermaid:not([data-processed])');
  if (!nodes?.length) {
    return;
  }
  // Text measured with a fallback font would leave the diagram badly sized
  await document.fonts.ready;
  await mermaid.run({ nodes });
}
