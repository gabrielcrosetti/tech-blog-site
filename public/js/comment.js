async function commentFormHandler(event) {
  event.preventDefault();

  // grabs the comment text
  const content = document
    .querySelector('textarea[name="comment-body"]')
    .value.trim();
  // grabs the id
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  // if comment was entered, post comment
  if (content) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        content,
        post_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if post was successful
    if (response.ok) {
      document.location.reload();
    } else {
      // alert error if unsuccessful
      alert(response.statusText);
    }
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", commentFormHandler);
