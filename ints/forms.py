from django import forms
from django.forms import DateInput

from datetime import datetime

# Choices for category in transaction model
TYPE_OF_EXPENDITURE = [
    ("OTHER", "Other"), # Default expenditure
    ("DEBTS", "Debts"),
    ("FOOD", "Food"),
    ("GROCERIES", "Groceries"),
    ("LEISURE", "Leisure"),
]


class LoginForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control w-50 mx-auto"

    username = forms.CharField(
        max_length=150,
        widget= forms.TextInput(attrs={
            "placeholder": "Username"
        })    
    )

    password = forms.CharField(
        max_length=128,
        widget= forms.PasswordInput(attrs={
            "placeholder": "Password"
        })   
    )


class RegisterForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control"

    username = forms.CharField(
        max_length=150,
        widget= forms.TextInput(attrs={
            "placeholder": "Username"
        })    
    )

    email = forms.CharField(
        max_length=254,
        widget= forms.TextInput(attrs={
            "placeholder": "Email (optional)"
        })
    )

    password = forms.CharField(
        max_length=128,
        widget= forms.PasswordInput(attrs={
            "placeholder": "Password"
        })   
    )

    confirmation = forms.CharField(
        max_length=128,
        widget= forms.PasswordInput(attrs={
            "placeholder": "Confirm Password"
        })
    )


class TransactionForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(TransactionForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs["class"] = "form-control my-2"

    reference = forms.CharField(
        label="",
        max_length=25,
        required=True,
        widget = forms.TextInput(attrs={
            "placeholder": "Reference"
        })
    )

    details = forms.CharField(
        label="",
        widget=forms.Textarea(attrs={
            "placeholder": "Details",
            "rows": 2,
        }),
        required=False
    )

    amount = forms.DecimalField(
        label="",
        max_digits=8, 
        decimal_places=2,
        required=True,
        widget = forms.TextInput(attrs={
            "placeholder": "Amount",
            "style": "display: inline-block; width: 20%;"
        })
    )

    category = forms.CharField(
        label="",
        max_length=10,
        widget=forms.Select(
            choices=TYPE_OF_EXPENDITURE,
            attrs=({                
                "style": "display: inline-block; width: 30%; "
            })    
        )
    )

    date = forms.DateField(        
        label="",
        widget=DateInput(
            attrs=({
                "type": "date",
                "style": "display: inline-block; width:45%;"
                }),
        ),
        required=True,
        initial=datetime.now(),
    )