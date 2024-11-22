
document.addEventListener('DOMContentLoaded', () => {
    const blogsContainer = document.querySelector('.blogs-list');

    async function fetchBlogs() {
        try {
            const response = await fetch('/blog/blogfetching');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blogs = await response.json();
            console.log('Fetched blogs:', blogs);
            displayBlogs(blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    }

    function displayBlogs(blogs) {
        blogsContainer.innerHTML = '';

        blogs.forEach(blog => {
            console.log('Image URL:', blog.image);
            const blogItem = document.createElement('div');
            blogItem.classList.add('blog-item');

            blogItem.innerHTML = `
                <img src="${blog.image}" alt="${blog.title} Image" class="blog-image" onerror="this.onerror=null; this.src='fallback-image-url.jpg';">
                <h3><a href="/blog/singleBlog/${blog._id}" class="blog-title">${blog.title}</a></h3>
                <span class="blog-category">Category: ${blog.category}</span>
                <p class="blog-content">${blog.content.substring(0, 100)}...</p>
                
                <button id="like-${blog._id}" class="btn btn-like">Like</button>
                <span id="like-count-${blog._id}" class="like-count">${blog.likedBy.length} Likes</span>
                
                <form id="comment-form-${blog._id}" class="comment-form">
                    <textarea id="comment-text-${blog._id}" class="comment-input" placeholder="Add a comment..." required></textarea>
                    <button type="submit" class="btn btn-comment">Submit</button>
                </form>
                
                <div class="comments-section">
                    <h4>Comments:</h4>
                    <ul id="comments-list-${blog._id}">
                        ${blog.comments.map(comment => `<li><strong>${comment.username}</strong>: ${comment.text}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- Update and Delete Buttons -->
                <button class="btn btn-edit" id="edit-${blog._id}">Edit Blog</button>
                <button class="btn btn-delete" id="delete-${blog._id}">Delete Blog</button>
            `;

            blogsContainer.appendChild(blogItem);

            
            const likeButton = document.getElementById(`like-${blog._id}`);
            const likeCount = document.getElementById(`like-count-${blog._id}`);

            likeButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`/blog/like/${blog._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('Error liking the blog');
                    }

                    const updatedPost = await response.json();
                    likeCount.textContent = `${updatedPost.likedBy.length} Likes`;
                } catch (error) {
                    alert('Error liking the blog. Please try again later.');
                }
            });

            
            const commentForm = document.getElementById(`comment-form-${blog._id}`);
            const commentText = document.getElementById(`comment-text-${blog._id}`);
            const commentsList = document.getElementById(`comments-list-${blog._id}`);

            commentForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const comment = commentText.value.trim();
                if (!comment) {
                    alert('Comment cannot be empty');
                    return;
                }

                try {
                    const response = await fetch(`/blog/comment/${blog._id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ text: comment })
                    });

                    if (!response.ok) {
                        throw new Error('Error adding comment');
                    }

                    const result = await response.json();
                    const newComment = document.createElement('li');
                    newComment.innerHTML = `<strong>${result.username}</strong>: ${result.text}`;
                    commentsList.appendChild(newComment);
                    commentText.value = '';
                } catch (error) {
                    alert('Error adding comment. Please try again later.');
                }
            });

           
            const editButton = document.getElementById(`edit-${blog._id}`);
            editButton.addEventListener('click', () => {
                window.location.href = `/blog/update/${blog._id}`;
            });

            const deleteButton = document.getElementById(`delete-${blog._id}`);
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this blog?')) {
                    try {
                        const response = await fetch(`/blog/delete/${blog._id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });

                        if (!response.ok) {
                            throw new Error('Error deleting the blog');
                        }

                        alert('Blog deleted successfully');
                        blogItem.remove(); 
                    } catch (error) {
                        alert('Error deleting the blog. Please try again later.');
                    }
                }
            });
        });
    }
    
    document.getElementById('delete-all-blogs').addEventListener('click', async () => {
        const confirmation = confirm('Are you sure you want to delete all blogs? This action cannot be undone.');
        if (!confirmation) return;

        try {
            const response = await fetch('/blog/deleteAll', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete blogs');
            }

            const result = await response.json();
            alert(result.message);
            window.location.reload();
        } catch (error) {
            alert('Error deleting blogs. Please try again later.');
        }
    });



    fetchBlogs();
});
