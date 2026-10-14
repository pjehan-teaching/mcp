import Prism from './js/prism';
import './css/style.scss';

document.getElementById('revealexpress').addEventListener('loaded', function(event) {

  Prism.highlightAll();

});
