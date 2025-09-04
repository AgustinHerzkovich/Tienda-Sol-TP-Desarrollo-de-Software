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
El gitflow que utilizamos es el `Github Flow` que consta de una rama principal "*main*", y diferentes ramas "*entregas*" para cada update que hagamos en el código. Para cada nueva update se realiza una pull request antes de mergear los cambios a "*main*", y cada cambio una vez aceptado contará con su correspondiente release.
___
#### Versionado
Utilizamos Semantic Versioning para los nombres de los commits:
- MAJOR version when you make incompatible API changes. `1.X.X`
- MINOR version when you add functionality in a backward compatible manner. `X.1.X`
- PATCH version when you make backward compatible bug fixes. `X.X.1`
  
  
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