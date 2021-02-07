from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("profile", views.profile, name="profile"),
    path("add", views.add_transaction, name="add"),
    path("charts", views.charts, name="charts"),
    path("all", views.get_transactions_with_filters, name="all"),

    # AJAX paths
    path("transactions/<str:category>", 
        views.get_transactions_in_category, 
        name="get_transactions_in_category"),
    path("charts/data", views.get_transactions_for_charts, name="data_for_charts"),
    path("profile/avatar/edit", views.edit_avatar, name="avatar_edit"),
    path("profile/username/edit", views.edit_username, name="username_edit"),
    path("charts/transactions/<str:year>", views.transactions_in_year, name="transactions_in_year"),
    path("all/delete", views.delete_transaction, name="delete_transaction"),
    path("all/count", views.get_transactions_count, name="transactions_count")
]