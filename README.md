# Fonctionnalités Backend

## Ce qui était demandé

Les 5 endpoints classiques d'un CRUD :
- `GET /pokemons` - Liste avec pagination
- `GET /pokemons/:id` `/pokemonbyname/:name` - Détail d'un Pokémon
- `POST /pokemons` - Créer
- `PUT /pokemons/:id` - Modifier
- `DELETE /pokemons/:id` - Supprimer

## Ce que j'ai ajouté

### Filtre par type
`GET /pokemons?type=Fire`

J'ai étendu l'endpoint principal pour filtrer par type. Le filtre se fait côté serveur, comme ça la pagination marche correctement.

### Comparaison
`GET /pokemons/pokemons-comparetwo?ids=1,4,7`

Permet de récupérer plusieurs Pokémon d'un coup pour les comparer.

### Suppression multiple
`DELETE /pokemons` avec `{ ids: [1, 2, 3] }`

Au lieu de faire plein de requêtes, on peut en supprimer plusieurs en une fois.

### Duplication
`POST /pokemons/:id`

Crée une copie du Pokémon avec un nouveau ID et ajoute "(copy)" au nom.

### API Équipes complète
J'ai créé toute une API pour gérer les équipes :

- `POST /teams` - Créer une équipe (nom unique)
- `GET /teams` - Liste toutes les équipes
- `GET /teams/:name` - Détail d'une équipe
- `PUT /teams/:name` - Modifier
- `DELETE /teams/:name` - Supprimer

Chaque équipe a un nom unique et peut contenir jusqu'à 6 Pokémon.

### Upload d'images
`POST /upload`

J'ai utilisé Multer pour gérer l'upload de fichiers. Les images sont stockées dans `/assets/uploads/` et l'endpoint retourne l'URL de l'image.

### Recherche par nom
`GET /search?q=pika`

Recherche insensible à la casse avec support des recherches partielles.

---
**Vidéo démo:** https://youtu.be/NcBpNu44ENA
**Vidéo de la mise a jour UI + OIDC Auth:** https://youtu.be/NZ4H3JZkxg8
