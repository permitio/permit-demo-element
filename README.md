# Permit.io Elements Demo

A modern, clean, and beautiful demo application showcasing Permit.io's embeddable UI components for access control and user management.

![Permit.io Elements](https://www.permit.io/elements)

## Features

This demo showcases the three main Permit Elements:

1. **User Management** - Allow your users to manage access control and permissions within safe boundaries
2. **Audit Logs** - Provide your users with decision monitoring capabilities for each access control policy
3. **Approval Flows** - Enable your users to manage access and process approval requests

## Tech Stack

- **Next.js** - React framework for server-rendered applications
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Lucide React** - Beautiful, consistent icon set
- **Next Themes** - Theme provider for Next.js
- **Permit.js** - Permit.io JavaScript SDK

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/permit-demo-element.git
cd permit-demo-element
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Permit Elements in Your Own Application

To use Permit Elements in your own application, you need to:

1. Create a Permit.io account at [https://app.permit.io/register](https://app.permit.io/register)
2. Configure your elements in the Permit.io dashboard
3. Set up JWKS for authentication
4. Install the Permit.js SDK in your application
5. Use the login and embedding methods as shown in the demo

Refer to the [official documentation](https://docs.permit.io/embeddable-uis/overview) for detailed instructions.

## Customizing The Demo

This demo is built with modern and flexible components. You can easily customize it by:

- Modifying the theme variables in `globals.css`
- Updating the component styles in the respective files
- Adding your own components and pages

## Learn More

To learn more about Permit.io Elements, check out the following resources:

- [Permit.io Elements Documentation](https://docs.permit.io/embeddable-uis/overview)
- [Permit.io Website](https://permit.io)
- [Permit.io API Reference](https://docs.permit.io/api/reference)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
