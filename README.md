# Vue Blogs

A simple and modern blogging platform built with Vue.js.

## Description

This project is a feature-rich blogging application that allows users to create, edit, and view blog posts. It includes
user authentication, profile management, and role-based access control. The frontend is built as a Single Page
Application (SPA) using Vue.js.

The backend is a web api build with C# / .NET and can be found
here: [link to backend](https://github.com/Yannick-Vk/Angular-Admin-Web-Api)

## Tech Stack

This project utilizes a modern frontend stack:

* **Vue.js:** A progressive JavaScript framework for building user interfaces.
* **Vue Router:** The official router for Vue.js.
* **Pinia:** The official state management library for Vue.js.
* **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
* **@nuxt/ui:** A UI library for building beautiful and responsive user interfaces.
* **Axios:** A promise-based HTTP client for the browser and Node.js.
* **Highlight.js:** A syntax highlighter for the web.
* **Luxon:** A powerful, modern, and friendly library for parsing, validating, manipulating, and formatting dates and
  times.
* **Showdown:** A JavaScript Markdown to HTML converter.

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v20.19.0 or higher)
* [Bun (optional)](https://bun.sh/)

### Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```sh
   cd vue-blogs/vue-blogs
   ```
3. Install the dependencies:
   ```sh
   bun install
   ```
   or with npm
   ```sh
   npm install
   ```

### Development

To start the development server with hot-reloading, run the following command:

```sh
bun dev
```

or with npm

```sh
npm run dev
```

### Build

To build the application for production, run the following command:

```sh
bun run build
```

or with npm

```sh
npm run build
```