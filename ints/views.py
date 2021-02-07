import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import (EmptyPage, InvalidPage, PageNotAnInteger,
                                   Paginator)
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .err import EXISTING_USER, INVALID_CREDENTIALS, PASSWORDS_DONT_MATCH
from .forms import LoginForm, RegisterForm, TransactionForm
from .models import Profile, Transaction, User
from .util import (get_profile, get_transactions, order_transactions_by,
                   paginate, sum_amounts_in_a_year, transactions_in,
                   transactions_in_month)


def index(request):

    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse("dashboard"))
        
    form = LoginForm()

    return render(request, "ints/index.html", {
        "form": form
    })


@login_required
def dashboard(request):    

    transaction_form = TransactionForm()

    return render(request, "ints/dashboard.html", {
        "form": transaction_form
    })


def login_view(request):
    
    # Creates a login form
    login_form = LoginForm()

    if request.method == "POST":

        # Try to sign in user
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentification was succesful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("dashboard"))

        else:
            return render(request, "ints/index.html", {
                "form": login_form,
                "err_msg": INVALID_CREDENTIALS
            })

    else:

        return render(request, "ints/login.html", {
            "form": login_form
        })


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):

    # Creates a register form
    register_form = RegisterForm()

    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Check for password confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]

        if password != confirmation:
            return render(request, "ints/register.html", {
                "err_msg": PASSWORDS_DONT_MATCH,
                "form": register_form
            })

        # Create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "ints/register.html", {
                "err_msg": EXISTING_USER,                
                "form": register_form
            })

        login(request, user)

        # Creates a profile for the new user
        user = User.objects.get(username=username)
        new_profile = Profile(user=user)
        new_profile.save()

        return HttpResponseRedirect(reverse("dashboard"))

    else:
        return render(request, "ints/register.html", {
            "form": register_form
        })


@login_required
def profile(request):
    
    transactions = get_transactions(request.user)
    profile = get_profile(request.user)

    this_year = datetime.datetime.now().year

    transactions_this_year = transactions.filter(
        receipt_date__year=this_year
        )

    transactions_last_year = transactions.filter(
        receipt_date__year=this_year - 1
        )

    spent_this_year = sum_amounts_in_a_year(transactions_this_year)
    spent_last_year = sum_amounts_in_a_year(transactions_last_year)

    latest_transactions = get_transactions(request.user)
    latest_transactions = order_transactions_by("timestamp", latest_transactions)[:5]

    return render(request, "ints/profile.html", {
        "profile": profile.serialize(),
        "latest_transactions": latest_transactions,
        "spent_this_year": spent_this_year or 0,
        "spent_last_year": spent_last_year or 0,
    })


@login_required
def add_transaction(request):
    if request.method == "POST":
        form = TransactionForm(request.POST)
        if form.is_valid():
            reference = form.cleaned_data["reference"]
            details = form.cleaned_data["details"]
            amount = form.cleaned_data["amount"]
            category = form.cleaned_data["category"]
            date = form.cleaned_data["date"]

            transaction = Transaction(
                user=request.user,
                reference=reference,
                details=details,
                amount=amount,
                category=category,
                receipt_date=date
            )
            transaction.save()

            user_profile = get_profile(request.user)
            user_profile.transactions.add(transaction)
            user_profile.save()

        return HttpResponseRedirect(reverse("dashboard"))


@login_required
@csrf_exempt
def get_transactions_with_filters(request):
    transactions = get_transactions(request.user)

    transactions = order_transactions_by("timestamp", transactions)

    if request.method == "POST":
        data = json.loads(request.body)

        page_number = data.get("page")
        date = data.get("date")
        items_per_page = data.get("perPage")
        month = data.get("month")
        category = data.get("category")

        if month != "All":
            transactions = transactions_in_month(month, transactions)

        if category != "All":
            transactions = transactions_in(category, transactions)

        if date != "Date added":
            transactions = order_transactions_by("receipt_date", transactions)

        transactions = paginate(transactions, page_number, items_per_page)

        return JsonResponse(
            [transaction.serialize() for transaction in transactions],
            safe=False
        )

    transactions = paginate(transactions, 1, 10)

    return render(request, "ints/all.html", {
        "transactions": transactions
    })


@login_required
def charts(request):   
    return render(request, "ints/charts.html")


@login_required
@csrf_exempt
def get_transactions_for_charts(request):
    transactions = get_transactions(request.user)
    
    current_year = datetime.datetime.now().year

    transactions = transactions.filter(receipt_date__year=current_year)

    top = json.loads(request.body)

    if top != "":
        transactions = transactions.order_by("-amount")[:5]

    return JsonResponse(
        [transaction.serialize() for transaction in transactions],
    safe=False
    )


@login_required
def get_transactions_in_category(request, category):
    transactions = get_transactions(request.user)

    transactions = transactions_in(category, transactions)

    transactions = order_transactions_by("timestamp", transactions
        ).filter(receipt_date__year=datetime.datetime.now().year)

    return JsonResponse(
        [transaction.serialize() for transaction in transactions],
        safe=False
    )


@login_required
@csrf_exempt
def edit_avatar(request):
    if request.method == "PUT":
        new_avatar_url = json.loads(request.body)

        user_profile = get_profile(request.user)

        user_profile.avatar = new_avatar_url

        user_profile.save()

        return JsonResponse(201, safe=False)
    else:
        return JsonResponse("Unauthorized access", safe=False)


@login_required
@csrf_exempt
def edit_username(request):
    if request.method == "PUT":

        new_username = json.loads(request.body)

        try:
            user = User.objects.get(username=new_username)            
            return JsonResponse(409, safe=False)
        except ObjectDoesNotExist:
            user_profile = get_profile(request.user)

            user_profile.user.username = new_username

            user_profile.user.save()

            return JsonResponse(new_username, safe=False)
            
    else:        
        return JsonResponse("Unauthorized access", safe=False)


@login_required
def transactions_in_year(request, year):

    transactions = get_transactions(request.user)

    transactions = transactions.filter(receipt_date__year=year)

    return JsonResponse(
        [transaction.serialize() for transaction in transactions],
        safe=False
    )


@login_required
@csrf_exempt
def delete_transaction(request):
    if request.method == "DELETE":

        transaction_id = json.loads(request.body)
        
        transactions = get_transactions(request.user)

        transaction_to_delete = transactions.filter(id=transaction_id).first()

        transaction_reference = transaction_to_delete.reference

        transaction_to_delete.delete()

        return JsonResponse(f"Transaction '{transaction_reference}' deleted !", safe=False)

@login_required
@csrf_exempt
def get_transactions_count(request):
    if request.method == "GET":
        
        transactions = get_transactions(request.user)

        return JsonResponse(transactions.count(), safe=False)
