# 🟣⚫ LLM Arena - AI Battle Platform

A modern, minimalist platform for comparing AI language models through interactive battles. Built with React, TypeScript, and Tailwind CSS with a dark purple theme.

## ✨ Features

- **AI Model Battles**: Compare responses from multiple LLMs (DeepSeek, GPT-4, Claude-3)
- **Webhook Integration**: Real-time processing through N8N workflows
- **Minimalist Design**: Apple-inspired dark theme with purple accents
- **Real-time Voting**: Interactive voting system with live results
- **Judge Analysis**: AI-powered analysis of model responses
- **Responsive Design**: Works perfectly on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/klaus-deor/llm-clash-51.git
   cd llm-clash-51
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your webhook URL if needed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

## 🎨 Design Theme

The application features a minimalist design inspired by Apple's design language:

- **Primary Colors**: Deep purple (#7C3AED) and pure black (#000000)
- **Cards**: Dark purple (#0F0F17) with subtle borders
- **Typography**: Clean, hierarchical text system
- **Animations**: Smooth, 200-300ms transitions
- **Glass Effects**: Backdrop blur for modern aesthetics

## 🔧 Configuration

### Webhook Setup

The app connects to an N8N webhook for AI processing. Configure your webhook URL in the environment:

```env
VITE_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-endpoint
```

### Expected Webhook Response Format

```json
[{
  "retorno_juiz": "Judge analysis here...",
  "resposta_a": "First AI response...",
  "resposta_b": "Second AI response...", 
  "resposta_c": "Third AI response..."
}]
```

## 🛠️ Development

### Project Structure

```
src/
├── components/          # React components
│   ├── BattleForm.tsx  # Battle creation form
│   ├── BattleVoting.tsx # Voting interface
│   └── ui/             # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── index.css           # Base styles with CSS variables
└── force-colors.css    # Color override system
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Key Features Implementation

#### Color System
- **CSS Variables**: Base color definitions in `index.css`
- **Force Override**: Complete color enforcement in `force-colors.css`
- **Tailwind Integration**: Custom color tokens in `tailwind.config.ts`

#### Webhook Integration
- **Array Processing**: Handles N8N array response format
- **Error Handling**: Robust error management with fallbacks
- **Debug Logging**: Console logs for development debugging

#### Responsive Design
- **Mobile-first**: Optimized for touch interfaces
- **Breakpoints**: Tailwind responsive utilities
- **Flexible Layout**: CSS Grid and Flexbox

## 🔒 Security

- **Input Validation**: All user inputs are validated
- **Error Boundaries**: React error boundaries for stability
- **CORS Handling**: Proper cross-origin request management
- **Environment Variables**: Sensitive data in environment files

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all dependencies are installed: `npm install`
   - Clear node_modules and reinstall if needed

2. **Webhook Not Working**
   - Check console for network errors
   - Verify webhook URL in environment variables
   - Ensure N8N endpoint is accessible

3. **Colors Not Applied**
   - Verify both CSS files are imported in `main.tsx`
   - Check browser cache (hard refresh)
   - Inspect element to see computed styles

4. **TypeScript Errors**
   - Run `npm run lint` to see specific issues
   - Ensure all imports have correct paths
   - Check `tsconfig.json` configuration

## 📦 Deployment

### Bolt.new Integration

This project is optimized for Bolt.new:

1. **Import Repository**
   ```
   https://github.com/klaus-deor/llm-clash-51
   ```

2. **Auto-sync Active**
   - Changes sync automatically
   - No manual deployment needed

### Manual Deployment

```bash
npm run build
# Deploy 'dist' folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Repository**: https://github.com/klaus-deor/llm-clash-51
- **Live Demo**: Import into Bolt.new for instant preview
- **Issues**: Report bugs and feature requests in GitHub Issues

---

**Built with ❤️ by Klaus Deor**

*A minimalist AI battle platform with Apple-inspired design and purple theme*
