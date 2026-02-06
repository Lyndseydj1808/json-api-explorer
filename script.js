// Instructions
// You will add interaction with a public API to the small web application in this
// https://github.com/LaunchCodeEducation/json-api-explorer Github repo by sending
// and receiving JSON data using the fetch() method in JavaScript. This activity
// reinforces how to:
// ● Make HTTP GET and POST requests
// ● Parse and display JSON responses
// ● Handle errors and loading states in asynchronous code
// ● Build user interfaces that reflect dynamic data
// Tasks
// 1. Fetch and Display Posts
// ● Use fetch() to retrieve a list of posts from
// https://jsonplaceholder.typicode.com/posts
// ● Convert the response to JSON
// ● Dynamically render the post titles and bodies inside the #postList div
// 2. Create and Send a New Post
// ● Add a form with title and body fields
// ● Use fetch() with the POST method to send the data as JSON to the API
// ● Show a confirmation message with the response data
// 3. Add Loading and Error States
// ● Show a “Loading…” message while the fetch is in progress
// ● Display an error message if the fetch fails
// Deliverables:
// ● A working fetch call that loads and displays posts
// ● A functional form that submits data via POST
// ● Error handling and user feedback (e.g., loading spinner or error messages)
// ● Clean and well-commented JavaScript code
// 💡 Extensions
// ● Allow users to delete posts using a DELETE request
// ● Allow users to filter posts by keyword using an input field
// ○ Use async/await instead of .then()
// Setup
// 1. As you work on this tasks, you will need to use the free JSONPlaceholder API:
// https://jsonplaceholder.typicode.com/
// ● GET endpoint: /posts — Retrieve a list of posts
// ● POST endpoint: /posts — Submit a new post (mocked — no real data
// is created)
// 2. Make sure you follow all of these steps when you complete work in our
// GitHub repos:
// ● Fork the repo.
// ● Clone the repository to your local machine.
// ● Start working on the code.
// ● When you are finished, commit your changes and push them to your
// fork.

//wait for page to laod
window.addEventListener("load", function () {
  //make the GET request
  let allPosts = []; //store all poosts for filtering

  //function to display filtered posts
  function displayPosts(posts) {
    const postListDiv = document.getElementById("postList");
    postListDiv.innerHTML = "";

    if (posts.length === 0) {
      postListDiv.innerHTML = "<p>No posts found</p>";
      return;
    }

    posts.forEach((post) => {
      postListDiv.innerHTML += `
      <div class="post" id="post-${post.id}">
        <p><strong>Title:</strong> ${post.title}</p>
        <p><strong>Body:</strong> ${post.body}</p>
        <button class="deleteButton" data-post-id="${post.id}">Delete</button>
      </div>
    `;
    });

    //attach delete functionality to all buttons
    attachDeleteHandlers();
  }

  //filter posts by keyword
  document.getElementById("filterInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    console.log("Keyword typed:", keyword);
    console.log("allPosts length:", allPosts.length);

    // Check if posts have been fetched
    if (allPosts.length === 0) {
      return; // Exit if no posts loaded yet
    }

    if (keyword === "") {
      console.log("Showing all posts");
      displayPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter((post) => {
        return (
          post.title.toLowerCase().includes(keyword) ||
          post.body.toLowerCase().includes(keyword)
        );
      });
      console.log("Filtered posts count:", filteredPosts.length);
      displayPosts(filteredPosts);
    }
  });

  document.getElementById("fetchButton").addEventListener("click", () => {
    //make GET request when button is clicked

    const spinner = document.getElementById("spinner");
    const postListDiv = document.getElementById("postList");
    const errorDiv = this.document.getElementById("error");

    //show spinner/ hide posts
    spinner.style.display = "block";
    postListDiv.innerHTML = "";
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(function (response) {
        //convert response to JSON
        return response.json();
      })
      .then(function (posts) {
        console.log(posts); //log the JSON data

        //hide spinner
        spinner.style.display = "none";

        allPosts = posts; //store the posts
        displayPosts(posts);
      })
      .catch(function (error) {
        //hide spinner and show error message
        spinner.style.display = "none";
        errorDiv.style.display = "block";
        errorDiv.textContent = "Error fetching the data." + error;
        console.error("Error fetching the data:", error);
      });
  });

  //handle form submission
  document
    .getElementById("postForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); //prevent page reload on form submit

      alert("Configuring data.");

      const title = document.getElementById("titleInput").value;
      const body = document.getElementById("bodyInput").value;

      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        //tells the server you are sending JSON
        headers: {
          "Content-Type": "application/json",
        },
        //converts to a JSON string
        body: JSON.stringify({
          title: title,
          body: body,
          userId: 1,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log("Post created:", data);
          document.getElementById("formSuccess").innerHTML =
            `<p>Post created successfully!</p>`;
          document.getElementById("postForm").reset(); //resets the form
        })
        .catch(function (error) {
          console.error("Error creating post:", error);
          document.getElementById("formError").innerHTML =
            `<p>Error creating post.</p>`;
        });
    });
});

//function to attach delete handlers to all delete buttons
function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll(".deleteButton");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const postId = this.getAttribute("data-post-id");
      deletePost(postId);
    });
  });
}

//function to delete post
function deletePost(postId) {
  fetch("https://jsonplaceholder.typicode.com/posts/${postId}", {
    method: "DELETE",
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Post deleted", postId);
        document.getElementById(`post-${postId}`).remove();
      } else {
        throw new Error("Failed to delete post");
      }
    })
    .catch(function (error) {
      console.error("Error deleting post", error);
      alert("Error deleting post:" + error.mesage);
    });
}
