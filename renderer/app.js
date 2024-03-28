import { createApp, createSSRApp, defineComponent, h, markRaw, reactive } from 'vue'

import PageShell from "#root/renderer/PageShell.vue"

/**
 * Isomorphic function to create a Vue app.
 *
 * @param pageContext Object providing the Vue component to be rendered, the props for that component, and additional
 *                    config and data.
 * @param ssrApp Whether to use `createSSRApp()` or `createApp()`. See https://vuejs.org/api/application.html
 * @param renderHead If true, `pageContext.config.Head` will be rendered instead of `pageContext.Page`.
 */
function createVueApp( pageContext, ssrApp = true, renderHead = false ) {
  const { Page } = pageContext
  const Head = renderHead ? ( pageContext.config.Head ) : undefined

  let rootComponent
  const PageWithLayout = defineComponent( {
    data: ()=>( {
      Page:      markRaw( Head ? Head : Page ),
      pageProps: markRaw( pageContext.pageProps || {} ),
      config:    markRaw( pageContext.config )
    } ),
    created() {
      rootComponent = this
    },
    render() {
      let page
      if( !!this.config.Layout && !renderHead ) {
        page = h(
          this.config.Layout,
          {},
          {
            default: ()=>{
              return h( this.Page, this.pageProps )
            }
          }
        )
      }
      else {
        page = h( this.Page, this.pageProps )
      }
      return h( PageShell, {}, { default: ()=>page } )
    }
  } )

  const app = ssrApp ? createSSRApp( PageWithLayout ) : createApp( PageWithLayout )

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  Object.assign( app, {
    changePage: ( pageContext )=>{
      Object.assign( pageContextReactive, pageContext )
      rootComponent.Page = markRaw( pageContext.Page )
      rootComponent.pageProps = markRaw( pageContext.pageProps || {} )
      rootComponent.config = markRaw( pageContext.config )
    }
  } )

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive( pageContext )

  return app
}

export { createVueApp }
