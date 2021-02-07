from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage, InvalidPage
from django.db.models import Sum

from .models import User, Transaction, Profile

import calendar

monthsConverter = {
    month: index for index, month in enumerate(calendar.month_abbr) if month
}


# Helper to paginate query sets passed from views.py
def paginate(queryset, page, per_page):
    paginator = Paginator(queryset, per_page)

    try:
        transactions = paginator.page(page)
    except PageNotAnInteger:
        transactions = paginator.page(1)
    except EmptyPage:
        transactions = paginator.page(paginator.num_pages)

    return transactions


def get_profile(user):
    try:
        profile = Profile.objects.get(user=user)
    except ObjectDoesNotExist:
        return 404

    return profile


def get_transactions(user):
    user_profile = get_profile(user)
    return user_profile.transactions.all()


def order_transactions_by(field, transactions_list):
    return transactions_list.order_by(f"-{field}")


def transactions_in(category, transactions_list):
    category = category.upper()
    return transactions_list.filter(category=category)

def transactions_in_month(month, transactions_list):
    monthNumber = monthsConverter[month]
    return transactions_list.filter(timestamp__month=monthNumber)


def sum_amounts_in_a_year(transactions_list):
    return transactions_list.aggregate(Sum("amount"))["amount__sum"]