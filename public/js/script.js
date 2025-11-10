//alert("Success");

//event listeners

const keywordInput = document.getElementById('keywordInput');
const tooShort = document.getElementById('tooShort');
if (keywordInput){
    keywordInput.addEventListener('input', checkLength);
}
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks){
    authorLink.addEventListener("click", getAuthorInfo);
}

function $(selector) {
    return document.querySelector(selector);
}

function checkLength(){
    let keyword = keywordInput.value;
    console.log(keyword);
    if (keyword.length > 0 && keyword.length < 3){
        tooShort.innerHTML = `<h3>Keyword should be at least 3
                                    characters long</h3>`;
    } else {
        tooShort.innerHTML = "";
    }
}


async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    //console.log(data);
    let authorInfo = $("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                ${data[0].lastName} </h1>`;
    authorInfo.innerHTML += `<img src="${data[0].portrait}" 
                            width="200"> <br>`;
    const dob = new Date (data[0].dob);
    const dod = new Date (data[0].dod);

    const dobFormatted = `${dob.getMonth() + 1 }-${dob.getDate()}-${dob.getFullYear()}`;
    const dodFormatted = `${dod.getMonth() + 1}-${dod.getDate() }-${dod.getFullYear()}`;
    authorInfo.innerHTML += `<h3>${data[0].biography}...<br><br>
                               Date of birth: ${dobFormatted}<br>
                                <h3>Date of death: ${dodFormatted}`;

}
