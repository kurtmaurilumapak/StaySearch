# StaySearch

A comprehensive boarding house listing and search platform built with Vue 3, connecting property owners with students looking for accommodation.

## Features

### For Property Owners
- **Post Listings**: Create and manage boarding house listings
- **Property Management**: Update availability, pricing, and amenities
- **Dashboard**: Track inquiries and manage bookings

### For Students
- **Search & Filter**: Find boarding houses based on:
  - Price range
  - Location
  - Amenities and inclusions
  - Distance from campus
  - Room type
- **Detailed Listings**: View comprehensive property information
- **Save Favorites**: Bookmark properties for later review
- **Contact Owners**: Direct communication with property owners

### Key Inclusions & Filters
- Price range slider
- WiFi availability
- Utilities included (water, electricity)
- Furnished/unfurnished options
- Gender preferences
- Number of occupants
- Proximity to universities
- House rules and regulations

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **Vue Router** - Official routing library
- **Pinia/Vuex** - State management (specify which one you're using)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur)

## Customize Configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project Structure

```
staysearch/
├── src/
│   ├── assets/          # Images, styles, and static files
│   ├── components/      # Reusable Vue components
│   ├── views/           # Page components
│   ├── router/          # Vue Router configuration
│   ├── stores/          # State management
│   ├── services/        # API services
│   └── App.vue          # Root component
├── public/              # Public static assets
└── package.json         # Project dependencies
```

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure your environment variables (create `.env` file)
4. Run the development server with `npm run dev`
5. Open your browser to `http://localhost:5173`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.
