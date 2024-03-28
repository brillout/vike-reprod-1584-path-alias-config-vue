import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname( fileURLToPath( import.meta.url ) )


export default {
  plugins: [ vue(), vike(), ],
  resolve: {
    alias: {
      "#root": __dirname
    }
  }
}
