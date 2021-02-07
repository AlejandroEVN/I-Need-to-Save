from django.contrib.auth.models import AbstractUser
from django.db import models

import datetime


class User(AbstractUser):
    pass


class Transaction(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="transaction"
    )

    reference = models.CharField(max_length=25)

    details = models.CharField(
        max_length=240,
        blank=True    
    )

    amount = models.DecimalField(
        max_digits=8, 
        decimal_places=2
    )

    category = models.CharField(max_length=10)

    timestamp = models.DateTimeField(auto_now_add=True)

    receipt_date = models.DateField(auto_now_add=False)

    def serialize(self):
        return {
            "id": self.id,
            "reference": self.reference,
            "amount": f"${self.amount}",
            "details": self.details,
            "category": self.category.capitalize(),
            "timestamp": self.timestamp.strftime("%b %d, %Y - %H:%M"),
            "receipt_date": self.receipt_date.strftime("%b %d, %Y")
        }

    def __str__(self):
        return f"{self.user}. Ref: {self.reference}, Category: {self.category}"


class Profile(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    avatar = models.CharField(
        max_length=520,
        default="default_user_avatar"
    )

    transactions = models.ManyToManyField(
        Transaction,
        blank=True
    )

    def serialize(self):
        return {
            "username": self.user.username,
            "last_login": self.user.last_login.strftime("%b %d, %Y - %H:%M"),
            "avatar": self.avatar,
            "transactions": self.transactions.filter(
                receipt_date__year=datetime.datetime.now().year).count()
        }

    def __str__(self):
        return f"Profile's user: {self.user}"  