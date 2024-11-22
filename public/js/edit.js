
        document.addEventListener('DOMContentLoaded', async () => {
            const form = document.getElementById('edit-blog-form');
            const blogId = window.location.pathname.split('/').pop();

           
            function getBlogDataFromCookies() {
                const blogData = document.cookies.split('; ').find(row => row.startsWith('blogData='));
                return blogData ? JSON.parse(decodeURIComponent(blogData.split('=')[1])) : null;
            }

            
            async function fetchBlogData() {
                const cachedBlog = getBlogDataFromCookies();
                
                if (cachedBlog && cachedBlog.id === blogId) {
                    document.getElementById('blog-title').value = cachedBlog.title;
                    document.getElementById('blog-category').value = cachedBlog.category;
                    document.getElementById('blog-content').value = cachedBlog.content;
                } else {
                    try {
                        const response = await fetch(`/blog/singleBlog/${blogId}`);
                        if (!response.ok) {
                            throw new Error('Error fetching blog data');
                        }
                        const blog = await response.json();

                        document.getElementById('blog-title').value = blog.title;
                        document.getElementById('blog-category').value = blog.category;
                        document.getElementById('blog-content').value = blog.content;

                        
                        document.cookie = `blogData=${encodeURIComponent(JSON.stringify(blog))}; path=/`;
                    } catch (error) {
                        alert('Error fetching blog data. Please try again later.');
                    }
                }
            }

            fetchBlogData();

           
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const updatedBlog = {
                    title: form.title.value,
                    category: form.category.value,
                    content: form.content.value,
                };

                try {
                    const response = await fetch(`/blog/update/${blogId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(updatedBlog),
                    });

                    if (!response.ok) {
                        throw new Error('Error updating blog');
                    }

                   
                    document.cookies = 'blogData=; Max-Age=-99999999; path=/';

                    alert('Blog updated successfully!');
                    window.location.href = '/blog/blogs';
                } catch (error) {
                    alert('Error updating blog. Please try again later.');
                }
            });
        });
    