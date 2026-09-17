# Model Context Protocol

## Installation

```bash
npm install -g revealexpress
git clone https://github.com/pjehan-teaching/mcp
cd mcp
npm install
npm run build
revealexpress
```

## Plan du cours

**Durée totale :** 14 heures (2 jours), dont environ 60 % de pratique  
**Public :** développeurs ayant une bonne maîtrise d'un langage (PHP, TypeScript…)  
**Technologies :** MCP (spécification `2026-07-28`), PHP, SDK `mcp/sdk`, MCP Inspector, VS Code + GitHub Copilot  
**Fil rouge :** gestionnaire de tickets de support (PHP + SQLite), exposé progressivement sous forme de serveur MCP

Le cours enseigne l'ère `modern` du protocole ; l'ère `legacy` est présentée en comparaison (voir [docs/adr/0001-enseigner-l-ere-modern.md](docs/adr/0001-enseigner-l-ere-modern.md)). Le vocabulaire employé est défini dans [CONTEXT.md](CONTEXT.md).

## Jour 1 : comprendre le protocole et construire les tools (6h45)

### Chapitre 2 : Pourquoi MCP (1h15)

#### Objectifs
- Comprendre le problème que résout MCP
- Identifier les rôles host, client et serveur
- Utiliser un serveur MCP existant depuis un host

#### Contenu théorique (30 min)
- Le problème des intégrations N×M entre applications d'IA et sources de données
- Architecture : host, client, serveur
- Les trois primitives serveur : tools, resources, prompts

#### Mise en pratique (45 min)
- Installer VS Code + GitHub Copilot et le MCP Inspector
- Brancher un serveur MCP existant dans VS Code et le faire utiliser par le modèle
- Observer les échanges du même serveur dans l'Inspector

---

### Chapitre 3 : Le protocole (1h15)

#### Objectifs
- Lire et comprendre les messages échangés entre client et serveur
- Distinguer les ères `legacy` et `modern`

#### Contenu théorique (60 min)
- JSON-RPC 2.0 : requêtes, résultats, notifications, erreurs
- Requêtes autonomes : `_meta` (version de la spécification, capacités du client), `resultType`
- `server/discover`
- Transports : stdio et Streamable HTTP (en-têtes `Mcp-Method`, `Mcp-Name`)
- Avant / après : ère `legacy` (`initialize`, sessions, requêtes du serveur vers le client) et fonctionnalités dépréciées (Roots, Sampling, Logging)

#### Mise en pratique (15 min)
- Exercice : lire et commenter des échanges JSON-RPC fournis

---

### Chapitre 4 : Un serveur sans SDK (45 min)

#### Objectifs
- Implémenter le protocole à la main pour le démystifier

#### Contenu théorique (10 min)
- Les méthodes minimales d'un serveur : `server/discover`, `tools/list`, `tools/call`

#### Mise en pratique (35 min)
- Écrire un `index.php` servi par `php -S` exposant un tool `add`
- Tester chaque méthode avec `curl`

---

### Chapitre 5 : Le SDK PHP (1h15)

#### Objectifs
- Construire un serveur avec le SDK officiel
- Tester un serveur avec l'Inspector
- Mettre en place le fil rouge

#### Contenu théorique (30 min)
- Installation de `mcp/sdk`, construction du serveur, déclaration par attributs
- Transport stdio
- Connexion depuis l'Inspector (ère `legacy` : le transport stdio du SDK PHP 0.8 ne sert pas l'ère `modern`)
- Présentation du fil rouge et de son code de départ (`composer.json`, `schema.sql`, `TicketRepository`)

#### Mise en pratique (45 min)
- Réécrire le tool `add` avec le SDK
- Installer le fil rouge

---

### Chapitre 6 : Tools (2h15)

#### Objectifs
- Exposer les actions d'une application sous forme de tools
- Décrire précisément les entrées, les sorties et le comportement d'un tool

#### Contenu théorique (45 min)
- `inputSchema`, `outputSchema` (JSON Schema 2020-12) et `structuredContent`
- Annotations : `readOnlyHint`, `destructiveHint`…
- Erreurs d'exécution d'un tool et erreurs de protocole

#### Mise en pratique (90 min)
- Fil rouge : `list_tickets`, `get_ticket`, `create_ticket`, `assign_ticket`, `close_ticket`
- Tester dans l'Inspector puis dans VS Code + GitHub Copilot

---

## Jour 2 : enrichir, sécuriser, aller plus loin (7h30)

### Chapitre 7 : Resources et prompts (1h30)

#### Objectifs
- Exposer des données en lecture avec les resources
- Proposer des prompts réutilisables

#### Contenu théorique (30 min)
- URI, resource templates et completion
- Prompts et arguments
- Cache des listes et des resources (`ttlMs`, `cacheScope`)
- Notifications de changement avec `subscriptions/listen`

#### Mise en pratique (60 min)
- Fil rouge : resource template `ticket://{id}`
- Fil rouge : prompt `triage_tickets`

---

### Chapitre 8 : MRTR et elicitation (1h15)

#### Objectifs
- Demander une information à l'utilisateur pendant le traitement d'une requête

#### Contenu théorique (30 min)
- Le mécanisme MRTR : `input_required`, `inputRequests`, `inputResponses`, `requestState`
- Elicitation en mode formulaire et en mode URL
- Comparaison avec l'ère `legacy` (requête `elicitation/create` envoyée par le serveur), sur un échange MRTR réel capturé

#### Mise en pratique (45 min)
- Fil rouge : demander confirmation avant `close_ticket`

---

### Chapitre 9 : Serveur HTTP (45 min)

#### Objectifs
- Rendre un serveur accessible à distance

#### Contenu théorique (15 min)
- Streamable HTTP avec le SDK
- Connexion d'un serveur distant dans VS Code
- Intégration dans un framework : `symfony/mcp-bundle`

#### Mise en pratique (30 min)
- Fil rouge : passer du transport stdio au transport HTTP
- Observer l'échange MRTR de `close_ticket` dans l'Inspector en ère `modern`

---

### Chapitre 10 : Sécurité (2h)

#### Objectifs
- Identifier les menaces propres à MCP
- Comprendre l'autorisation OAuth 2.1 dans MCP
- Protéger un serveur contre l'injection de prompt

#### Contenu théorique (45 min)
- Injection de prompt indirecte, tool poisoning, confused deputy, exfiltration de données
- Autorisation : découverte du serveur d'autorisation, enregistrement des clients, jetons
- Démonstration : serveur protégé par Keycloak (exemple `oauth-keycloak` du SDK PHP)

#### Mise en pratique (75 min)
- Attaque : un ticket dont la description contient des instructions pousse le modèle à fermer des tickets
- Défense : elicitation avant les actions destructrices, annotations, séparation lecture / écriture

---

### Chapitre 11 : MCP Apps (1h30)

#### Objectifs
- Comprendre le fonctionnement des extensions
- Afficher une interface interactive dans un host

#### Contenu théorique (30 min)
- Extensions officielles et négociation (`extensions` dans les capacités)
- MCP Apps : resource `ui://`, lien avec un tool, rendu dans le host

#### Mise en pratique (60 min)
- Fil rouge : tableau de bord des tickets affiché dans VS Code

---

### Chapitre 12 : Aller plus loin (30 min)

#### Contenu théorique (30 min)
- Extension Tasks : opérations longues (exemple de messages JSON)
- Extension Skills
- MCP Registry
- Construire un client MCP (survol)
- Bonus : mettre en place un vrai serveur d'autorisation OAuth

---

## Ressources
- [Documentation MCP](https://modelcontextprotocol.io) ([index pour les agents](https://modelcontextprotocol.io/llms.txt))
- [Spécification courante](https://modelcontextprotocol.io/specification/latest) et [changements de la version `2026-07-28`](https://modelcontextprotocol.io/specification/2026-07-28/changelog)
- [SDK PHP](https://github.com/modelcontextprotocol/php-sdk)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [Extensions officielles](https://modelcontextprotocol.io/extensions/overview)
