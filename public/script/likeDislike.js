window.onload = function () {
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");

  likeBtn.addEventListener("click", function (e) {
    let postId = likeBtn.dataset.post;
    reqLikeDislike("likes", postId)
      .then((res) => res.json())
      .then((data) => {
        let likeText = data.liked ? "Liked" : "Like";
        likeText = likeText + `( ${data.totallikes})`;
        let disLikeText = `Dislike ( ${data.totalDislikes})`;

        likeBtn.innerHTML = likeText;
        dislikeBtn.innerHTML = disLikeText;
      })
      .catch((e) => {
        console.log(e);
        alert(e.message);
      });
  });

  dislikeBtn.addEventListener("click", function (e) {
    let postId = likeBtn.dataset.post;
    reqLikeDislike("dislikes", postId)
      .then((res) => res.json())
      .then((data) => {
        let disLikeText = data.disliked ? "Disliked" : "Dislike";
        disLikeText = disLikeText + `(${data.totalDislikes})`;
        let likeText = `Like ( ${data.totallikes})`;

        likeBtn.innerHTML = likeText;
        dislikeBtn.innerHTML = disLikeText;
      })
      .catch((e) => {
        console.log(e);
        alert(e.message);
      });
  });

  function reqLikeDislike(type, postId) {
    let headers = new Headers();
    headers.append("Accept", "Application/JSON");
    headers.append("Content-type", "Application/JSON");

    let req = new Request(`/api/${type}/${postId}`, {
      mehod: "GET",
      headers,
      mode: "cors",
    });

    return fetch(req);
  }
};
