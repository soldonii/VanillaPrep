### 1. 만들어야 하는 페이지

<!-- 1. main page(https://news.ycombinator.com/news)
2. welcome page(https://news.ycombinator.com/newswelcome.html)
3. new page(https://news.ycombinator.com/newest)
4. thread page(https://news.ycombinator.com/threads?id=dhs0113)
5. past page(https://news.ycombinator.com/front)
6. comments page(https://news.ycombinator.com/newcomments)
7. ask page(https://news.ycombinator.com/ask)
8. show page(https://news.ycombinator.com/show)
9. jobs page(https://news.ycombinator.com/jobs)
10. submit page(https://news.ycombinator.com/submit) -->

# 1. 해커 뉴스 만들기
Hacker News API를 이용하여 해커 뉴스 웹사이트를 똑같이 만들어보시면 좋을것 같습니다. 특히, Article 상세 정보 비동기 처리의 순서에 대해 면밀하고 정확하게 판별해보시기 바랍니다.

## Top Stories
예를 들어, Top Stories는 아래의 주소로 AJAX 요청을 보내 Item ID정보를 받을 수 있습니다.

```javascript
// jsbin: https://jsbin.com/tapelar/edit?js,console
$.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty', function (list) {
  console.log(list); // [ 123, 456, 789 ] 아이템 ID들
});
```

## Item Details
위의 요청에서 받은 ID를 이용하여 아래와 같이 각 스토리에 대한 상세 정보를 받을 수 있습니다.

```javascript
// jsbin: https://jsbin.com/yugafus/edit?js,console
$.get('https://hacker-news.firebaseio.com/v0/item/123.json?print=pretty', function (item) {
  console.log(item); // 123이라는 ID를 가진 스토리에 대한 상세 정보
});
```

유의할 점
1. AJAX 요청을 보내는 작업을 위해 jQuery를 사용하셔도 괜찮습니다. 
  다만, AJAX 요청을 보내는 부분 이외에 화면 작업은 바닐라 자바스크립트로 기존처럼 진행하세요.
2. Top Stories에서 반환받은 배열 내의 ID 순서와 실제로 화면에 그려진 Item List의 순서가 일치해야만 합니다.
3. 아이템 상세 정보에 없는 Hacker News 메인 페이지의 부분들은 임의로 지정하여 작업하셔도 무관합니다.
4. Hacker News 메인 페이지에서 스토리 아이템을 순서대로 보여주는 작업 이외에는 생략하셔도 괜찮습니다.
5. Promise는 사용하지 마세요.