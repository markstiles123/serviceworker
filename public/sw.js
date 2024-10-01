import {marked} from 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
let partials=['/partials/head.html','/partials/footer.html','/app.js','/app.css','/bootstrap/css/bootstrap.min.css','bootstrap/js/bootstrap.bundle.min.js'];
self.addEventListener('install',event=>{
    event.waitUntil(caches.open('partials').then(cache=>{
        return cache.addAll(partials)
    }
    ))
})

self.addEventListener('fetch',event=>{
        event.respondWith(router(event.request))
})
function router(request) {
    if (request.mode=="navigate") {
        if (request.url.includes('markdown')) {
            return stream(request) 
        }
        return cacheNetwork(request)
    }
    if (request.url.endsWith('/md')) {
        return fetch(request)
    }
    return cacheNetwork(request)
}
async function stream(request) {
    let sm=new ReadableStream({
        async start(controller){
            await temp(partials[0],controller)
            await md(request,controller,'markdown')
            await temp(partials[1],controller)
            controller.close()
        }
    })
    return new Response(sm,{headers:{'content-type':'text/html'}})
}
async function md(request,controller,name) {
    let response=await cacheNetwork(request,name),
    text=await response.text(),
    encoder=new TextEncoder()
    controller.enqueue(encoder.encode(marked.parse(text)))
}
function cacheNetwork(request,version='v') {
    return caches.match(request).then(response=>{
        return response || fetch(request).then(response=>{
            let clone=response.clone()
            return caches.open(version).then(cache=>{
                cache.put(request,clone)
                return response
            })
        })
})
}
async function temp(name,controller) {
    let cache=await caches.open('partials'),
    response=await cache.match(name),
    body=response.body.getReader()

    while (true) {
        let {done,value}=await body.read()
        if (done) {
            body.releaseLock()
            break
        }
        controller.enqueue(value)
    }
    return
}
