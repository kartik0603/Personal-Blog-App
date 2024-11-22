

document.getElementById('create-blog-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').value;
  const category = document.getElementById('category').value;

  const data = { title, content, image, category };

  try {
    const response = await fetch('/blog/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    if (response.status === 200) {
      alert(result);

      document.cookies = `blogId=${result.blogId}; path=/;`;
      if (result.role === 'admin') {
        window.location.href = '/admin/dashboard'; 
      } else {
        window.location.href = '/blog/blogs';  
      }
    } else {
      document.getElementById('error-message').textContent = result;
    }
  } catch (err) {
    document.getElementById('error-message').textContent = 'Error creating blog';
  }
});



document.getElementById('search-blog-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('search-query').value;

  try {
    const response = await fetch(`/blog/search?blogs=${query}`);
    const blogs = await response.json();

    const blogList = document.getElementById('blog-list');
    blogList.innerHTML = '';

    blogs.forEach(blog => {
      const blogItem = document.createElement('div');
      blogItem.classList.add('blog-item');
      blogItem.innerHTML = `
    <div>
      <h4>${blog.item.title}</h4>
      <p>${blog.item.content.substring(0, 100)}...</p>
      <p><strong>Author:</strong> ${blog.item.author}</p>
    </div>
    <div>
      <button onclick="updateBlog('${blog.item._id}')">Update</button>
      <button onclick="deleteBlog('${blog.item._id}')">Delete</button>
    </div>
  `;
      blogList.appendChild(blogItem);
    });
  } catch (err) {
    document.getElementById('error-message').textContent = 'Error searching blogs';
  }
});



async function updateBlog(blogId) {
  const newTitle = prompt('Enter new blog title:');
  const newContent = prompt('Enter new blog content:');
  const newCategory = prompt('Enter new blog category:');

  const data = {
    title: newTitle,
    content: newContent,
    category: newCategory
  };

  try {
    const response = await fetch(`/blog/update/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.msg);
    window.location.reload();
  } catch (err) {
    document.getElementById('error-message').textContent = 'Error updating blog';
  }
}


async function deleteBlog(blogId) {
  const confirmDelete = confirm('Are you sure you want to delete this blog?');

  if (confirmDelete) {
    try {
      const response = await fetch(`/blog/delete/${blogId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      alert(result.msg);
      window.location.reload();
    } catch (err) {
      document.getElementById('error-message').textContent = 'Error deleting blog May Be you are not admin';
    }
  }
}
