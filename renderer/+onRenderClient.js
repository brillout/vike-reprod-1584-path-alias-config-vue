import { createVueApp } from '#root/renderer/app'
import { getTitle } from '#root/renderer/getTitle'

let app
const onRenderClient = async ( pageContext )=>{
  if( !app ) {
    // First rendering/hydration

    const container = document.getElementById( 'page-view' )
    const ssr = container.innerHTML !== ''
    app = createVueApp( pageContext, ssr )
    if( pageContext.config.vuePlugins ) {
      pageContext.config.vuePlugins.forEach( ( { plugin, options } )=>{
        app.use( plugin, options )
      } )
    }
    app.mount( container )
  }
  else {
    // Client routing
    // See https://vike.dev/server-routing-vs-client-routing

    app.changePage( pageContext )

    // Get the page's `title` config value, which may be different from the
    // previous page. It can even be null, in which case we should unset the
    // document title.
    const title = getTitle( pageContext )
    document.title = title || ''
  }
}

export { onRenderClient }
