# MegaBlog

## GitHub Pages deployment

The Pages workflow builds the app with these repository secrets:

- `VITE_APPWRITE_URL`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_COLLECTION_ID`
- `VITE_APPWRITE_BUCKET_ID`
- `VITE_TINYMCE_API_KEY` (optional)

Add the first five under **Settings > Secrets and variables > Actions**. Also add the deployed Pages URL as a Web platform in Appwrite, for example `https://priyamraj201-art.github.io`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
