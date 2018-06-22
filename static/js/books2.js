document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#form').onsubmit = () => {
    var search = [];
    search.push(document.querySelector('#search').value);
    makeXHR('/booklist', 'POST', search).then(showBookList, errorHandler);
    return false;
  }
  document.querySelector('#sub').addEventListener('click', navUpp);


});


function makeXHR(url, method, currency) {
  var promiseObj = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    const data = new FormData();
    for (let i = 0; i < currency.length; i++) data.append(i, currency[i]);
    //data.append('currency', currency);
    xhr.send(data);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('xhr done successfully');
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(xhr.status);
          console.log('xhr failed');
        }
      } else {
        console.log('xhr processing going on');
      }
    }
    console.log('request sent successfully');
  });
  return promiseObj;
}

function showBookList(data) {
  document.querySelector('.result').innerHTML = "";

  for (let i = 0; i < data.length; i++)
  {
    var newA = document.createElement('a')
    newA.className = "show"
    var newD = document.createElement('div')
    var newH2 = document.createElement('h2')
    var newH3 = document.createElement('h3')
    newH2.innerHTML = data[i].title;
    newH3.innerHTML = data[i].author;
    newD.className = 'book'
    newD.appendChild(newH2)
    newD.appendChild(newH3)
    newA.appendChild(newD)
    document.querySelector('.result').appendChild(newA);
  }
  document.querySelectorAll('.show').forEach(e => {
    e.onclick = e => {
      document.querySelector('.showBook').style.display = "block";
      var word = [];
      if (e.target.className !== "book") word.push(e.target.parentElement.children[0].innerHTML);
      else word.push(e.target.children[0].innerHTML);
      console.log(word)

      makeXHR('/book', 'POST', word).then(showBook, errorHandler);
      return false;
    }
  });
}

function errorHandler(status) {
  console.log('Error status: ', status);
  alert('Process failed! Check out the console');
}

function navUpp() {
  document.querySelector('#ser').style.top = "5px";
  document.querySelector('#nnav').className = "sNav";
  document.querySelector('#ser').className = "resLeft";
  document.querySelector('#log').style.top = "5px";
  document.querySelector('#but').style.background = "rgba(37, 43, 51, 1)";
}

function showBook(data) {
  console.log(data)

  var cover = document.querySelector('#cover');
  cover.className = "covup";

  if (data[3].allow) document.querySelector('#rateForm').style.display = "block";
  else document.querySelector('#rateForm').style.display = "none";

  document.querySelector('#title').innerHTML = data[0].title;
  document.querySelector('#author').innerHTML = data[0].author;
  document.querySelector('#year').innerHTML = data[0].year;
  document.querySelector('#rating').innerHTML = data[2].av_rating;
  document.querySelector('#review').innerHTML = data[2].wr_count;
  document.querySelector('#isbn').innerHTML = data[0].isbn
  var isbn = data[0].isbn

  var rates = document.querySelector('.rates')
  rates.innerHTML = '';

  for (let i = 0; i < data[1].length; i++) {
    var parDiv = document.createElement('div');
    parDiv.className = 'comment';
    var head = document.createElement('div');
    head.className = 'nick';
    var text = document.createElement('div')
    text.className = 'text';
    var newPar = document.createElement('p')
    var newSpan1 = document.createElement('span')
    var newSpan2 = document.createElement('span')
    var newP = document.createElement('p')

    newSpan1.innerHTML = data[1][i].usern + " - ";
    newSpan2.innerHTML = data[1][i].grade + "/5";
    newP.innerHTML = data[1][i].comment;
    newPar.appendChild(newSpan1)
    newPar.appendChild(newSpan2)
    head.appendChild(newPar);
    parDiv.appendChild(head);
    var hr = document.createElement('hr')
    parDiv.appendChild(hr)
    text.appendChild(newP)
    parDiv.appendChild(text);

    rates.appendChild(parDiv);
  }

  cover.addEventListener('click', () => {
    document.querySelector('.showBook').style.display = "none";
    cover.className = "covdown";
  });

  document.querySelector('#rateForm').onsubmit = () => {
    var rate = document.querySelector('#rate').value;
    var text = document.querySelector('#text').value;
    var book = data[0].title;
    var comment = ['insert', rate, text, isbn, book];
    makeXHR('/book', 'POST', comment).then(showBook, errorHandler);
    return false;
  }
}
