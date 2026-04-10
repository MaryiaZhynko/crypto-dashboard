import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crypto dashboard</h1>
        <p className="text-muted-foreground text-sm">
          React, TypeScript, Vite, and shadcn/ui are wired up in{' '}
          <code className="bg-muted rounded px-1.5 py-0.5 text-xs">apps/web</code>
          .
        </p>
      </div>
      <Button type="button">Get started</Button>
    </div>
  )
}

export default App
