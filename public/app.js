caches.open('markdown').then(cache => {
        cache.keys().then(keys => {
            for (let key of keys) {
                let url=key.url
                key = key.url.split('/').pop()
                let main=document.getElementById('main'),
                list=document.createElement('li'),
                href=document.createElement('a')
                href.href=url
                href.textContent=key
                list.classList.add('list-group-item')
                list.append(href)
                main.append(list)
            }
        })
    })
    fetch('/md').then(res=>res.json()).then(json=>{
        for (const name of json.files) {
            let main=document.getElementById('maid'),
            list=document.createElement('li'),
            href=document.createElement('a')
            href.href='/markdown/'+name
            href.textContent=name
            list.classList.add('list-group-item')
            list.append(href)
            main.append(list)
        }
        
    })    