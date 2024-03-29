import { onRenderHtml } from "#root/renderer/onRenderHtml"

// Depending on the value of `config.meta.ssr`, set other config options' `env`
// accordingly.
// See https://vike.dev/meta#modify-existing-configurations
const toggleSsrRelatedConfig = ( { configDefinedAt, configValue } )=>{
  if( typeof configValue !== 'boolean' ) {
    throw new Error( `${configDefinedAt} should be a boolean` )
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
               ? 'server-and-client' // default
               : 'client-only'
      }
    }
  }
}

export default {
  // onRenderHtml:   'import:brl-ws-ui/renderer/onRenderHtml:onRenderHtml',
  // onRenderClient: 'import:brl-ws-ui/renderer/onRenderClient:onRenderClient',
  // A page can define an onBeforeRender() hook to be run on the server, which
  // can fetch data and return it as additional page context. Typically, it will
  // return the page's root Vue component's props and additional data that can
  // be used by the renderers.
  // It is a cumulative config option, so a web app using vike-vue can extend
  // this list.
  passToClient:          [ 'pageProps', 'title', 'user', 'routeParams', 'theme' ],
  clientRouting:         true,
  onRenderHtml,
  hydrationCanBeAborted: true,
  meta:                  {
    Head:        {
      env: 'server-only'
    },
    Layout:      {
      env: 'server-and-client'
    },
    title:       {
      env: 'server-and-client'
    },
    description: {
      env: 'server-only'
    },
    favicon:     {
      env: 'server-only'
    },
    lang:        {
      env: 'server-only'
    },
    ssr:         {
      env:    'config-only',
      effect: toggleSsrRelatedConfig
    },
    vuePlugins:  {
      // List of vue plugins to be installed with app.vue() in onRenderHtml and
      // onRenderClient. We make this config available both on the server and
      // the client always, but if SSR is disabled, onRenderHtml won't make use
      // of it.
      env: 'server-and-client'
    }
  }
}
