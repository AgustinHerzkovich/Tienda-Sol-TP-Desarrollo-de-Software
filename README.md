# DDSO-K3511-2025-2C-G1
Trabajo cuatrimestral DDSO 2C
___
## Integrantes:
- Agustín Herzkovich
- Julián Estévez
- Lucas Presotto
- Nicolás Piacentini
- Tadeo Sorrentino
___
## Gitflow Utilizado
El gitflow que utilizamos es el `Github Flow` que consta de una rama principal "*main*", y diferentes ramas "*entregas*" para cada update que hagamos en el código. Para cada nueva update se realiza una pull request antes de mergear los cambios a "*main*", y cada cambio una vez aceptado contará con su correspondiente tag y release.
___
#### Convención de Commits
Utilizamos Conventional Commit para los nombres de los commits:
- *fix*: a commit of the _type_ fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- *feat*: a commit of the _type_ feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- *BREAKING CHANGE*: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any _type_.
- _types_ other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
- _footers_ other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format..
  
  
![alt text](resources/github_flow.png)


#### Ejecutar el Backend

```bash
npm run start:backend
```

Para el desarrollo con reinicio automático:

```bash
npm run dev:backend
```

#### Ejecutar el Frontend

```bash
npm run start:frontend
```

#### Ejecutar Ambos (Desarrollo)

Para iniciar el backend en modo `dev` y el frontend simultáneamente, usá:

```bash
npm run start:dev
```