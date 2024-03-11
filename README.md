
# ft_transcendence

"ft_transcendence" is a comprehensive web project from the 42 Paris school, realized through the collaboration of [Melodie Shahrvari](https://github.com/melsh96), [Perrine Gros](https://github.com/p-lg-ux), and [Zakariya Hamdouchi](https://github.com/H-Zak), as outlined in the project description (see en.subject.pdf).

This project is engineered using NestJS for the backend and React (TypeScript) for the frontend, crafting a fluid, single-page application that performs flawlessly across a variety of modern web browsers. It incorporates secure OAuth login mechanisms, a dynamic real-time chat feature, and an engaging live Pong game complete with matchmaking capabilities, ensuring an interactive and competitive online environment.

The application's data management is powered by a PostgreSQL database, selected for its reliability and scalability. To interact with this database, "ft_transcendence" employs Prisma, an advanced ORM that facilitates clear and efficient database operations within a TypeScript ecosystem. This choice underscores the project's commitment to robust, type-safe backend development practices.

For real-time functionalities, such as the live chat and multiplayer aspects of the Pong game, "ft_transcendence" leverages WebSockets. This technology enables seamless, bidirectional communication between the client and server, ensuring that users experience instantaneous gameplay and messaging without perceivable delay.

## Usage

To get this project up and running after you've cloned it, there are a few essential steps to follow.

### Prerequisites

1. **42 API Key**: This project incorporates OAuth authentication leveraging the 42 intranet. If you don't already have a 42 API key, you'll need to obtain one. You can request this through the [42 developers' portal](https://api.intra.42.fr/apidoc). The API key is crucial for enabling the OAuth authentication process which allows users to log in securely.

2. **Setting Up Environment Variables**: With your API key in hand, the next step involves configuring the necessary environment variables in two places:

    - **Backend `.env` Configuration**: Go to the backend directory and modify the `.env` file there to include your API key and secret. For example:

        ```
        CLIENT_UID=YourClientID
        CLIENT_SECRET=YourSecret
        ```

      Make sure to replace `YourClientID` and `YourSecret` with your actual 42 API client ID and secret. This setup is necessary for your backend to authenticate and communicate with the 42 API.

    - **Frontend `.env` Configuration**: Similarly, in the frontend directory, you'll need to adjust the `.env` file to include the redirect URI as provided by the 42 API:

        ```
        VITE_REDIRECT_URI=42RedirectUri
        ```

      Replace `42RedirectUri` with your actual redirect URI. This URI is a critical component of the OAuth flow, ensuring users are directed back to your application after successfully authenticating.

### Logging In

An active 42 account is required for users to log into the application. This setup aligns with the OAuth authentication mechanism, ensuring a secure and straightforward access pathway. It's important to ensure your 42 API credentials are correctly configured as mentioned above.


### Launch the Application

To build and launch the application, you have two options. Execute either of the following commands in the root directory, depending on your preference or setup requirements.

**Option 1: Using Make**

If you prefer a simplified approach and have `make` installed on your system, you can build and start the application by running:

```
make
```

**Option 2: Using Docker Compose**

For those who prefer or need to use Docker directly, you can build and launch the application with:

```
docker compose up --build
```
## Demo

Logging In
![Login demo](./demo/Login.gif)

Add friends
![Friend demo](./demo/Friends.gif)

Chat with friends
![Chat demo](./demo/Chat.gif)

Play pong
![Game demo](./demo/Game.gif)

Some stuff
![Demo](./demo/Demo.gif)