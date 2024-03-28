import Fastify from 'fastify'

import { Transform } from 'node:stream'
import { renderPage } from 'vike/server'

import { root } from '#root/server/root'

start().then().catch( console.error )

async function start() {
  const port = '9710'
  const host = '0.0.0.0'
  const app = Fastify({ logger: true })
  // Add express-like-middleware support...we need this for vite to work in dev/HMR mode
  await app.register( await import( '@fastify/middie' ) )
  app.route( { url: '*', method: 'GET', handler: vikePageHandler } )
  // We instantiate Vite's development server and integrate its middleware to our server.
  // ⚠️ We instantiate it only in development. (It isn't needed in production, and it
  // would unnecessarily bloat our production server.)
  const vite = await import( 'vite' )
  const viteDevMiddleware = (
    await vite.createServer( { root: root, server: { middlewareMode: true } } )
  ).middlewares
  app.use( viteDevMiddleware )
  try {
    await app.ready()
    await app.listen( { port: port, host: host } )
    app.log.info( `ROUTES:\n${app.printRoutes()}` )
  }
  catch( error ) {
    console.log( error )
    // Likely an uncaught error that made it all the way to here, leaking resources etc. Kill web app.
    if( error ) {
      app.log.error(
        error, "!!!UNCAUGHT ERROR!!! Very likely to leak resources b/c not carefully handled in catch(). Will exit web server process."
      )
      process.exit( 1 )
    }
  }
  return app
}

async function vikePageHandler( req, rpl ) {
  const pageContextInit = { urlOriginal: req.originalUrl }
  const pageContext = await renderPage( pageContextInit )
  const { httpResponse } = pageContext
  if( !httpResponse ) {
    rpl.code( 500 )
    return rpl //next()
  }
  else {
    const transform = new Transform( {
      transform( chunk, encoding, cb ) {
        this.push( chunk )
        cb()
      }
    } )
    const { statusCode, headers } = httpResponse
    for( const [ name, value ] of headers ) {
      rpl.header( name, value )
    }
    httpResponse.pipe( transform )
    rpl.code( statusCode )
    return rpl.send( transform )
  }
}
