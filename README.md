This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Jello-Task-Manager
#### Individual Project for Software Projects Module on Level 4 at Sheffield Hallam Uni
I worked on this project from Jan 2025 to May 2025

###### Project Brief
For the project, we had to produce our project and the documentation. This included: User stories and acceptance tests, use case diagram, ER diagram, test cases, and a Legal, Social, Ethical and Professional Issues (LSEPI) document. For the project itself, we had a choice of four ideas: Hospital Management System, Currency Transfer Application, Budget Tracker or Task Management System.

###### Project Overview
*The task app needs to have an intuitive interface that will make it easier for users to interact with the app and manage their tasks.
The task app must allow users to create distinct accounts and start managing their everyday tasks effectively. A user's data should only be accessible to him/her, and an authentication system needs to be in place to safeguard the account from unauthorized access or accidental login.
As for the app, the user should add individual tasks or organize multiple tasks under a single task list. Also, the user should have the flexibility to create multiple tasks lists and manage several tasks altogether. Once completed, users can mark a task as completed.
Note: 
Users can collaborate by sharing list of task and marks as completed. 
Group admin shall be able to set up group tasks and monitor the progress of each task. 
Front-end of this system should ideally be developed as a web application that relies on a database. Back-end of this system can be developed using either SQLite or any other database management system, such as MySQL. MongoDB or NoSQL or any other unstructured databases are not permitted.*

###### My Project
For the project, I chose to do the Task Management System. I had previously made a task manager/organiser for my programming project in semester 1, which was a c# windows forms app. This project needed to be a web application with some kind of database. I decided that this was a great opportunity to expand on my previous project, as I knew that making it web-based would be a challenge.
My web app needed to include: Personal profiles and a login system, adding multiple tasks within the app, managing multiple task lists, and marking tasks as complete.

I was inspired by already existing web task managers, mainly Trello which I have used before (and decided to name the app after it).
I chose to implement a pink colour scheme for my app. Because it is named Jello, I decided to use a colour that will remind people of jelly. I also used a jellyfish icon to represent the app to keep with the theme. (Jello, Jelly, Jellyfish - all very similar :D)

The framework I chose to use was Next.js with Bootstrap CSS. I had used a little bit of Next.js before with my web development assignment in semester 1, and wanted to improve my skills. I had also never used a CSS framework before so I was able to learn something completely new aswell.
For the database, I used MySQL, as I had used it with Next.js before, and I prefer the layout of it to SQLite.

When users first enter the site, they will open up to the landing page. This prompts the user to either create a new account or login to an existing one.
When creating an account, the user must enter their details and select if they want to be a standard or admin user as this will affect the functionality of the site.
The navigation bar is displayed on almost every page, and includes: dashboard, tasklists, groups, create, and account.
* Dashboard - displays a users most recent tasklist and group.
* Tasklists - Here users can view all their tasklists, and make changes to them by adding, modifying or deleting tasks.
* Groups - Groups can only be created and managed by admin users. Groups consist of several members, and can use tasks and * tasklists the same way an individual user can, however only admin users can add, modify or delete tasks.
* Create - A simple page with two options: create a tasklist or create a group.
* Account - Users can see their account information and make any changes to it.
