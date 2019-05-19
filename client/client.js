const form = document.querySelector("form"); //grabbing an element on the page
const loadingElement = document.querySelector(".loading")
const listsElement = document.querySelector(".lists");
const API_URL = 'http://localhost:5000/lists';


loadingElement.style.display = "none";
listAllLists();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const content = formData.get("content");

    const list = {
        name,
        content
    }

    form.style.display = 'none';
    loadingElement.style.display = '';

    //sends data to server to be inserted into db
    fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(list),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(createdList => {
            console.log(createdList);
            form.reset();
            loadingElement.style.display = 'none';
            form.style.display = '';
        });

});

function listAllLists() {
    fetch(API_URL)
        .then(response => response.json())
        .then(lists => {
            console.log(lists);

            lists.forEach(list => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = list.name;

                const contents = document.createElement('p');
                contents.textContent = list.content;

                div.appendChild(header);
                div.appendChild(contents);

                listsElement.appendChild(div);

            })

        })
}

//