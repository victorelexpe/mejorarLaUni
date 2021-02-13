import fetch from 'isomorphic-unfetch'

export const createIdea = (idea, token) => {
    return fetch('/api/post/idea', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            idea
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}

export const getIdeas = () => {
    return fetch('/api/get/ideas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((r) => {
        return r.json()
    })
    .catch(err => console.log(err))
}

export const deleteIdea = (slug, token) => {
    return fetch('/api/delete/idea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            slug,
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}
