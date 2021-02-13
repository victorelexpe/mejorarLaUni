import fetch from 'isomorphic-unfetch'

export const createUniversity = (name, token) => {
    return fetch('/api/post/university', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}

export const getUniversities = () => {
    return fetch('/api/get/universities', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}

export const deleteUniversity = (slug, token) => {
    return fetch('/api/delete/university', {
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
