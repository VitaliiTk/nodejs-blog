const delBtn = document.querySelectorAll('.delete-btn')
delBtn.forEach(element => {
    element.addEventListener('click', (item) => {
        item.stopPropagation()
        const id = element.getAttribute('data-id');
        console.log(id);
        fetch(`/posts/${id}`, {
            method: 'delete'
        }).then( () => window.location.href = '/posts')
    })
})

const editBtn = document.querySelectorAll('.edit-btn')
editBtn.forEach(element => {
    element.addEventListener('click', (item) => {
        item.stopPropagation()
        console.log(element.getAttribute('data-id'));
    })
})