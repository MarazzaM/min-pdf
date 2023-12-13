### Template minimalista de PDFJS dist
Para levantar el proyecto hace falta

   ```bash
   npm install
   ```

## Dev mode

Nota : <React.StrictMode> se encuentra comentado debido a que por el HMR de react, se renderiza dos veces el PDF. En producción, se puede descomentar.

   ```bash
   npm run dev
   ```

## Prod mode

   ```bash
   npm build
   ```

Para una preview del modo de producción

   ```bash
   npm run preview
   ```