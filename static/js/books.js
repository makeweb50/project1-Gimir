
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#form').onsubmit = () => {



        const xhr = new XMLHttpRequest();
        const currency = document.querySelector('#search').value;
        xhr.open('POST', '/booklist', true);

        xhr.onload = () => {

            const data = JSON.parse(xhr.responseText);

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


              document.querySelectorAll('.show').forEach(e =>{
                e.onclick = (e) => {
                  document.querySelector('.showBook').style.display = "block";
                  var word
                  if (e.target.className !== "book") word = e.target.parentElement.children[0].innerHTML
                  else word = e.target.children[0].innerHTML
                  console.log(word)

                  const xhr = new XMLHttpRequest();
                  const currency = word;
                  xhr.open('POST', '/book', true);

                  xhr.onload = () => {

                    const data = JSON.parse(xhr.responseText);

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
                      const xhr = new XMLHttpRequest();
                      var rate = document.querySelector('#rate').value;
                      var text = document.querySelector('#text').value;

                      word = {"rate": rate, "text": text, "isbn": isbn}

                      const currency = word;
                      xhr.open('POST', '/comment', true);

                      xhr.onload = () => {
                        const data = JSON.parse(xhr.responseText);

                        if (data.allow){
                          var parDiv = document.createElement('div');
                          parDiv.className = 'comment';
                          var head = document.createElement('div');
                          head.className = 'nick';
                          var text = document.createElement('div')
                          text.className = 'text';
                          var newh2 = document.createElement('h2')
                          var newh5 = document.createElement('h5')
                          var newP = document.createElement('p')

                          newh2.innerHTML = data[0].user;
                          newh5.innerHTML = data[0].rate;
                          newP.innerHTML = data[0].comment;

                          head.appendChild(newh2);
                          head.appendChild(newh5);
                          parDiv.appendChild(head);
                          text.appendChild(newP)
                          parDiv.appendChild(text);

                          rates.appendChild(parDiv);

                        }



                      }

                      // const data = new FormData();
                      // data.append('currency', currency);
                      xhr.setRequestHeader("Content-Type", "application/json");
                      xhr.send(JSON.stringify(currency));
                      return false;

                    };

                  }

                  const data = new FormData();
                  data.append('currency', currency);
                  xhr.send(data);
                  return false;

                }
              });



        }

        const data = new FormData();
        data.append('currency', currency);

        xhr.send(data);
        return false;
    };

    document.querySelector('#sub').addEventListener('click', () => {
      document.querySelector('#ser').style.top = "5px"
      document.querySelector('#nnav').className = "sNav"
      document.querySelector('#log').style.top = "5px"
      document.querySelector('#but').style.background = "rgba(37, 43, 51, 1)"
    });



});
