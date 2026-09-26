declare module 'prismjs' {
  type PrismGrammar = { [key: string]: unknown }

  const Prism: {
    languages: Record<string, PrismGrammar>
    highlight: (code: string, grammar: PrismGrammar, language?: string) => string
  }

  export default Prism
}

declare module 'prismjs/components/prism-typescript'
