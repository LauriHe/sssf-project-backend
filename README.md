# SSSF Project - Lauri Heikkinen

## What does the project do? ❓
The basic concept of the application is that users can create, share and modify notes and todo lists. You can think of it as a simplified version of Trello / Microsoft Planner etc.

## Why the project is useful? 🤔
The project is useful for taking quick notes or doing some basic project planning.

## What is the target audiance? 👪
The possible use cases and users for the application are quite broad so it’s a bit difficult to narrow down the focus group. However because the app is quite basic in it’s functionality it will probably cater more towards casual users who just want to take some quick notes or make a shopping list etc. The app is not designed for big group projects or users that need a lot of features.

## List of all features 📃

 - Register / login
 - Settings
	 - Edit user info
		 - Email
		 - Username
		 - Password
		 - Image
 - Notes
	 - View owned notes
	 - View shared notes
	 - Make new note
	 - Edit note
	 - Share note with other users
	 - Delete note
- Boards
	- View owned boards
	- View Shared boards
	- Make new board
	- Edit board title
	- Share board with other users
	- Delete board
	- Lists
		- Add list to board
		- Edit list title
		- Delete list from board
		- Cards
			- Add card to list
			- Edit card title and content
			- Move card to another list
			- Delete card from list

## How to test the app 🔎

Complete this 20 step list to test all functionality

 1. Go to: https://laurihe.github.io/sssf-project-frontend/
 2. Press "Don't have an account? Register here."
 3. Make a user
 4. You can also make another account to test sharing functionality
 5. Login with username and password (use **username** to login **not email**!)
 6. Navigate to notes page
 7. Create a new note and save it
 8. Press share and input the username for whom you want to share the note. (You might need to refresh the page after creating a note for this to work)
 9. Login with the other account and werify that you can see the note under "shared"
 10. Delete note with the delete button (**only owner can delete**)
11. Go to boards page
12. Add a new board
13.  Add some lists and cards
14. Try moving the card between lists by clicking the three dots on the corner of the card
15. Sharing and deleting works the same way as with the notes
16. Go to account page
17. Try modifying info
18. Add a profile picture
19. After you are done you can delete the account from the account page.
20. Congratulations you have successfully tested all the functions of the app!🏆😎

## GraphQL Sandbox 🚀
If you want to play around with the graphql sandbox go to https://lauhei-sssf-project.azurewebsites.net/graphql

## Testing the app locally 🖥️
If you want to install and run the application locally on your own machine then follow these steps:

 1. Clone this repository
 2. Clone the frontend repository from: https://github.com/LauriHe/sssf-project-frontend
 3. Make a .env file inside the root of the backend and add the following content:

>     NODE_ENV=development
>     PORT=3000
>     DATABASE_URL= (ADD YOUR OWN MOGODB URL)
>     JWT_SECRET= (ADD YOUR OWN SECRET)
>     AUTH_URL=http://localhost:3000/api/
>     UPLOAD_URL=http://localhost:3000/api/
4. Make a .env file inside the root of the frontend and add the following content: 
> 
>     VITE_API_URL=http://localhost:5173/graphql
>     VITE_UPLOAD_URL=http://localhost:5173/api/upload
>     VITE_FILE_URL=http://localhost:5173/uploads

5. Run `npm i` in both directories
6. Run `npm start` in the backend directory
7. Run `npm run dev` in the frontend directory
8. `ctrl + click` the link or go to `http://localhost:5173/` to test the application

## Feedback ✏️
Please give some feedback about the application and readme.md: https://forms.gle/t8GyefsvF5GpqkmE9
