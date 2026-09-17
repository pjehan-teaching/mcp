# Cours MCP

Vocabulaire du cours sur le Model Context Protocol. Les termes définis par le protocole (primitives, méthodes, champs) restent en anglais pour correspondre à la spécification et au code des SDK ; le reste du discours est en français.

## Rôles

**Host** :
Application utilisée par l'utilisateur (Claude Desktop, VS Code…) qui embarque le modèle et crée un client par serveur connecté.
_Avoid_ : hôte, application IA, agent

**Client** :
Composant du host qui maintient la connexion avec un serveur donné et lui envoie les requêtes.
_Avoid_ : MCP client (dans une phrase en français), connecteur

**Serveur** :
Programme qui expose des tools, des resources et des prompts à des clients via le protocole.
_Avoid_ : server (dans une phrase en français), plugin, connecteur

## Primitives serveur

**Tool** :
Fonction exposée par un serveur, que le modèle peut décider d'appeler avec des arguments (`tools/list`, `tools/call`).
_Avoid_ : outil, fonction, action

**Resource** :
Donnée identifiée par une URI qu'un serveur met à disposition du client en lecture (`resources/read`).
_Avoid_ : ressource, document, fichier

**Prompt** :
Modèle de message paramétré qu'un serveur propose à l'utilisateur (`prompts/get`).
_Avoid_ : invite, template, gabarit

## Échanges

**Elicitation** :
Demande d'information complémentaire à l'utilisateur, formulée par un serveur au cours du traitement d'une requête.
_Avoid_ : élicitation, formulaire, question

**MRTR** (Multi Round-Trip Request) :
Échange où le serveur répond `input_required` avec les informations qui lui manquent, et où le client renvoie la requête d'origine complétée.
_Avoid_ : requête serveur, callback

## Fil rouge

**Fil rouge** :
Application de gestion de tickets de support, dont le code de départ est donné dans les slides, que les étudiants exposent progressivement sous forme de serveur MCP au fil des TP.
_Avoid_ : projet, TP final, application exemple

**Ticket** :
Demande de support du fil rouge, avec un titre, une description, un statut et un éventuel assigné.
_Avoid_ : issue, incident, demande

## Versions

**Version de la spécification** :
Révision datée du protocole, identifiée par sa date (`2026-07-28`).
_Avoid_ : release, version MCP (sans date)

**Ère du protocole** :
Famille de versions partageant le même modèle d'échange : `legacy` (avec handshake `initialize` et sessions, avant `2026-07-28`) ou `modern` (sans état, à partir de `2026-07-28`).
_Avoid_ : génération, ancienne version, nouvelle version
