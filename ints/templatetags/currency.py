from django import template

register = template.Library()

@register.filter
def currencyUSD(value):
    round_value = round(float(value), 2)
    return "$%s" % (round_value)