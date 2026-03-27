const API_URL = "http://localhost:5003"; // change port if needed

// LOGIN FUNCTION
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Login successful");
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = "index.html";
        } else {
            alert(data.message || "Login failed");
        }

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}


// ADD BLOG
async function addBlog() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(`${API_URL}/api/blogs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    });

    alert("Blog added!");
    loadBlogs();
}


// LOAD BLOGS
async function loadBlogs() {
    const res = await fetch(`${API_URL}/api/blogs`);
    const blogs = await res.json();

    const blogContainer = document.getElementById("blogs");
    blogContainer.innerHTML = "";

    blogs.forEach(blog => {
        const div = document.createElement("div");
        div.className = "blog";

        div.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${blog.content}</p>
            <div class="actions">
                <button onclick="likeBlog('${blog._id}')">❤️ ${blog.likes || 0}</button>
                <button onclick="deleteBlog('${blog._id}')">🗑 Delete</button>
            </div>
        `;

        blogContainer.appendChild(div);
    });
}


// DELETE BLOG
async function deleteBlog(id) {
    await fetch(`${API_URL}/api/blogs/${id}`, {
        method: "DELETE"
    });
    loadBlogs();
}


// LIKE BLOG
async function likeBlog(id) {
    await fetch(`${API_URL}/api/blogs/${id}/like`, {
        method: "PUT"
    });
    loadBlogs();
}


// LOAD BLOGS ON PAGE LOAD
if (window.location.pathname.includes("index.html")) {
    loadBlogs();
}