### Project I Need to Save
=================

I Need to Save is a web application that allows you to keep track of your expenditures and shows you useful
in order to help you save more money!
The motivation for this projoect comes from my own experience of not being able to efficiently keep track of what I spend. So the aim is to easily and efficiently display the expenditures to have a better control of what you spend.

The app was entirely coded by me. The main objective of this project was to learn how to work with data coming from the backend by using JavaScript libraries like ChartJS and MomentJS. 
I have also introduced JavaScript pagination, which I coded without using any existing library. 
The table containing the transactions made by the user can be filtered and ordered. All this functionality was coded with vanilla JavaScript.

### **Demo**
SOON

### **Pages**
- **Index**: Landing page. Contains title and login form. Unregistered users have two links that takes them to the registration form.
- **Register**: Registration form.
For logged in users only:
- **Dashboard**: Clicking on the logo will take the user to their dashboard. Here they can add transactions and see the total amount of expenditures for each category.
- **Profile**: Clicking on the users name takes them to the profile page. A list with the last five transactions is displayed. Users are able to change their username and avatar image.
- **All transactions**: List of all the transactions added by the user in the current year. Many filters can be applied to the list as well as it can be ordered by clicking on the columns.
- **Charts**: A select menu is presented to the user. The user can select which chart to display.

### **Python files**
- **Models**:
    - User: Django's own default user model.
    - Transaction: Model for the transactions added to the database. Contains information such as the user that made the transaction, transactions' details and dates.
    - Profile: Contains information about the user and the transactions they have made. In here we included the avatar (as a image url) and the transactions list made by the user.

- **Forms**:
This file contains the forms templates and the list for the five categories included in the app.
    - Login form.
    - Register form.
    - Transaction form (the categories appear as a select input).

- **Views**:
Longest file of the list. Contains all the views for handling login, logout and registration of users, updating and sending data from the database and rendering templates as well as handling errors.
Most of the views are defined to send data to the frontend as Json objects and update/delete information of:
    - User's profile
    - Transactions


- **Urls**:
The urlpatterns are divided between the paths used to render HTML and the paths used for AJAX calls.

- **Util**:
Definition of helper functions to retrieve data from the database and paginate lists.

- **Err**:
Definition of error messages for the app

- **Currency**:
Contains a template tag to format the amount into USD.

### **JavaScript files**
- **ajax**:
File that includes all the functions that are used to make AJAX calls.

- **orderItems**:
File that cointains the code to order the list in "All transactions" page depending on what column the user clicks.

- **chartDataTemplateAndColors**:
File containing dictionaries that are used as templates to filter and manage the data returning from the backend.

- **Rest**:
All of the files names refer to the HTML pages they affect. Most of the application's HTML is directly affected by JavaScript and updated with AJAX calls to the backend, reducing the amount of times that the HTMLs have to be rendered.
The node_modules contains two libraries. ChartsJs and MomentJs.

### **Tech Stack**
- Python
- Django
- JavaScript
- Libraries: ChartsJs | MomentJs
- Bootstrap
- CSS
- Sass

### **Usage**
- Clone the repository into your machine.
- In the terminal:
    - Run the command `pip install -r requirements.txt`.
    - Go to the app's folder.
    - Run the command `python manage.py runserver`.
    - Open the browser in the local port
