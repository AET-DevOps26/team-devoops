import { Component, Fragment, type ErrorInfo, type PropsWithChildren } from 'react'
import { ErrorCard } from '@/components/ui/ErrorCard'

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
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('GlobalErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) {
      return <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    }

    return (
      <ErrorCard
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        actions={[
          { label: 'Go home', onClick: () => window.location.assign('/') },
          {
            label: 'Try again',
            onClick: () => this.setState((s) => ({ hasError: false, resetKey: s.resetKey + 1 })),
          },
        ]}
      />
    )
  }
}
