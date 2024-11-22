
document.addEventListener('DOMContentLoaded', () => {
    const blogId = window.location.href.split('/').pop(); 
    const likeButton = document.getElementById('like');
    const likeCount = document.getElementById('count');
    const commentForm = document.getElementById('comment');
    const commentText = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');

    async function fetchBlogData() {
        try {
            const response = await fetch(`/blog/singleBlog/data/${blogId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blog = await response.json();

            
            document.getElementById('img').src = blog.image;
            document.getElementById('title').textContent = blog.title;
            document.getElementById('category').textContent += blog.category;
            document.getElementById('content').textContent = blog.content;
            likeCount.textContent = `${blog.likedBy.length} Likes`;

           
            blog.comments.forEach(comment => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<strong>${comment.username}</strong>: ${comment.text}`;
                commentsList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching blog data:', error);
        }
    }

    likeButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/blog/like/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                likeCount.textContent = `${result.likedBy.length} Likes`;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error liking the blog:', error);
        }
    });

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = commentText.value.trim();

        if (!comment) {
            alert('Comment cannot be empty');
            return;
        }

        try {
            const response = await fetch(`/blog/comment/${blogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text: comment })
            });

            const result = await response.json();
            if (response.ok) {
                commentText.value = '';
                const newComment = document.createElement('li');
                newComment.innerHTML = `<strong>${result.username}</strong>: ${result.text}`;
                commentsList.appendChild(newComment);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    });

    fetchBlogData(); 
});
