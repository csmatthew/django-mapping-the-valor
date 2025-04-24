from django import template

register = template.Library()


@register.filter(name='slug_to_title')
def slug_to_title(value):
    return value.replace('-', ' ').title()
