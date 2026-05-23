import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        ingredients: resolve(__dirname, 'ingredients.html'),
        instructions: resolve(__dirname, 'instructions.html'),
        itemConfirm: resolve(__dirname, 'item-confirm-page.html'),
        itemPage: resolve(__dirname, 'item-page.html'),
        itemQr: resolve(__dirname, 'item-qr-page.html'),
        login: resolve(__dirname, 'login-page.html'),
        map: resolve(__dirname, 'map.html'),
        mydeals: resolve(__dirname, 'mydeals.html'),
        profile: resolve(__dirname, 'profile.html'),
        recipe: resolve(__dirname, 'recipe.html'),
        recipes: resolve(__dirname, 'recipes.html'),
        searchbar: resolve(__dirname, 'searchbar.html'),
        signup: resolve(__dirname, 'signup-page.html'),
      }
    }
  }
})