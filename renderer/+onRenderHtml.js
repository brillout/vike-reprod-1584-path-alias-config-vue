// https://vike.dev/onRenderHtml

import { renderToNodeStream, renderToString } from '@vue/server-renderer'
import { dangerouslySkipEscape, escapeInject } from 'vike/server'

import { getTitle } from '#root/renderer/getTitle'
import { createVueApp } from '#root/renderer/app'

/**
 * @param pageContext
 * @returns {Promise<{pageContext: {enableEagerStreaming: boolean}, documentHtml: *}>}
 */
const onRenderHtml = async ( pageContext )=>{
  let pageStream = ''
  if( pageContext.Page !== undefined ) {
    // SSR is enabled
    const app = createVueApp( pageContext )
    if( pageContext.config.vuePlugins ) {
      pageContext.config.vuePlugins.forEach( ( { plugin, options } )=>{
        app.use( plugin, options )
      } )
    }
    pageStream = renderToNodeStream( app )
  }

  const title = getTitle( pageContext )
  const titleTag = !title ? '' : escapeInject`<title>${title}</title>`

  const { description } = pageContext.config
  const descriptionTag = !description ? '' : escapeInject`<meta name="description" content="${description}" />`

  let headHtml = ''
  if( pageContext.config.Head !== undefined ) {
    const app = createVueApp( pageContext, /*ssrApp*/ true, /*renderHead*/ true )
    headHtml = await renderToString( app )
  }

  const lang = pageContext.config.lang || 'en'

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${titleTag}
        ${descriptionTag}
        ${dangerouslySkipEscape( headHtml )}
      </head>
      <body class="dark:bg-dark-200">
        <div id="page-view">${pageStream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true
    }
  }

}

export { onRenderHtml }
