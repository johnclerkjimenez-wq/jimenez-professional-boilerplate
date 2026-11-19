

### 1. What is the difference between authentication and authorization? Give a real-world example of each.

Authentication is the process of checking who the user is, while authorization determines what the user is allowed to access. For example, when I log in to my account using my email and password, that is authentication. When the system allows only an admin to manage users while regular users can only view information, that is authorization. I learned that both are important to protect an application.

### 2. Why is JWT considered "stateless" and how does that benefit scalability?

JWT is considered stateless because the server does not need to store the login session of every user. Instead, the token contains information that the server can verify whenever the user makes a request. This helps scalability because the application can handle more users without constantly checking a session database. During my activity, I learned that I only needed to send the Bearer Token when accessing protected routes.

### 3. What are the three parts of a JWT token and what does each part do?

A JWT token has three parts: Header, Payload, and Signature. The Header contains information about the token type and signing algorithm. The Payload contains information about the user, such as their user ID and email. The Signature is used to verify that the token is valid and has not been modified. Understanding these three parts helped me understand how JWT authentication works in my project.

### 4. Why should you never put sensitive data (like passwords) in the JWT payload?

We should never put passwords or other sensitive information in the JWT payload because the payload can be decoded by anyone who gets the token. Even though the token has a signature, its contents are not automatically encrypted. If someone gets the token, they might see the information inside it. That is why I only use basic user information like user ID and email in my JWT payload.

### 5. How does bcrypt protect user passwords? What is the purpose of the "salt" and "rounds"?

Bcrypt protects passwords by converting them into a secure hash instead of saving the actual password in the database. The salt adds random data to make password hashes harder to predict or match. The rounds determine how much processing is used when creating the hash. In my project, I used bcrypt with 10 rounds. I also learned that during login, bcrypt.compare() checks the entered password against the stored hash without needing to save the original password.

### 6. What happens if someone steals a JWT token? How can you mitigate this risk?

If someone steals a JWT token, they may be able to access protected routes using that token until it expires. I learned that the token works like a temporary key to access the account. To reduce this risk, we should use HTTPS, keep tokens secure, set a short expiration time, avoid sharing tokens, and implement token revocation or refresh-token rotation when needed.

### 7. Why is it important to use HTTPS when transmitting JWT tokens?

HTTPS protects information while it travels between the client and the server. Without HTTPS, attackers on an insecure network may be able to intercept sensitive information, including JWT tokens. Since the token is used to access protected routes, keeping it secure during transmission is very important.

### 8. What is the difference between a short-lived access token and a long-lived refresh token? When would you use each?

An access token is used to access protected routes and usually has a short expiration time for security. A refresh token lasts longer and is used to request a new access token when the old one expires. I would use access tokens for normal API requests and refresh tokens to allow users to stay logged in without entering their password repeatedly. These are additional features that can be implemented to improve my current authentication system.

### 9. How does the auth middleware know which user is making the request?

The auth middleware checks the Authorization header and looks for a Bearer Token. It then verifies the JWT using the secret key. If the token is valid, the middleware gets the user ID and email from its payload and attaches the information to the request using req.user. In my project, I experienced errors like "No token provided" and "Invalid token" while testing this part in Postman. I learned that the correct token must be included when accessing protected routes.

### 10. If you had to implement role-based authorization (e.g., admin vs. regular user), how would you modify your current setup?

I would add a role property to my User entity, such as admin or user. Then I would create another middleware that checks the user's role after authentication. For example, an admin can create, update, and delete users, while a regular user can only access allowed routes. This would make my application more secure because not every authenticated user would have the same permissions.