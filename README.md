# Marvel Backend - Marc

## Routes

Hello world

`/`

### User

Authentification:

Login:

- endpoint: `/user/login`
- method: POST
- body: `{email, password}`
- return: `user: {_id, account: {username}, token}`

Signup:

- endpoint: `/user/signup`
- method: POST
- body: `{email, password}`
- return: `user: {_id, account: {username}, token}`

Info user:

- endpoint: `/user`
- method: GET
- authorization: Bearer token
- return: `user: {_id, account: {username}, token}`

Add item to favorites:

- endpoint: `/user/favorites/:collection/:id`
- method: POST
- authorization: Bearer token
- params:
  - `:collection`: "comics" | "characters"
  - `:id`: item \_id
- return: `favorites from collection: []`

Remove item from favorites:

- endpoint: `/user/favorites/:collection/:id`
- method: DELETE
- authorization: Bearer token
- params:
  - `:collection`: "comics" | "characters"
  - `:id`: item \_id
- return: `favorites from: []`

### Comics

- endpoint: `/comic/:comicId`
- method: GET
- param: `:comicId`
- optional authorization: Bearer token
- return: comic `{ _id, title, description, thumbnail, ... }`:

  - if authorized: the comic is returned with a supplementary key `favorite`

- endpoint: `/comics`
- method: GET
- optional authorization: Bearer token
- body:
  - `skip`:
  - `limit`:
  - `title`:
- return: comics `[]`:

  - if authorized: each comic is returned with a supplementary key `favorite`

- endpoint: `/comics/:characterId`
- method: GET
- optional authorization: Bearer token
- param: `:characterId`
- body:
  - `skip`:
  - `limit`:
  - `title`:
- return: a character `{_id, name, ... , comics: []}`:
  - if authorized:
    - the character is returned with a supplementary key `favorite`
    - each comic is returned with a supplementary key `favorite`

### Characters
