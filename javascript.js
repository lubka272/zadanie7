let images=document.getElementsByTagName("IMG");
let order= [];
let jsonPhotos;
let numberOfImages=0;
let slideIndex;
let searchBar = document.getElementById('searchBar');
let filteredImages=[];

searchBar.addEventListener('keyup',(e)=>{


    let searchString = e.target.value;
    if (searchString.trim()===""){


        filteredImages=order;
        showPhotos(order);
        return;
    }


    filteredImages = order.filter(character => {

        return jsonPhotos[character].title.toLowerCase().includes(searchString) || jsonPhotos[character].description.toLowerCase().includes(searchString);
    });

    hidePhotos(order);

    showPhotos(filteredImages);
});
function hidePhotos(order){
        order.map((value) =>{
            images[value].style.display = "none";
            images[value+numberOfImages].style.display = "none";
            images[value+(2*numberOfImages)].style.display="none";
        })
}
function showPhotos(order){

    order.map((value) =>{
        images[value].style.display = "block";
        images[value+numberOfImages].style.display = "block";
        images[value+(2*numberOfImages)].style.display="block";
    })
}
document.addEventListener("DOMContentLoaded", () => {
fetch('photos.json')
        .then(response => response.json())
        .then(json => {
            numberOfImages = json.photos.length;
            jsonPhotos=json.photos;
             loadPage(jsonPhotos);

            //checkCookie(); nefunguje ale snazila som sa :D

        });

});


function loadPage(photos){

    photos.forEach((item, index) => {
        loadPhoto(item, index);
        order.push(index);
        filteredImages.push(index);
    });
    return order;
}
// function loadCookiePage(cookieOrder){
//
//     jsonPhotos.forEach((item, index) => {
//         loadPhoto(item, cookieOrder[index]);
//         order.push(cookieOrder[index]);
//     });
//
// }

function  loadPhoto(item, index){
    const row = document.getElementById('row');

    let img = document.createElement('img');
    img.setAttribute("style", "width:100%");
    let column = document.createElement('div');
    column.classList.add('column');
    column.setAttribute("ondrop","updateOrder()");
    img.setAttribute("src", "images/"+item.src);
    img.setAttribute("alt", item.title);
    img.id = (index+1);

    let img0 = img.cloneNode();
    img0.setAttribute('class','hover-shadow cursor');

    img0.setAttribute("onclick", "openModal();currentSlide(id)");
    img0.setAttribute("src", "images/smaller/"+item.src);
    column.appendChild(img0);
    row.appendChild(column);

    let wrapper1=document.getElementById('wrapper1');
    let mySlides = document.createElement('div');

    mySlides.classList.add('mySlides');
    let overlay= document.createElement('div');
    overlay.setAttribute('class','overlay');
    let text= document.createElement('div');
    text.setAttribute('class','text');
    text.innerHTML=item.description;
    mySlides.appendChild(img.cloneNode());
    overlay.appendChild(text);
    mySlides.appendChild(overlay);
    wrapper1.appendChild(mySlides);


    let wrapper2=document.getElementById('wrapper2');
    let mySlides2 = document.createElement('div');
    mySlides2.classList.add('column');

    let img2 = img.cloneNode();
    img2.setAttribute("src", "images/smaller/"+item.src);
    img2.setAttribute("onclick", "currentSlide(id)");

    img2.setAttribute('class','demo cursor');
    mySlides2.appendChild(img2);
    wrapper2.appendChild(mySlides2);

}

function openModal() {
    document.getElementById("myModal").style.display = "block";
}
var interval;
function closeModal() {
    clearInterval(interval);
    document.getElementById("myModal").style.display = "none";
}

function plusSlides(n) {
    slideIndex=Number(slideIndex); // prekonvertovanie stringu lebo beriem ID
    let filteredIndex=filteredImages.indexOf(slideIndex-1);

    if(filteredIndex+n >= filteredImages.length){
        slideIndex = filteredImages[0]+1;
        showSlides(slideIndex);
        return;
    }else if(filteredIndex+n <= 0){
        slideIndex = filteredImages[numberOfImages-1]+1;
        showSlides(slideIndex);
        return;
    }

    slideIndex=filteredImages[filteredIndex+n]+1;
    showSlides(slideIndex);

}

function currentSlide(n) {

    showSlides(slideIndex = n);
}

function showSlides(n) {

    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
}

const dropItems = document.getElementById('row');

// drag and drop
new Sortable(dropItems,{
    animation:350,
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',

});


function play(){
    interval= setInterval(()=>{plusSlides(1)},1000);
}
function stop(){
    clearInterval(interval)
}



// // https://www.w3schools.com/js/js_cookies.asp
// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     let expires = "expires="+ d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }
// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(let i = 0; i <ca.length; i++) {
//         let c = ca[i];
//         while (c.charAt(0) === ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) === 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }
// function checkCookie() {
//
//
//      let cookieOrder = getCookie("order");
//     if (cookieOrder !== "") {
//         for (let i = 0; i < numberOfImages; i++) {
//
//             console.log(jsonPhotos[(cookieOrder[i])]);
//             loadCookiePage(cookieOrder);
//         }
//
//     } else {
//         loadPage(jsonPhotos);
//     }
// }

function updateOrder () {


    let row =document.getElementById('row');
    let newOrderImages=  row.getElementsByTagName('IMG');
    order=[];

    for (let i = 0; i < numberOfImages; i++) {

        order.push(newOrderImages.item(i).id-1);
    }

    remove();
    for (let i = 0; i < numberOfImages; i++) {

        loadPhoto(jsonPhotos[order[i]],i)
    }
    hidePhotos(order);
    showPhotos(filteredImages);
   // setCookie("order",order,30);


}
function remove() {

    $('.column').remove();
    $('.mySlides').remove();
}

