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
**Public :** développeurs PHP connaissant Symfony (contrôleurs, services, Doctrine)  
**Technologies :** MCP (spécification `2026-07-28`), PHP 8.4+, Symfony 8, Doctrine, `symfony/mcp-bundle` (SDK `mcp/sdk`), MCP Inspector, VS Code + GitHub Copilot  
**Fil rouge :** gestionnaire de tickets de support (Symfony + Doctrine + SQLite), exposé d'abord par un contrôleur écrit à la main (projet `tickets-raw`), puis avec le SDK (projet `tickets`)

Le cours enseigne l'ère `modern` du protocole ; l'ère `legacy` est présentée en comparaison (voir [docs/adr/0001-enseigner-l-ere-modern.md](docs/adr/0001-enseigner-l-ere-modern.md)). Le code est écrit en PHP avec Symfony, d'abord sans SDK puis avec (voir [docs/adr/0002-symfony-sans-sdk-puis-bundle.md](docs/adr/0002-symfony-sans-sdk-puis-bundle.md)). Le vocabulaire employé est défini dans [CONTEXT.md](CONTEXT.md).

## Jour 1 : comprendre le protocole en le codant (6h30)

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
- Brancher un serveur MCP distant (démo, authentification fictive) et le serveur local filesystem dans VS Code, et les faire utiliser par le modèle
- Observer les échanges du même serveur dans l'Inspector

---

### Chapitre 3 : Un premier serveur avec Symfony (1h15)

#### Objectifs
- Écrire un serveur MCP fonctionnel dès le début du cours, sans SDK
- Mettre en place le fil rouge

#### Contenu théorique (20 min)
- Projet Symfony `tickets-raw` : entité `Ticket` générée avec `make:entity`, dépôt, fixtures, base SQLite, Serializer
- Requête et réponse JSON-RPC reçues par le serveur
- Les méthodes minimales : `server/discover`, `tools/list`, `tools/call`, avec les champs de cache `ttlMs` et `cacheScope` exigés par l'Inspector
- `McpController` : contrôleur invocable (`__invoke()`), route `POST /mcp`

#### Mise en pratique (55 min)
- Créer le projet et la base
- Écrire `McpController` avec le tool `list_tickets`
- Tester chaque méthode avec `curl`

---

### Chapitre 4 : Le protocole (1h45)

#### Objectifs
- Lire et comprendre les messages échangés entre client et serveur
- Rendre `McpController` conforme à la spécification
- Distinguer les ères `legacy` et `modern`

#### Contenu théorique (60 min)
- JSON-RPC 2.0 : requêtes, résultats, notifications, erreurs
- Un protocole sans état, et pourquoi il ne l'a pas toujours été
- Requêtes autonomes : `_meta` (version de la spécification, capacités du client), `resultType`, `serverInfo`
- Codes d'erreur JSON-RPC et MCP, codes HTTP associés
- `server/discover`, cache (`ttlMs`, `cacheScope`)
- Transports : stdio et Streamable HTTP (en-têtes `MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name`, `Origin`)
- Avant / après : ère `legacy` (`initialize`, sessions, requêtes du serveur vers le client) et fonctionnalités dépréciées (Roots, Sampling, Logging)

#### Mise en pratique (45 min)
- Exercice : lire et commenter des échanges JSON-RPC fournis
- Ajouter à `McpController` la vérification des en-têtes, de la version, de la méthode et du tool, les erreurs et `serverInfo`
- Tester les cas d'erreur avec `curl`, puis le serveur avec l'Inspector en ère `modern`

---

### Chapitre 5 : Organiser les tools (1h)

#### Objectifs
- Séparer le protocole du code métier
- Utiliser l'injection de dépendances de Symfony pour découvrir les tools

#### Contenu théorique (20 min)
- Interface `McpToolInterface` et attribut `#[AutoconfigureTag]`
- Un tool = une classe ; erreur d'exécution (`isError`)
- Registre `McpToolRegistry` et `#[AutowireIterator]`
- Pour aller plus loin : validation de `Origin` dans un listener `kernel.request`

#### Mise en pratique (40 min)
- Extraire `ListTicketsTool` et `GetTicketTool`, créer le registre, simplifier le contrôleur
- Ajouter `create_ticket` sans toucher au contrôleur
- Bonus : `McpOriginListener`

---

### Chapitre 6 : Le SDK et `symfony/mcp-bundle` (1h15)

#### Objectifs
- Construire un serveur avec le SDK officiel dans un nouveau projet Symfony
- Mesurer ce que le SDK apporte par rapport au serveur écrit à la main

#### Contenu théorique (30 min)
- Installation de `symfony/mcp-bundle` (et `nyholm/psr7`), `mcp.yaml`, route
- Déclaration par attributs (`#[McpTool]`, `#[Schema]`), `ToolCallException`, `structuredContent`
- `debug:mcp`
- Une seule URL pour les deux ères ; comparaison fait main / SDK
- Connexion depuis VS Code (ère `legacy`)

#### Mise en pratique (45 min)
- Créer le projet `tickets` et réécrire `list_tickets` et `get_ticket` avec le SDK
- Tester avec l'Inspector dans les deux ères, puis depuis VS Code

---

## Jour 2 : enrichir, sécuriser, aller plus loin (7h30)

### Chapitre 7 : Tools (1h30)

#### Objectifs
- Exposer les actions d'une application sous forme de tools
- Décrire précisément les entrées, les sorties et le comportement d'un tool

#### Contenu théorique (30 min)
- `inputSchema`, `outputSchema` (JSON Schema 2020-12) et `structuredContent`
- Annotations : `readOnlyHint`, `destructiveHint`…
- Erreurs d'exécution d'un tool et erreurs de protocole

#### Mise en pratique (60 min)
- Fil rouge : `list_tickets`, `get_ticket`, `create_ticket`, `assign_ticket`, `close_ticket` avec Doctrine
- Tester dans l'Inspector puis dans VS Code + GitHub Copilot

---

### Chapitre 8 : Resources et prompts (1h15)

#### Objectifs
- Exposer des données en lecture avec les resources
- Proposer des prompts réutilisables

#### Contenu théorique (30 min)
- URI, resource templates et completion
- Prompts et arguments
- Cache dans `mcp.yaml`
- Notifications de changement avec `subscriptions/listen`

#### Mise en pratique (45 min)
- Fil rouge : resource template `ticket://{id}`
- Fil rouge : prompt `triage_tickets`

---

### Chapitre 9 : MRTR et elicitation (1h)

#### Objectifs
- Demander une information à l'utilisateur pendant le traitement d'une requête

#### Contenu théorique (25 min)
- Le mécanisme MRTR : `input_required`, `inputRequests`, `inputResponses`, `requestState`
- Elicitation en mode formulaire et en mode URL
- Comparaison avec l'ère `legacy` (requête `elicitation/create` envoyée par le serveur), sur un échange MRTR réel capturé

#### Mise en pratique (35 min)
- Fil rouge : demander confirmation avant `close_ticket`
- Observer l'échange MRTR dans l'Inspector en ère `modern`

---

### Chapitre 10 : Transports et déploiement (30 min)

#### Objectifs
- Servir un serveur en HTTP et en stdio
- Préparer un serveur au déploiement

#### Contenu théorique (15 min)
- Transport stdio du bundle (`mcp:server`, ère `legacy` seulement)
- Sessions de l'ère `legacy`, déploiement sur plusieurs instances
- `allowed_hosts`, plusieurs serveurs dans une application, `protocol_versions`

#### Mise en pratique (15 min)
- Activer stdio et le brancher dans VS Code
- Tester la protection contre le DNS rebinding

---

### Chapitre 11 : Sécurité (1h45)

#### Objectifs
- Identifier les menaces propres à MCP
- Comprendre l'autorisation OAuth 2.1 dans MCP
- Protéger un serveur contre l'injection de prompt

#### Contenu théorique (45 min)
- Injection de prompt indirecte, tool poisoning, confused deputy, exfiltration de données
- Autorisation : découverte du serveur d'autorisation, enregistrement des clients, jetons
- Symfony Security : firewall `access_token` avec le handler `oidc`, métadonnées RFC 9728

#### Mise en pratique (60 min)
- Attaque : un ticket dont la description contient des instructions pousse le modèle à fermer des tickets
- Défense : elicitation avant les actions destructrices, annotations, séparation lecture / écriture

---

### Chapitre 12 : MCP Apps (1h)

#### Objectifs
- Comprendre le fonctionnement des extensions
- Afficher une interface interactive dans un host

#### Contenu théorique (25 min)
- Extensions officielles et négociation (`extensions` dans les capacités)
- MCP Apps : resource `ui://`, lien avec un tool, rendu dans le host
- `#[AsMcpApp]`, templates Twig, `#[AsMcpAppTool]` et `data-call`

#### Mise en pratique (35 min)
- Fil rouge : tableau de bord des tickets affiché dans VS Code

---

### Chapitre 13 : Aller plus loin (30 min)

#### Contenu théorique (30 min)
- Extension Tasks : opérations longues (exemple de messages JSON)
- Extension Skills
- MCP Registry
- Construire un client MCP avec le bundle
- Bonus : mettre en place un vrai serveur d'autorisation OAuth

---

## Ressources
- [Documentation MCP](https://modelcontextprotocol.io) ([index pour les agents](https://modelcontextprotocol.io/llms.txt))
- [Spécification courante](https://modelcontextprotocol.io/specification/latest) et [changements de la version `2026-07-28`](https://modelcontextprotocol.io/specification/2026-07-28/changelog)
- [SDK PHP](https://github.com/modelcontextprotocol/php-sdk) et [MCP Bundle de Symfony](https://symfony.com/doc/current/ai/bundles/mcp-bundle.html)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [Extensions officielles](https://modelcontextprotocol.io/extensions/overview)
