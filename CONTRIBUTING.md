# Contributing to Opportunity Lens

First off, thank you for considering contributing to Opportunity Lens! It's people like you that make this project great.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open-source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

- **Ensure the bug was not already reported** by searching on GitHub under [Issues](https://github.com/your-username/opportunity-lens-frontend/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/your-username/opportunity-lens-frontend/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

- Open a new issue to start a discussion about your idea. This is the best way to get feedback before you start working on something.
- Clearly describe the enhancement, why it's needed, and provide examples of how it would work.

## Development Setup

Ready to contribute? Here’s how to set up `opportunity-lens-frontend` for local development.

1.  **Fork** the repository.
2.  **Clone** your forked repository to your local machine:
    ```bash
    git clone https://github.com/your-username/opportunity-lens-frontend.git
    ```
3.  **Navigate** to the project directory:
    ```bash
    cd opportunity-lens-frontend
    ```
4.  **Install** the dependencies:
    ```bash
    npm install
    ```
5.  **Set up** your local environment variables. Create a file named `.env` in the root of the project and add the necessary variables (e.g., `MONGO_DB_CONNECTION_STRING`, `AUTH_SECRET`). You can use `.env.example` as a template if one exists.
6.  **Run** the development server:
    ```bash
    npm run dev
    ```
    The app should now be running on `http://localhost:3000`.

## Pull Request Process

1.  Create a new branch from `main` for your feature or bug fix:
    ```bash
    git checkout -b feature/your-amazing-feature
    ```
2.  Make your changes and commit them with a descriptive message. We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
    ```bash
    git commit -m "feat: Add amazing new feature"
    ```
3.  Push your branch to your forked repository:
    ```bash
    git push origin feature/your-amazing-feature
    ```
4.  Open a **Pull Request** to the `main` branch of the original repository.
5.  Provide a clear title and description for your pull request, linking to any relevant issues.
6.  Ensure your code lints and passes any automated checks.

## Coding Style

- We use **Prettier** for automatic code formatting. Please ensure it's run on your code before committing.
- We use **ESLint** for code quality. Make sure your code adheres to the linting rules defined in the project.

Thank you
