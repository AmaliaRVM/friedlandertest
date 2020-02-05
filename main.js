//Elements

//Root
const app = document.getElementById('root')

//Main container
const container = document.createElement('div')
container.setAttribute('class', 'container')

//Top Button Function
const topButton = document.getElementById("topButton")
window.onscroll = function () {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        topButton.style.display = "block"
    } else {
        topButton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Append
app.appendChild(container)




function addsubOne(what) {
    var wholepath = button.getAttribute('mycurrentpage')
    console.log(wholepath)
    if ( what == 'plus') {
        var number = parseInt(wholepath.split("page=")[1])+1;
    } else if (what === 'minus') {
        var number = parseInt(wholepath.split("page=")[1])-1;
    }

        
    console.log(number)
    wholepath = wholepath.split("page=")[0]+'page='+number.toString();
    // get the new api url 
    var elem = document.getElementsByClassName('cardContainer');
    console.log(elem.length)
    const myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        console.log(myi)
        elem[0].parentNode.removeChild(elem[0])}
    request.open('GET',wholepath, true)
    request.send() 
    button.setAttribute('mycurrentpage', wholepath)
    
    // do all the info.data stuff as already done twice before
}

//For the API function
function infoData(myinfo){
    myinfo.data.forEach(works => {
        

        const cardContainer = document.createElement('div')
        cardContainer.setAttribute('class', 'cardContainer')

        const infoContainer = document.createElement('div')
        infoContainer.setAttribute('class', 'infoContainer')

        const paintingContainer = document.createElement('div')
        paintingContainer.setAttribute ('class', 'paintingContainer')

        const title = document.createElement('h2')
        title.textContent = works.title

        const artist = document.createElement('h3')
        artist.textContent = works.artist

        const material = document.createElement('p')
        material.textContent = works.material

        const painting = document.createElement('img')
        painting.src = works.image_url


        container.appendChild(cardContainer)
        cardContainer.appendChild(paintingContainer)
        cardContainer.appendChild(infoContainer)
        infoContainer.appendChild(title)
        infoContainer.appendChild(artist)
        infoContainer.appendChild(material) 
        paintingContainer.appendChild(painting)
    })
}

//Request
var request = new XMLHttpRequest()

request.open('GET', 'https://friedlander.kikirpa.be/api/v1/works', true)

request.onload = function() {  
    // Begin accessing JSON data here 
var info = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
        infoData(info);
    } else {
        console.log('error')
    }
}  

// Send request
request.send() 

//Search Form
const searchBar = document.querySelector("input");
const button = document.querySelector("button");
button.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?page=1' )

button.addEventListener('click', function(event){
    event.preventDefault();
    var elem = document.getElementsByClassName('cardContainer');
    console.log(elem.length)
    const myoriglen = elem.length
    for (myi = 0;  myi < myoriglen; myi++) {
        console.log(myi)
        elem[0].parentNode.removeChild(elem[0])}
    console.log(request);
    var request2 = new XMLHttpRequest();
    this.setAttribute('mycurrentpage', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value+'&page=1' )
    request2.open('GET', 'https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar.value, true)
    console.log(request2);
    request2.onload = function() { 
        console.log('Hellooooooooooooooooooooooooooooooooo');
    // Begin accessing JSON data here
    var info = JSON.parse(this.response);
    
    console.log(request2.status);
    if (request2.status >= 200 && request2.status < 400) {
        infoData(info);
    } else {
        console.log('error')
    }
}  
// Send request
request2.send()    
console.log('at the end')   
})




/* fetch('https://friedlander.kikirpa.be/api/v1/works?filter[title]='+searchBar)
    .then(response => {
        return response.json()
    })
    .then((jsonResponse) => {
        console.log(jsonResponse.data)
    }); */


    





