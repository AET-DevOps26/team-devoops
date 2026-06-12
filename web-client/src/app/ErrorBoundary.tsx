import { Component, Fragment, type ErrorInfo, type PropsWithChildren } from 'react'
import { router } from '@/app/router/routes'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type GlobalErrorBoundaryState = {
  hasError: boolean
  resetKey: number
}

export class GlobalErrorBoundary extends Component<PropsWithChildren, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = {
    hasError: false,
    resetKey: 0,
  }

  static getDerivedStateFromError(): Pick<GlobalErrorBoundaryState, 'hasError'> {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) {
      return <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-3">
            <Button className="flex-1" variant="outline" onClick={() => void router.navigate('/')}>
              Go home
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                this.setState((state) => ({
                  hasError: false,
                  resetKey: state.resetKey + 1,
                }))
              }}
            >
              Try again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
}
