# Generated by Django 3.1.3 on 2020-12-14 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ints', '0003_auto_20201214_2144'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar',
            field=models.CharField(default='default_user_avatar.jpg', max_length=520),
        ),
    ]
