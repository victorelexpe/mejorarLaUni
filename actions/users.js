import fetch from 'isomorphic-unfetch'

export const createUser = (user) => {
    return fetch('/api/post/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}

export const getUsers = (token) => {
    return fetch('/api/get/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}

export const getUser = (email, token) => {
    return fetch('/api/get/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))

}

export const deleteUser = (email, token) => {
    return fetch('/api/delete/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email
        }),
    })
    .then((r) => {
        return r.json()
    }).catch(err => console.log(err))
}