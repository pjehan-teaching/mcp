import Prism from 'prismjs';

// Languages: a component must be imported after the languages it requires (see prismjs/components.json)
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';

// Plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';

// Theme
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
