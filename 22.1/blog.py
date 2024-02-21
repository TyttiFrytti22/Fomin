from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class BlogPost(models.Model):
    title = models.CharField(max_length=100)
    slug = models.CharField(max_length=100, unique=True)
    content = models.TextField()
    preview = models.ImageField(upload_to='previews/')
    created_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=False)
    views_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title)
        super(BlogPost, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blogpost_detail', args=[self.slug])
