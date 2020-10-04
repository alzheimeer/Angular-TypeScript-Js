//Your public key
//c04b74a49a5ce3cdac5d87b4b1391d15
//Your private key
//d708e1c39abf0619d00b9c280cbb9d7cb2bf37f4
//hash
//853f2ae2e46ce9e460ec5abc43f08bac
//https://gateway.marvel.com:443/v1/public/characters?apikey=c04b74a49a5ce3cdac5d87b4b1391d15
//1d708e1c39abf0619d00b9c280cbb9d7cb2bf37f4c04b74a49a5ce3cdac5d87b4b1391d15
//hash md5
//853f2ae2e46ce9e460ec5abc43f08bac
const marvel = {
        render: () => {

                const urlAPI = 'https://gateway.marvel.com:443/v1/public/characters?ts=1&limit=23&apikey=c04b74a49a5ce3cdac5d87b4b1391d15&hash=853f2ae2e46ce9e460ec5abc43f08bac';
                let html = '';

                fetch(urlAPI)
                        .then(res => res.json())
                        .then((json) => {
                                for (const re of json.data.results) {
                                        html += `
                                        <div class="col">
                                        <div class="card" style="width: 10rem;">
                                        <a href="${re.urls[1].url}" target="_blank">
                                        <img src="${re.thumbnail.path}.${re.thumbnail.extension}" class="card-img-top" alt="${re.name}">
                                        </a>
                                        <div class="card-body">
                                        <h5 class = "card-title" > ${re.name}</h5>
                                        <p class="card-text">ID: ${re.id}</p>
                                        </div>
                                        </div>
                                        </div>
                                        `
                                }
                                document.getElementById("datosPersonajes").innerHTML = html;
                        })
        }
};
marvel.render();