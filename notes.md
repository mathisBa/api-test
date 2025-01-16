
##Les points d'amélioration pour l'api de ce projet :

1) La gestion des comptes  

- Il n'est pas possible de se créer un compte, il faut se connecter avec un compte créé avec le fichier .http
- Le token ne devrait pas être affiché
- La gestion des comptes devrait se regrouper sous un /auth/action plutôt que d'avoir un /me-connecter. 
- Les intitulés des données devraient être normés. On a par exemple l'envoi d'un champ "nom_utilisateur" puis un champ "mdp" et le retour attendu est "letoken". Il n'y a aucune règle appliquée, il faudrait utiliser une règle de nommage comme le KamelCase ou des noms beaucoup plus simples. De plus, il est recommandé de nommer ses variables en anglais. 
- Le logout n'est pas envoyé au back, on ne peut pas mettre le token comme expiré et l'ajouter aux token blacklist alors qu'il est supprimé du localstorage.

2) Miels

- Les headers d'autorisation devraient être Bearer et pas Believe 
- Les requêtes devraient respecter la convention. Par exemple, le PUT ne devrait pas être sous la forme /:id/prix/10 mais tous les champs devraient être dans le body avec le nom et la description.

3) Mon retour 

- J'ai perdu beaucoup de temps du le POST pour s'authentifier, ma route n'était d'abord pas reconnue puis je suis tombé dans le piège des champs envoyés qui ont des appélations étranges. 
- Je n'ai ensuite pas réussi à faire mon CRUD proprement, j'ai dû tout faire dans l'index pour "sauver les meubles" 
- Les routes d'authentifications fonctionnent toutes bien que la route demandée /se-connecter soit dans l'index. J'ai gardé mon auth routeur qui me permet toutes les authentifications sécurisée avec une gestion des tokens blacklist.