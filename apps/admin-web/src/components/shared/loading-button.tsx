import {Button } from "@/components/ui/button";


type LoadingButtonProps = React.ComponentProps<typeof Button> & {
    isLoading: boolean;
    loadingText: React.ReactNode;
}


export function LoadingButton({
    isLoading,
    loadingText = "Please wait...",
    disabled,
    children,
    ...buttonProps
}: LoadingButtonProps){
    return (
        <Button
            {...buttonProps}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
        
        >
            {isLoading && (
                <span 
                    className="size-4 animate-spin shrink-0 rounded-full border-2 border-current border-t-transparent"
                />
            )}

            <span aria-live="polite">
                {isLoading ? loadingText : children}
            </span>
        </Button>
    )
}