import Prism from './js/prism';
import { renderDiagrams } from './js/mermaid';
import './css/style.scss';

document.getElementById('revealexpress').addEventListener('loaded', function(event) {
  const deck = event.detail.Reveal;

  Prism.highlightAll();

  // Mermaid measures text to size a diagram: render a slide's diagrams only once it is displayed
  renderDiagrams(deck.getCurrentSlide());
  deck.on('slidechanged', (e) => renderDiagrams(e.currentSlide));

});
