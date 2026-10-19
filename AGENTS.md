# AGENTS.md

Slides du cours **Model Context Protocol (MCP)**, en français, servies par [revealexpress](https://github.com/pjehan/RevealExpress) (reveal.js + Express).

## Cadre du cours

- `README.md` : plan détaillé (chapitres, durées, objectifs, TP). Un chapitre rédigé couvre tout ce que son plan annonce ; un écart de plan se décide avec l'utilisateur et se reporte dans le README.
- `CONTEXT.md` : vocabulaire du cours. Emploie ses termes et évite ceux listés en _Avoid_ (ex. « tool », jamais « outil »).
- `docs/adr/` : décisions structurantes, notamment l'ère `modern` enseignée et l'ère `legacy` réduite à une comparaison.

## MCP évolue vite : vérifie avant d'écrire

Le protocole publie plusieurs versions par an ; tes connaissances sont probablement en retard. Avant de rédiger ou de modifier une slide sur MCP, **confronte chaque affirmation à la documentation officielle** :

- Index de toute la documentation (format texte, pensé pour les agents) : https://modelcontextprotocol.io/llms.txt
- Spécification courante : https://modelcontextprotocol.io/specification/latest (redirige vers la version datée)
- Changements de la version : `https://modelcontextprotocol.io/specification/<version>/changelog.md`
- Fonctionnalités dépréciées : `https://modelcontextprotocol.io/specification/<version>/deprecated.md`
- SDK officiels et leur niveau de support : `https://modelcontextprotocol.io/docs/<version>/sdk.md`

Ajouter `.md` à l'URL d'une page de modelcontextprotocol.io renvoie son contenu en Markdown.

**Version de référence des slides : `2026-07-28`** (vérifiée le 17/09/2026).

Si `/specification/latest` redirige vers une version plus récente : lis son `changelog.md`, mets à jour les slides concernées, puis cette version de référence et sa date. Signale à l'utilisateur tout contenu devenu obsolète.

Cite la version de la spécification quand une slide décrit un comportement du protocole, et termine la slide par un lien `<footer>` vers la page de documentation correspondante.

## Lancer le slideshow

Ce slideshow est conçu pour **revealexpress 2.0**, en cours de développement dans `../../revealexpress` (la version publiée sur npm est plus ancienne) :

```bash
npm install
npm run build      # Vite compile src/ vers assets/ (ou npm run watch)
npm start          # revealexpress local sur http://<ip>:3000 (--port pour changer), sans ouvrir le navigateur
```

`npm start` exécute directement les sources TypeScript de `../../revealexpress` (Node.js ≥ 22.18). Le HTML est relu à chaque chargement de page ; seul `src/` demande un nouveau build.

En cas de doute sur le comportement du serveur ou du client, la référence est le code de `../../revealexpress/src/` (le README y est parfois en retard).

## Structure

- Chaque `NN-slug.html` à la racine est un **chapitre**, concaténé par ordre alphabétique : une `<section id="slug">` (id unique) contenant des `<section>` verticales. Première slide en `<h2>`, les suivantes en `<h3>`.
- Build **Vite** (`vite.config.mjs`) en mode bibliothèque IIFE, car revealexpress charge les fichiers avec des balises `<script>` et `<link>` classiques déclarées dans `slideshow.config.js` : `src/main.js` → `assets/js/script.js`, styles → `assets/css/style.css`. `assets/` est entièrement régénéré à chaque build et ignoré par git.
- Images et fichiers statiques : dans `src/public/` (copié tel quel dans `assets/`). `src/public/images/logo.png` se référence `assets/images/logo.png` dans le HTML.
- `src/js/prism.js` : langages, plugins et thème Prism, importés explicitement. Tout nouveau langage de bloc de code s'y importe **après les langages dont il dépend** (champ `require` de `node_modules/prismjs/components.json`, ex. `markup-templating` avant `php`), puis `npm run build`.
- Slides en **1280×800** (`revealjs` dans `slideshow.config.js`) et blocs de code limités à 620 px de haut : découpe le code au-delà d'environ 25 lignes.
- Tout le code du cours est en **PHP avec Symfony** (voir `docs/adr/0002-symfony-sans-sdk-puis-bundle.md`) : projet `tickets-raw` sans SDK (chapitres 3 à 5), puis projet `tickets` avec `symfony/mcp-bundle` (chapitre 6 et suivants). Pas de script PHP autonome ni de `Server::builder()`.
- Extraits testés le 14/10/2026 avec Symfony 8.1, `symfony/mcp-bundle` 0.14.1 et `mcp/sdk` 0.8.1. Le bundle n'a pas de recette Flex (écrire `mcp.yaml` et la route à la main) et exige une implémentation PSR-17 (`nyholm/psr7`), sinon chaque requête échoue en 500.
- L'entité `Ticket` est générée par `make:entity` (propriétés privées, getters et setters) : les tickets passent en JSON par le Serializer (`SerializerInterface::serialize()` dans `tickets-raw`, `NormalizerInterface::normalize()` avec le SDK). Le contrôleur fait main renvoie `new JsonResponse()` : `$this->json()` passerait par le Serializer, qui transforme `new \stdClass()` (`{}`) en `[]`.
- Le SDK PHP 0.8 ne sert l'ère `modern` qu'en HTTP : en stdio (`bin/console mcp:server`), le serveur parle l'ère `legacy`.
- **reveal.js 6** (thème solarized, `history: true`, `slideNumber: true`, options surchargeables dans la clé `revealjs` de `slideshow.config.js`) : fragments (`fade-up`, `fade-left`…), `data-auto-animate`, `r-stretch`, `r-fit-text`, `r-stack` et les fonds `data-background-*` sont disponibles. Aucun plugin reveal.js n'est enregistré : pas de vue présentateur (les `<aside class="notes">` restent simplement masquées), pas de markdown ni de plugin highlight (Prism s'en charge).
- L'URL ne reprend que l'`id` de la **slide affichée** : une slide vers laquelle on veut pointer (`href="#/mon-id"`) porte son propre `id`, unique dans tout le slideshow.
- Script de slide : dans `src/main.js`, `event.detail.Reveal` de l'événement `loaded` est l'**instance** du slideshow (`deck.on('slidechanged', …)`, `deck.getCurrentSlide()`), pas l'objet global `Reveal`.

## Code dans les slides

- `<pre><code class="language-php">` suivi immédiatement de la première ligne ; `</code></pre>` collé à la dernière.
- Échappe tout le code : `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`.
- Messages JSON-RPC en `language-json`.
- Diagrammes (échanges entre client et serveur, architecture) en **Mermaid**, jamais en art ASCII : `<pre class="mermaid">sequenceDiagram` suivi du code, `>` échappé (`C-&gt;&gt;+S: tools/call`). `src/js/mermaid.js` porte le thème solarized et dessine les diagrammes d'une slide à son affichage. Arborescences, sorties de commandes et journaux JSON-RPC restent en `language-none`.
- Le cours n'utilise que **PHP** : les extraits d'implémentation sont de simples `<pre><code>`, sans onglets de langage (le composant d'onglets a été retiré).

Avec Claude Code, le skill `revealexpress` détaille les conventions et fournit un script de vérification.
