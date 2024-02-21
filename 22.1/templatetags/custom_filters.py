from django import template

register = template.Library()

@register.filter
def mediapath(image):
    return f"/media/{image}"
