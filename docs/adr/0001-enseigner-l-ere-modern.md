# Enseigner l'ère `modern` du protocole

Le cours enseigne le modèle de la spécification `2026-07-28` (requêtes autonomes portant leur version dans `_meta`, `server/discover`, MRTR pour l'elicitation), alors que la plupart des tutoriels, serveurs et hosts existants reposent encore sur l'ère `legacy` (handshake `initialize`, sessions, requêtes envoyées par le serveur au client). Ce qu'expose un serveur ne change pas d'une ère à l'autre ; seul le cycle de vie des échanges diffère, et les étudiants apprennent ainsi le protocole qui s'impose plutôt qu'un modèle en voie de remplacement. L'ère `legacy` n'apparaît que dans une slide « avant / après » pour la reconnaître, et les serveurs des TP restent compatibles avec les deux ères grâce au SDK.

En septembre 2026, VS Code + GitHub Copilot (host des TP) ne parle que l'ère `legacy` ([microsoft/vscode#329848](https://github.com/microsoft/vscode/issues/329848)). Le SDK PHP émule alors MRTR en envoyant de vraies requêtes `elicitation/create`, si bien que le code écrit en TP est le même dans les deux ères.

**À revoir** quand cette issue sera résolue : la slide « avant / après » pourra alors être allégée ou supprimée.
