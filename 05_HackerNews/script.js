(function () {  
  $.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', (storyArr) => {
    let top30 = storyArr.slice(0, 30);
    console.log(top30);
    multipleReq(top30, counter);
  });
  
function paintDOM(arr) {
  console.log('final', arr);
  let addArticle = defineArticleBlock();
  
  for (let i = 0; i < arr.length; i++) {
    addArticle(arr[i], i);
    attachLink(arr[i]);
  }
  
  const mainMid = document.querySelector('.main-mid');
  for (let divElem of mainMid.children) {
    divElem.querySelector('.arrow').addEventListener('click', (e) => {
      e.currentTarget.style.visibility = 'hidden';

      const elemBefore = divElem.querySelector('.article-info');
      elemBefore.insertAdjacentHTML('afterend', '  |  <span class="article-info underline vote"><a href="#">unvote</a></span>');

      divElem.querySelector('.vote').addEventListener('click', (e) => {
        e.currentTarget.style.display = 'none';
        divElem.querySelector('.arrow').style.visibility = 'visible';
      });
    });
  }
}

  let counter = 0;
  function multipleReq(target, n, resultArr = []) {
    if (resultArr.length === 30) return paintDOM(resultArr);
  
    $.get(`https://hacker-news.firebaseio.com/v0/item/${target[n]}.json?print=pretty`, (resp0) => {
      resultArr.push(resp0);
      return multipleReq(target, n+1, resultArr);
    });
  }
  
  function defineArticleBlock() {
    const mainMid = document.querySelector('.main-mid');
    const articleBlock = `
        <div class="article">
          <div class="article-top">
            <span class="rank"></span>
            <span class="arrow"><img src="./assets/uparrow.svg" alt="uparrow"></span>
            <span class="article-title"><a class="title" target="_blank"></a></span>
            <span class="article-url">(<a href="#" class="url"></a>)</span>
          </div>
          <div class="article-bottom">
            <span class="article-info"><span class="points"></span> points by <a href="#" class="underline author"></a> 
              <a href="#" class="underline time"> ago</a></span> |
            <span class="article-info underline"><a href="#" class="hide">hide</a></span> |
            <span class="article-info underline"><a href="#" class="comments"> comments</a></span>
          </div>
        </div>`
    return function add(obj, n) {
      mainMid.innerHTML += articleBlock;
      const last = mainMid.lastChild;
  
      last.querySelector('.rank').textContent = `${n+1}.`;
      last.querySelector('.title').textContent = obj.title;
      last.querySelector('.points').textContent = obj.score;
      last.querySelector('.author').textContent = obj.by;
      last.querySelector('.time').textContent = convertTime(obj.time);
      // last.querySelector('.hide').textContent = 
      last.querySelector('.comments').textContent = `${obj.descendants} comments`;
  
      if (obj.url) last.querySelector('.url').textContent = shortenURL(obj.url);
      else last.querySelector('.article-url').textContent = '';
    }
  }
  
  function shortenURL(url) {
    let newUrl = '';
    if (url.indexOf('www.') > -1) newUrl = url.slice(url.indexOf('www.') + 4);
    else newUrl = url.slice(8);
  
    return newUrl.slice(0, newUrl.indexOf('/'));
  }
  
  function convertTime(num) {
    let now = new Date();
    let creationDate = new Date(num * 1000);
    return `${now.getHours() - creationDate.getHours() - 1} hours ago`;
  }
  
  function attachLink(obj) {
    const mainMid = document.querySelector('.main-mid');
    const last = mainMid.lastChild;
  
    if (obj.url) last.querySelector('.title').setAttribute('href', obj.url);
    if (obj.url) last.querySelector('.url').setAttribute('href', `https://news.ycombinator.com/from?site=${shortenURL(obj.url)}`);
    last.querySelector('.author').setAttribute('href', `https://news.ycombinator.com/user?id=${obj.by}`);
    last.querySelector('.time').setAttribute('href', `https://news.ycombinator.com/item?id=${obj.id}`);
    last.querySelector('.comments').setAttribute('href', `https://news.ycombinator.com/item?id=${obj.id}`);
  }
})();


// data form
// {by: "wglb", descendants: 30, id: 21547945, kids: Array(10), score: 55, …}
// by: "wglb"
// descendants: 30
// id: 21547945
// kids: (10) [21562145, 21562102, 21562510, 21548319, 21562428, 21562317, 21562002, 21562034, 21562027, 21561902]
// score: 55
// time: 1573846193
// title: "A Black Hole Threw a Star Out of the Milky Way Galaxy"
// type: "story"
// url: "https://www.nytimes.com/2019/11/14/science/stars-black-hole-milky-way.html"

