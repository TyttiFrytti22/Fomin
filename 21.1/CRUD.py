from django.views.generic import ListView, CreateView, UpdateView, DetailView
from .models import BlogPost

class BlogPostList(ListView):
    model = BlogPost
    template_name = 'blogpost_list.html'
    context_object_name = 'posts'
    queryset = BlogPost.objects.filter(is_published=True)

class BlogPostCreate(CreateView):
    model = BlogPost
    template_name = 'blogpost_form.html'
    fields = ['title', 'content', 'preview']

class BlogPostUpdate(UpdateView):
    model = BlogPost
    template_name = 'blogpost_form.html'
    fields = ['title', 'content', 'preview']

class BlogPostDetail(DetailView):
    model = BlogPost
    template_name = 'blogpost_detail.html'

    def get_object(self):
        obj = super(BlogPostDetail, self).get_object()
        obj.views_count += 1
        obj.save()
        return obj
